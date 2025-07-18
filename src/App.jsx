import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import SmartRouting from './components/SmartRouting'
import Transactions from './components/Transactions'
import Participants from './components/Participants'
import Security from './components/Security'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'smart-routing':
        return <SmartRouting />
      case 'transactions':
        return <Transactions />
      case 'participants':
        return <Participants />
      case 'security':
        return <Security />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="app-container">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        <Header />
        {renderCurrentPage()}
      </main>
    </div>
  )
}

export default App
