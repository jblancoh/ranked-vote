import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { Analytics } from '@vercel/analytics/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
      <Analytics />
    </ThemeProvider>
  </React.StrictMode>
)
