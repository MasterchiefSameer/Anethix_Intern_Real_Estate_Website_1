/**
 * File: About.jsx
 * Description: Page providing information about the real estate company.
 */

import React from 'react'

/**
 * Component: About
 * Description: Renders the about us page with company history and mission.
 */
const About = () => {
  return (
    <div className="py-20 px-4 max-w-6xl mx-auto">
        <h1 className="text-4xl font-semibold text-slate-700 mb-4">About Anethix RealEstate</h1>
        <p className="text-slate-600 mb-4">
            Welcome to Anethix Real Estate, where your dream home finds you. Founded with a vision to 
            simplify the process of buying and selling properties.
        </p>
        <p className="text-slate-600 mb-4">
          Our mission is to provide exceptional service and guidance to our clients,
           helping them find the perfect property that matches their needs and preferences.
        </p>
        <p className="text-slate-600 mt-4">
           With years of experience in the real estate industry, our team of dedicated professionals
            is committed to helping you achieve your property goals with integrity, transparency,
             and excellence.
        </p>
        <h1 className="text-slate-600 mt-4">
          As the largest platform connecting property buyers and sellers, Anethix Real Estate boasts over 2 crore monthly visitors and 15 lakh active property listings. With over 17 years of experience, Anethix has evolved into a comprehensive service provider, offering home loans, interiors and expert advice.
        </h1>
        <h1 className="text-slate-600 mt-4">
          Anethix also offers extensive research-based knowledge and insight-driven platforms like MBTV, India's leading online real estate YouTube channel, along with proprietary tools providing home buyers with price trends, forecasts and locality reviews.
        </h1>
        <p className="text-slate-600 mt-4">
           Whether you are looking to buy, sell, or invest in property, we are here to guide you 
           every step of the way.
        </p>
    </div>
  )
}

export default About