import { v4 as uuidv4 } from 'uuid'

// In-memory storage (simulates blockchain)
let ledgerEntries = []

// Mock data for demonstration
const initializeLedger = () => {
  if (ledgerEntries.length === 0) {
    ledgerEntries = [
      {
        id: 'sample-passport-001',
        type: 'passport',
        timestamp: new Date('2024-01-15T10:30:00Z').toISOString(),
        data: {
          goselId: 'GOSEL_123456789',
          merchantName: 'Tech Solutions Inc',
          registrationNumber: 'REG-2024-001',
          verifyingBank: 'Digital Bank A',
          status: 'verified'
        },
        signature: 'sha256:a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
        blockNumber: 1001,
        transactionHash: '0x1234567890abcdef1234567890abcdef12345678'
      }
    ]
  }
}

// Initialize ledger on import
initializeLedger()

export const addLedgerEntry = (entry) => {
  const newEntry = {
    id: entry.id || uuidv4(),
    type: entry.type,
    timestamp: new Date().toISOString(),
    data: entry.data,
    signature: entry.signature,
    blockNumber: ledgerEntries.length + 1001,
    transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`,
    ...entry
  }
  
  ledgerEntries.push(newEntry)
  return newEntry
}

export const getEntryById = (id) => {
  return ledgerEntries.find(entry => entry.id === id)
}

export const getLatestEntry = (type) => {
  return ledgerEntries
    .filter(entry => entry.type === type)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
}

export const getAllEntries = () => {
  return [...ledgerEntries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export const getEntriesByType = (type) => {
  return ledgerEntries
    .filter(entry => entry.type === type)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export const clearLedger = () => {
  ledgerEntries = []
}

// Export for debugging
export const getLedgerState = () => ledgerEntries 