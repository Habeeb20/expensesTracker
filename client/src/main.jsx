import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <ThemeProvider>
      <App />
      <Toaster position="top-right" richColors closeButton />
    </ThemeProvider>

  </StrictMode>,
)
