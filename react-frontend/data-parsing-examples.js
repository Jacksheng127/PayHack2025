// Example usage of the new TransactionForm data parsing

// Test data examples that users can input:

// Example 1: Semicolon separated
const semicolonData = "TXN_12345;C1093826151;35;M;28007;M348934600;28007;156.50;es_food";

// Example 2: Comma separated  
const commaData = "TXN_12346,C1093826152,28,F,90210,M348934601,90210,2500.75,es_entertainment";

// Example 3: New line separated
const newlineData = `TXN_12347
C1093826153
42
M
12345
M348934602
12345
750.25
es_transportation`;

// Example 4: Partial data (missing fields will be auto-generated)
const partialData = "TXN_12348;C1093826154;30;F;28007";

// Example 5: Minimal data (just transaction ID and amount)
const minimalData = "TXN_12349;;25;;;;;;1000.00";

console.log("Data parsing examples:");
console.log("1. Semicolon:", semicolonData);
console.log("2. Comma:", commaData);
console.log("3. Newline:", newlineData);
console.log("4. Partial:", partialData);
console.log("5. Minimal:", minimalData);

// The parsing function will handle:
// - Automatic detection of separator (;, ,, or newline)
// - Auto-generation of missing fields
// - Data type conversion (string to number for age/amount)
// - Validation of critical fields
// - Error handling for invalid data
