import React from 'react'

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'fas fa-chart-line', label: 'Dashboard' },
    { id: 'smart-routing', icon: 'fas fa-route', label: 'Smart Routing' },
    { id: 'transactions', icon: 'fas fa-exchange-alt', label: 'Transactions' },
    { id: 'participants', icon: 'fas fa-users', label: 'Participants' },
    { id: 'security', icon: 'fas fa-shield-alt', label: 'Security' }
  ]

  return (
    <aside className="sidebar">
      <div className="logo">
        <h1>GOSEL</h1>
      </div>
      <nav className="nav-menu">
        <ul>
          {menuItems.map(item => (
            <li 
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>
      <div className="user-info">
        <div className="user-avatar">
          AU
        </div>
        <div className="user-details">
          <h4>Admin User</h4>
          <p>System Administrator</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
