/**
 * File: Contact.jsx
 * Description: Page for users to contact the real estate company.
 */

import React from 'react'

/**
 * Component: Contact
 * Description: Renders the contact form and company contact information.
 */
const Contact = () => {
  return (
    <div className="py-20 px-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-slate-700 mb-4">
        Company Contact Page
      </h1>
      <p className="text-slate-600 mt-4">
        <span>Email:</span> team@anethixlabs.com
      </p>
      <p className="text-slate-600 mt-4">
        <span> Phone number:  </span>+91-9876543210
      </p>
    </div>
  )
}

export default Contact