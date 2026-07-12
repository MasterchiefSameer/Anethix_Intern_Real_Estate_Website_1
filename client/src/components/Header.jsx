/**
 * File: Header.jsx
 * Description: Navigation bar component for the application.
 */

import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

/**
 * Component: Header
 * Description: Displays the main navigation menu with links to various pages.
 * It checks local storage for a signed-in user and toggles between Sign In and Logout buttons.
 */
const Header = () => {
  const [user, setUser] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  // Re-check authentication state whenever the route changes
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    } else {
      setUser(null)
    }
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    setUser(null)
    navigate("/login")
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              Anethix Real Estate
            </Link>
          </div>
          <nav className="flex space-x-4 items-center">
            <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Contact</Link>
            
            {user ? (
              <button 
                onClick={handleLogout}
                className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-red-200"
              >
                Log out
              </button>
            ) : (
              <Link to="/login" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">Sign In</Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header