/**
 * File: App.jsx
 * Description: Main application component that sets up routing for the entire application.
 */

import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Home from './pages/Customer/Home'
import About from './pages/Customer/About'
import Contact from './pages/Customer/Contact'
import Login from './pages/Customer/Login'
import Register from './pages/Customer/Register'
import Header from './components/Header'

/**
 * Component: App
 * Description: Root component containing the BrowserRouter, Header, Sonner Toaster, and application Routes.
 */
const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App