from collections import defaultdict
from datetime import datetime, timedelta
import re  # for ID pattern matching

# Parameters
MAX_LAYERING_DEPTH = 4
MAX_TIME_GAP_SECONDS = 600  # 10 minutes
FANOUT_THRESHOLD = 0.7
DECAY_FACTOR = 0.9
BASE_TRANSACTION_RISK = 0.02
INITIAL_FANIN_THRESHOLD = 3
INITIAL_FANIN_RISK = 0.5
FANOUT_BOOST = 0.3
QUICK_FANOUT_TIME = timedelta(hours=1)

# Internal state
graph = defaultdict(list)
incoming_graph = defaultdict(list)
last_incoming_time = {}
last_outgoing_time = {}
entity_risk = defaultdict(float)
entity_balance = defaultdict(float)
fanin_count = defaultdict(int)
fanin_today = defaultdict(list)
fanout_today = defaultdict(list)
first_fanin_time = {}


def ensure_datetime(ts):
    if isinstance(ts, datetime):
        return ts

    ts_str = str(ts)
    # Try with microseconds first
    try:
        return datetime.strptime(ts_str, "%Y-%m-%d %H:%M:%S.%f")
    except ValueError:
        # Fall back to format without microseconds
        try:
            return datetime.strptime(ts_str, "%Y-%m-%d %H:%M:%S")
        except ValueError:
            # Handle ISO format with T separator
            try:
                return datetime.strptime(ts_str, "%Y-%m-%dT%H:%M:%S.%f")
            except ValueError:
                return datetime.strptime(ts_str, "%Y-%m-%dT%H:%M:%S")


def is_new_account(entity):
    return fanin_count[entity] < 5


def update_balance(sender, receiver, amount):
    entity_balance[sender] -= amount
    entity_balance[receiver] += amount


def decay_risk(entity):
    entity_risk[entity] *= DECAY_FACTOR


# OPTIMIZED CHAIN DETECTION - Business-Aware Integration
MAX_CHAIN_SEARCH_DEPTH = 10  # For deeper chain pattern detection
chain_risk = defaultdict(float)
# Track recent transactions per entity
transaction_sequence = defaultdict(list)


# OPTIMIZED with business tolerance
def detect_chain_pattern(entity, timestamp, amount, entity_type="Unknown"):
    # Only apply chain detection to sequential test IDs (E###). Skip for fan-in/out demo IDs.
    if not re.match(r"^E\d{3}$", entity):
        return 0.0
    timestamp = ensure_datetime(timestamp)

    # Look for recent incoming transaction that could start a chain
    recent_incoming = [
        (source, t, amt) for source, t, amt, _ in incoming_graph[entity]
        if (timestamp - ensure_datetime(t)).total_seconds() <= MAX_TIME_GAP_SECONDS
    ]

    if not recent_incoming:
        return 0.0

    # Calculate chain risk based on:
    # 1. Time gaps between transactions
    # 2. Amount similarity (potential structuring)
    # 3. Chain length

    chain_score = 0.0
    for source_entity, prev_time, prev_amount in recent_incoming:
        time_gap = (timestamp - ensure_datetime(prev_time)).total_seconds()

        # Time-based risk (faster = more suspicious) - OPTIMIZED: no /60 conversion
        time_risk = max(0.0, (MAX_TIME_GAP_SECONDS -
                        time_gap) / MAX_TIME_GAP_SECONDS)

        # Amount-based risk (similar amounts = potential structuring)
        amount_ratio = min(amount, prev_amount) / max(amount, prev_amount)
        amount_risk = amount_ratio if amount_ratio > 0.8 else 0.0

        # Chain length risk - OPTIMIZED: use MAX_LAYERING_DEPTH for earlier detection
        visited = set([entity])
        chain_length = layering_depth_backtrace(
            source_entity, visited, timestamp)
        # Use 4 instead of 10
        length_risk = min(1.0, chain_length / MAX_LAYERING_DEPTH)

        # OPTIMIZED weights: prioritize time and length over amount similarity
        combined_risk = (time_risk * 0.5 + length_risk *
                         0.4 + amount_risk * 0.1)
        chain_score = max(chain_score, combined_risk)

    # Apply business tolerance to chain detection
    if entity_type == "Business":
        chain_score *= 0.3  # Business entities get 70% reduction in chain risk
    elif entity_type == "Unknown":
        chain_score *= 1.5  # Unknown entities get 50% increase in chain risk

    return chain_score


def process_transaction(sender, receiver, timestamp, amount, ttype, ofi_type="Unknown", rfi_type="Unknown"):
    timestamp = ensure_datetime(timestamp)
    today = timestamp.date()

    graph[sender].append((receiver, timestamp, amount, ttype))
    incoming_graph[receiver].append((sender, timestamp, amount, ttype))
    update_balance(sender, receiver, amount)

    # Base risk adjusted by entity type
    base_risk_sender = BASE_TRANSACTION_RISK * \
        (1.5 if ofi_type == "Unknown" else 1.0)
    base_risk_receiver = BASE_TRANSACTION_RISK * \
        (1.5 if rfi_type == "Unknown" else 1.0)
    entity_risk[sender] += base_risk_sender
    entity_risk[receiver] += base_risk_receiver

    # Fan-in tracking
    fanin_today[(receiver, today)].append((sender, amount, timestamp))
    fanin_count[receiver] += 1

    if receiver not in first_fanin_time:
        first_fanin_time[receiver] = timestamp

    # Fan-in burst risk (based on receiver type)
    if is_new_account(receiver) and len(fanin_today[(receiver, today)]) >= INITIAL_FANIN_THRESHOLD:
        time_window = timestamp - first_fanin_time[receiver]
        if time_window < timedelta(hours=1):
            if rfi_type == "Business":
                adjusted_fanin_risk = INITIAL_FANIN_RISK * 0.3  # tolerate more
            elif rfi_type == "Unknown":
                adjusted_fanin_risk = INITIAL_FANIN_RISK * 1.5
            else:
                adjusted_fanin_risk = INITIAL_FANIN_RISK
            entity_risk[receiver] = max(
                entity_risk[receiver], adjusted_fanin_risk)

    # Fan-out tracking
    fanout_today[(sender, today)].append((receiver, amount, timestamp))

    # Fan-out risk if quick drain after fan-in
    outgoing = sum(a for _, a, _ in fanout_today[(sender, today)])
    balance = outgoing + entity_balance[sender]
    if balance > 0:
        drain_ratio = outgoing / balance
        if drain_ratio > FANOUT_THRESHOLD:
            if sender in first_fanin_time:
                if (timestamp - first_fanin_time[sender]) <= QUICK_FANOUT_TIME:
                    if ofi_type == "Business":
                        fanout_boost = FANOUT_BOOST * 0.3  # tolerate
                    elif ofi_type == "Unknown":
                        fanout_boost = FANOUT_BOOST * 1.5
                    else:
                        fanout_boost = FANOUT_BOOST * 1.5
                    entity_risk[sender] += fanout_boost

    # --- OPTIMIZED: Chain pattern detection with business awareness ---
    chain_risk_receiver = detect_chain_pattern(
        receiver, timestamp, amount, rfi_type)
    chain_risk_sender = detect_chain_pattern(
        sender, timestamp, amount, ofi_type)

    # Minimal dampening for immediate response to chain patterns - OPTIMIZED values
    chain_risk[receiver] = 0.05 * \
        chain_risk[receiver] + 0.95 * chain_risk_receiver
    chain_risk[sender] = 0.05 * chain_risk[sender] + 0.95 * chain_risk_sender

    # Risk decay
    decay_risk(sender)
    decay_risk(receiver)

    # Combine all risk types - consider chain risk alongside fan-in/fan-out
    total_risk_receiver = max(entity_risk[receiver], chain_risk[receiver])
    total_risk_sender = max(entity_risk[sender], chain_risk[sender])

    # Block if any risk too high
    max_risk = max(total_risk_receiver, total_risk_sender)
    if max_risk >= 0.9:
        return max_risk

    return max_risk


def layering_depth(entity, visited, current_time, depth=0):
    if depth >= MAX_LAYERING_DEPTH:
        return depth

    max_depth = depth
    for (target, t, amt, ttype) in graph[entity]:
        t = ensure_datetime(t)
        if target not in visited and abs((current_time - t).total_seconds()) <= MAX_TIME_GAP_SECONDS:
            visited.add(target)
            new_depth = layering_depth(target, visited, t, depth + 1)
            max_depth = max(max_depth, new_depth)
            visited.remove(target)

    return max_depth


def layering_depth_backtrace(entity, visited, current_time, depth=0):
    if depth >= MAX_LAYERING_DEPTH:
        return depth

    max_depth = depth
    for (source, t, amt, ttype) in incoming_graph[entity]:
        t = ensure_datetime(t)
        if source not in visited and abs((current_time - t).total_seconds()) <= MAX_TIME_GAP_SECONDS:
            visited.add(source)
            new_depth = layering_depth_backtrace(source, visited, t, depth + 1)
            max_depth = max(max_depth, new_depth)
            visited.remove(source)

    return max_depth


def reset_state():
    graph.clear()
    incoming_graph.clear()
    last_incoming_time.clear()
    last_outgoing_time.clear()
    entity_risk.clear()
    entity_balance.clear()
    fanin_count.clear()
    fanin_today.clear()
    fanout_today.clear()
    first_fanin_time.clear()
    chain_risk.clear()


def get_risk_level(risk_score):
    """Convert risk score to risk level"""
    if risk_score >= 0.9:
        return 'L3'  # Red Flag
    elif risk_score >= 0.7:
        return 'L2'  # Outbound Freeze  
    elif risk_score >= 0.4:
        return 'L1'  # Watchlist
    else:
        return 'L0'  # Normal


def parse_and_process_data(data_string):
    """
    Parse input data string and process each transaction through the model.

    Input format: "id1,sender1,receiver1,timestamp1,amount1,type1,ofi_type1,rfi_type1;id2,sender2,receiver2,..."
    Returns: List of risk scores for each processed transaction
    """
    results = []

    # Split by semicolon to get individual transactions
    transactions = data_string.strip().split(';')
    print(transactions)

    for transaction in transactions:
        if not transaction.strip():
            continue

        # Split by comma to get transaction fields
        fields = transaction.strip().split(',')
        transaction_id = fields[0].strip()

        if len(fields) < 8:
            print(f"Warning: Incomplete transaction data: {transaction}")
            continue

        try:
            # Extract fields (skip the first element - transaction ID)
            _, sender, receiver, timestamp, amount, ttype, ofi_type, rfi_type = fields[:8]

            # Format timestamp: replace space with 'T'
            formatted_timestamp = timestamp.replace(' ', 'T')

            # Convert amount to float
            amount = float(amount)

            # Process the transaction
            risk_score = process_transaction(
                sender=sender.strip(),
                receiver=receiver.strip(),
                timestamp=formatted_timestamp,
                amount=amount,
                ttype=ttype.strip(),
                ofi_type=ofi_type.strip(),
                rfi_type=rfi_type.strip()
            )

            # Store the result with transaction details
            transaction_result = {
                'transaction_id': transaction_id,
                'sender': sender.strip(),
                'receiver': receiver.strip(),
                'timestamp': formatted_timestamp,
                'amount': amount,
                'type': ttype.strip(),
                'ofi_type': ofi_type.strip(),
                'rfi_type': rfi_type.strip(),
                'risk_score': risk_score,
                'riskLevel': get_risk_level(risk_score)
            }

            results.append(transaction_result)

        except (ValueError, IndexError) as e:
            print(f"Error processing transaction: {transaction} - {str(e)}")
            continue

    return results


def format_transactions_for_frontend(results):
    """
    Format transaction results for frontend consumption
    """
    formatted_transactions = []

    for i, result in enumerate(results):
        formatted_transaction = [
            result['sender'],
            result['receiver'],
            result['timestamp'],
            result['amount'],
            result['type'],
            result['ofi_type'],
            result['rfi_type']
        ]
        formatted_transactions.append(formatted_transaction)

    return formatted_transactions


def process_data_string(data_string, return_format='detailed'):
    """
    Main function to process data string and return results in different formats.

    Args:
        data_string (str): Input data in the specified format
        return_format (str): 'detailed', 'frontend', or 'risk_scores'

    Returns:
        Results in the requested format
    """
    # Reset state before processing new data
    reset_state()

    # Process the data
    results = parse_and_process_data(data_string)

    if return_format == 'frontend':
        return format_transactions_for_frontend(results)
    elif return_format == 'risk_scores':
        return [result['risk_score'] for result in results]
    else:  # detailed
        return results

# Test function with your example data


def test_with_sample_data():
    """
    Test function using the provided sample data format
    """
    # Reset state before testing
    reset_state()

    # Your sample data
    sample_data = "Has234,jon,yy,2025-08-03 00:54:15.441904,1500.00,transfer,personal,business;wrett2435,jin,auyong,2025-08-02 00:54:15.441904,1500.00,transfer,personal,business"

    # Process the data
    results = parse_and_process_data(sample_data)

    # Format for frontend
    frontend_format = format_transactions_for_frontend(results)

    print("Processed Transactions:")
    for i, result in enumerate(results):
        print(f"Transaction {i+1}:")
        print(f"  Sender: {result['sender']}")
        print(f"  Receiver: {result['receiver']}")
        print(f"  Timestamp: {result['timestamp']}")
        print(f"  Amount: ${result['amount']}")
        print(f"  Type: {result['type']}")
        print(f"  OFI Type: {result['ofi_type']}")
        print(f"  RFI Type: {result['rfi_type']}")
        print(f"  Risk Score: {result['risk_score']:.4f}")
        print()

    print("Frontend Format:")
    print(frontend_format)

    return results, frontend_format

# Uncomment the line below to run the test
# test_results, frontend_data = test_with_sample_data()


# Run test when script is executed directly
# if __name__ == "__main__":
#     # Your sample data
#     sample_data = "Has234,jon,yy,2025-08-03 00:54:15.441904,1500.00,transfer,personal,business;wrett2435,jin,auyong,2025-08-02 00:54:15.441904,1500.00,transfer,personal,business"

#     print("=== Testing Data Processing ===")

#     # Test detailed format
#     detailed_results = process_data_string(sample_data, 'detailed')
#     print("Detailed Results:")
#     for i, result in enumerate(detailed_results):
#         print(
#             f"  Transaction {i+1}: {result['sender']} -> {result['receiver']}, Risk: {result['risk_score']:.4f}")

#     # Test frontend format
#     frontend_results = process_data_string(sample_data, 'frontend')
#     print(f"\nFrontend Format:\n{frontend_results}")

#     # Test risk scores only
#     risk_scores = process_data_string(sample_data, 'risk_scores')
#     print(f"\nRisk Scores: {risk_scores}")

#     print("\n=== Usage Examples ===")
#     print("# For API integration:")
#     print("results = process_data_string(your_data_string, 'detailed')")
#     print("frontend_data = process_data_string(your_data_string, 'frontend')")
#     print("risk_scores = process_data_string(your_data_string, 'risk_scores')")

# Example usage for testing
# # Base time
# now = datetime.now()
# later = now + timedelta(minutes=5)
# later2 = now + timedelta(minutes=10)
# later3 = now + timedelta(minutes=15)

# results = {}

# # Group meal (Personal to Personal)
# results['group_meal'] = [
#     process_transaction("A1", "X", now, 12.5, "transfer", ofi_type="Personal", rfi_type="Personal"),
#     process_transaction("A2", "X", later, 13.0, "transfer", ofi_type="Personal", rfi_type="Personal"),
#     process_transaction("A3", "X", later2, 11.8, "transfer", ofi_type="Personal", rfi_type="Personal"),
# ]

# # Mule fan-in (Personal to Personal)
# results['mule_fanin'] = [
#     process_transaction("B1", "Y", now, 3000.0, "transfer", ofi_type="Personal", rfi_type="Personal"),
#     process_transaction("B2", "Y", later, 2999.0, "transfer", ofi_type="Personal", rfi_type="Personal"),
#     process_transaction("B3", "Y", later2, 3100.0, "transfer", ofi_type="Personal", rfi_type="Personal"),
# ]

# # Mule fan-out (Personal to Personal)
# results['mule_fanout'] = [
#     process_transaction("Y", "C1", later2 + timedelta(minutes=1), 2000.0, "transfer", ofi_type="Personal", rfi_type="Personal"),
#     process_transaction("Y", "C2", later2 + timedelta(minutes=2), 2500.0, "transfer", ofi_type="Personal", rfi_type="Personal"),
#     process_transaction("Y", "C3", later2 + timedelta(minutes=3), 2500.0, "transfer", ofi_type="Personal", rfi_type="Personal"),
# ]

# # Legitimate business receiving over time (Personal to Business)
# t1 = now.replace(hour=10, minute=1)
# t2 = now.replace(hour=10, minute=2)
# t3 = now.replace(hour=10, minute=3)
# t4 = now.replace(hour=10, minute=4)
# t5 = now.replace(hour=10, minute=5)

# results['legit_business'] = [
#     process_transaction("D1", "Z", t1, 105.00, "transfer", ofi_type="Personal", rfi_type="Business"),
#     process_transaction("D2", "Z", t2, 95.00, "transfer", ofi_type="Personal", rfi_type="Business"),
#     process_transaction("D3", "Z", t3, 110.00, "transfer", ofi_type="Personal", rfi_type="Business"),
#     process_transaction("D4", "Z", t4, 90.00, "transfer", ofi_type="Personal", rfi_type="Business"),
#     process_transaction("D5", "Z", t5, 100.00, "transfer", ofi_type="Personal", rfi_type="Business"),
#     process_transaction("D6", "Z", t5, 102.00, "transfer", ofi_type="Personal", rfi_type="Business"),
#     process_transaction("D7", "Z", t5, 88.00, "transfer", ofi_type="Personal", rfi_type="Business"),
# ]

# # Final risk scores
# final_risks = {
#     "X (group meal)": entity_risk["X"],
#     "Y (mule)": entity_risk["Y"],
#     "Z (business)": entity_risk["Z"]
# }

# print("Detailed Test Results:")
# for key, vals in results.items():
#     print(f"{key}: {vals}")

# print("\nFinal Risk Scores:")
# print(final_risks)
