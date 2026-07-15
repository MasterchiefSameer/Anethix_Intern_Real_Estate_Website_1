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
import { store } from './redux/store.js';
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  // </StrictMode>,
)
