import React, { useState } from 'react'

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="header">
      <div className="search-bar">
        <i className="fas fa-search"></i>
        <input 
          type="text" 
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="header-right">
        <div className="notifications">
          <i className="fas fa-bell"></i>
          <span className="badge">3</span>
        </div>
        <div className="settings">
          <i className="fas fa-cog"></i>
        </div>
      </div>
    </header>
  )
}

export default Header
