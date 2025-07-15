import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Onboard from './pages/Onboard'
import Passport from './pages/Passport'
import Integrate from './pages/Integrate'
import Payments from './pages/Payments'
import Ledger from './pages/Ledger'
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboard" element={<Onboard />} />
          <Route path="/passport" element={<Passport />} />
          <Route path="/integrate" element={<Integrate />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/ledger/:id" element={<Ledger />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App 