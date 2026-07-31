/**
 * File: App.jsx
 * Description: Main application component that sets up routing for the entire application.
 */

import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Home from './components/Home'
import About from './pages/Customer/About'
import Contact from './components/Contact'
import Profile from './pages/Customer/Profile.jsx'
import SignIn from './pages/Auth/SignIn'
// import Register from './pages/Customer/Register'
import SignUp from './pages/Auth/SignUp'
// import Header from './components/Header'
import Header1 from './components/Header1'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/Customer/CreateListing.jsx'
import UpdateListing from './pages/Customer/UpdateListing.jsx'
import Listing from './pages/Customer/Listing.jsx'
import Search from './pages/Customer/Search.jsx'

/**
 * Component: App
 * Description: Root component containing the BrowserRouter, Header, Sonner Toaster, and application Routes.
 */
const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Header1 />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/listing/:listingId' element={<Listing />} />
        <Route path='/search' element={<Search />} />

        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/update-listing/:listingId' element={<UpdateListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App