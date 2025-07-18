import React, { useState } from 'react'

const Transactions = () => {
  const [filters, setFilters] = useState({
    txnId: '',
    psp: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: ''
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  const mockTransactions = [
    {
      id: 'TXN-38291',
      dateTime: '2023-07-15 14:32:18',
      sender: 'John Smith',
      receiver: 'ABC Company',
      amount: '$1,250.00',
      fxRate: '1 USD = 4.21 MYR',
      paymentPath: 'Maybank → DBS',
      status: 'Success'
    },
    {
      id: 'TXN-38290',
      dateTime: '2023-07-15 14:28:05',
      sender: 'Sarah Lee',
      receiver: 'XYZ Corp',
      amount: '$3,750.00',
      fxRate: '1 USD = 1.35 SGD',
      paymentPath: 'AmBank → UOB',
      status: 'Success'
    },
    {
      id: 'TXN-38289',
      dateTime: '2023-07-15 14:15:42',
      sender: 'Tan Wei Ming',
      receiver: 'Global Imports',
      amount: '$850.00',
      fxRate: '1 USD = 4.21 MYR',
      paymentPath: 'TnG → GrabPay → DBS',
      status: 'Success'
    },
    {
      id: 'TXN-38288',
      dateTime: '2023-07-15 14:10:37',
      sender: 'Ahmad Zulkifli',
      receiver: 'Tech Solutions',
      amount: '$2,100.00',
      fxRate: '1 USD = 4.21 MYR',
      paymentPath: 'Maybank → DBS',
      status: 'Success'
    },
    {
      id: 'TXN-38287',
      dateTime: '2023-07-15 14:05:22',
      sender: 'Lisa Wong',
      receiver: 'Digital Services',
      amount: '$500.00',
      fxRate: '1 USD = 1.35 SGD',
      paymentPath: 'GrabPay → DBS',
      status: 'Failed'
    }
  ]

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const resetFilters = () => {
    setFilters({
      txnId: '',
      psp: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: ''
    })
  }

  const openTransactionDetail = (transaction) => {
    setSelectedTransaction(transaction)
  }

  const closeModal = () => {
    setSelectedTransaction(null)
  }

  return (
    <div className="page">
      <h2>Transaction History</h2>
      
      <div className="search-filters">
        <div className="filter-group">
          <input 
            type="text" 
            placeholder="Transaction ID"
            value={filters.txnId}
            onChange={(e) => handleFilterChange('txnId', e.target.value)}
          />
          <select 
            value={filters.psp}
            onChange={(e) => handleFilterChange('psp', e.target.value)}
          >
            <option value="">All PSPs</option>
            <option value="maybank">Maybank</option>
            <option value="ambank">AmBank</option>
            <option value="tng">Touch n Go</option>
            <option value="grabpay">GrabPay</option>
            <option value="dbs">DBS</option>
          </select>
          <select 
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="filter-group">
          <input 
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
          />
          <input 
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
          />
          <input 
            type="number" 
            placeholder="Min Amount"
            value={filters.minAmount}
            onChange={(e) => handleFilterChange('minAmount', e.target.value)}
          />
          <input 
            type="number" 
            placeholder="Max Amount"
            value={filters.maxAmount}
            onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <button className="btn primary">Search</button>
          <button className="btn secondary" onClick={resetFilters}>Reset</button>
          <button className="btn outline">Export</button>
        </div>
      </div>

      <div className="transaction-list">
        <table className="data-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date & Time</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Amount</th>
              <th>FX Rate</th>
              <th>Payment Path</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockTransactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.id}</td>
                <td>{transaction.dateTime}</td>
                <td>{transaction.sender}</td>
                <td>{transaction.receiver}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.fxRate}</td>
                <td>{transaction.paymentPath}</td>
                <td>
                  <span className={`status ${transaction.status.toLowerCase()}`}>
                    {transaction.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn outline"
                    onClick={() => openTransactionDetail(transaction)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="btn outline">
          <i className="fas fa-chevron-left"></i>
        </button>
        <span>Page {currentPage} of 10</span>
        <button className="btn outline">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Transaction Details</h3>
              <button className="close-modal" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="transaction-detail">
                <h4>Transaction ID: {selectedTransaction.id}</h4>
                <p><strong>Date & Time:</strong> {selectedTransaction.dateTime}</p>
                <p><strong>Sender:</strong> {selectedTransaction.sender}</p>
                <p><strong>Receiver:</strong> {selectedTransaction.receiver}</p>
                <p><strong>Amount:</strong> {selectedTransaction.amount}</p>
                <p><strong>FX Rate:</strong> {selectedTransaction.fxRate}</p>
                <p><strong>Payment Path:</strong> {selectedTransaction.paymentPath}</p>
                <p><strong>Status:</strong> {selectedTransaction.status}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transactions
