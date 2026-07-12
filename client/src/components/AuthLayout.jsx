/**
 * File: AuthLayout.jsx
 * Description: Layout component for the authentication pages (Login and Register).
 * It provides a consistent background and centered container for the auth forms.
 */

/**
 * Component: AuthLayout
 * Description: Renders a centered layout for its children, typically auth forms, 
 * with a subtle background design and a link back to the homepage.
 */
import { Link } from "react-router-dom";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="text-3xl font-extrabold text-blue-600 hover:text-blue-500 transition-colors">
            Anethix Real Estate
          </Link>
        </div>
        <h2 className="mt-4 text-center text-sm text-gray-600">
          Your dream property awaits
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}
