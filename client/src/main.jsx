/**
 * File: main.jsx
 * Description: Entry point of the React application. Mounts the root component into the DOM.
 */

/**
 * Main application render
 * Description: Wraps the App component in StrictMode and renders it into the 'root' DOM element.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
