import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { VersionProvider } from './context/VersionContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <VersionProvider>
      <App />
    </VersionProvider>
  </React.StrictMode>
)
