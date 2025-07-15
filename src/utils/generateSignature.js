// Simple hash function for demonstration purposes
// In production, you'd use a proper cryptographic library
const simpleHash = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash.toString(16)
}

export const generateSignature = (data) => {
  // Convert data to string if it's an object
  const dataString = typeof data === 'object' ? JSON.stringify(data) : data.toString()
  
  // Add timestamp and random salt for uniqueness
  const timestamp = Date.now().toString()
  const salt = Math.random().toString(36).substring(2, 15)
  const combined = `${dataString}${timestamp}${salt}`
  
  // Generate hash
  const hash = simpleHash(combined)
  
  // Create a more realistic-looking signature
  const signature = `sha256:${hash}${Math.random().toString(16).substr(2, 32)}`
  
  return signature
}

export const verifySignature = (data, signature) => {
  // In a real implementation, this would verify the signature
  // For demo purposes, we'll just check if it looks like a valid signature
  return signature && signature.startsWith('sha256:') && signature.length > 40
}

export const generateGoselId = (merchantName, registrationNumber) => {
  const nameHash = simpleHash(merchantName)
  const regHash = simpleHash(registrationNumber)
  const timestamp = Date.now().toString().slice(-6)
  
  return `GOSEL_${nameHash}_${regHash}_${timestamp}`
}

export const generateTransactionId = () => {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `TXN_${timestamp}_${random}`
} 