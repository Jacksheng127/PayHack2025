import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateSignature, generateGoselId } from '../utils/generateSignature'
import { addLedgerEntry } from '../utils/mockLedger'

const Onboard = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    merchantName: '',
    registrationNumber: '',
    verifyingBank: '',
    businessType: '',
    email: '',
    phone: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const banks = [
    { id: 'digital-bank-a', name: 'Digital Bank A', icon: '🏦' },
    { id: 'fintech-bank-b', name: 'FinTech Bank B', icon: '💳' },
    { id: 'crypto-bank-c', name: 'Crypto Bank C', icon: '₿' },
    { id: 'traditional-bank-d', name: 'Traditional Bank D', icon: '🏛️' }
  ]

  const businessTypes = [
    'E-commerce',
    'SaaS',
    'Marketplace',
    'Digital Services',
    'Healthcare',
    'Education',
    'Finance',
    'Other'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.merchantName.trim()) {
      newErrors.merchantName = 'Merchant name is required'
    }
    
    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required'
    }
    
    if (!formData.verifyingBank) {
      newErrors.verifyingBank = 'Please select a verifying bank'
    }
    
    if (!formData.businessType) {
      newErrors.businessType = 'Please select a business type'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate GOSEL ID
      const goselId = generateGoselId(formData.merchantName, formData.registrationNumber)
      
      // Create passport data
      const passportData = {
        goselId,
        merchantName: formData.merchantName,
        registrationNumber: formData.registrationNumber,
        verifyingBank: formData.verifyingBank,
        businessType: formData.businessType,
        email: formData.email,
        phone: formData.phone,
        status: 'verified',
        verificationLevel: 'KYB_COMPLETE'
      }
      
      // Generate signature
      const signature = generateSignature(passportData)
      
      // Add to ledger
      const ledgerEntry = addLedgerEntry({
        type: 'passport',
        data: passportData,
        signature
      })
      
      console.log('Merchant onboarded successfully:', ledgerEntry)
      
      // Redirect to passport page
      navigate('/passport')
      
    } catch (error) {
      console.error('Onboarding failed:', error)
      setErrors({
        submit: 'Onboarding failed. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📝 Merchant Onboarding
          </h1>
          <p className="text-lg text-gray-600">
            Create your merchant profile and get verified on the GOSEL network
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Merchant Name */}
            <div>
              <label htmlFor="merchantName" className="block text-sm font-medium text-gray-700 mb-2">
                Merchant Name *
              </label>
              <input
                type="text"
                id="merchantName"
                name="merchantName"
                value={formData.merchantName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.merchantName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your business name"
              />
              {errors.merchantName && (
                <p className="mt-1 text-sm text-red-600">{errors.merchantName}</p>
              )}
            </div>

            {/* Registration Number */}
            <div>
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number *
              </label>
              <input
                type="text"
                id="registrationNumber"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.registrationNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter business registration number"
              />
              {errors.registrationNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.registrationNumber}</p>
              )}
            </div>

            {/* Business Type */}
            <div>
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                Business Type *
              </label>
              <select
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.businessType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select business type</option>
                {businessTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.businessType && (
                <p className="mt-1 text-sm text-red-600">{errors.businessType}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Verifying Bank */}
            <div>
              <label htmlFor="verifyingBank" className="block text-sm font-medium text-gray-700 mb-2">
                Verifying Bank *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {banks.map(bank => (
                  <label
                    key={bank.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      formData.verifyingBank === bank.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="verifyingBank"
                      value={bank.id}
                      checked={formData.verifyingBank === bank.id}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span className="text-2xl mr-3">{bank.icon}</span>
                    <span className="text-sm font-medium text-gray-900">{bank.name}</span>
                  </label>
                ))}
              </div>
              {errors.verifyingBank && (
                <p className="mt-1 text-sm text-red-600">{errors.verifyingBank}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isLoading
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500'
                }`}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Processing Onboarding...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🚀</span>
                    Complete Onboarding
                  </>
                )}
              </button>
            </div>

            {errors.submit && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}
          </form>
        </div>

        {/* Information Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            🔐 What happens next?
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your information will be verified by the selected bank</li>
            <li>• A unique GOSEL ID will be generated for your merchant account</li>
            <li>• A digital passport will be created and stored on the blockchain</li>
            <li>• You'll be able to use this passport to integrate with multiple PSPs</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Onboard 