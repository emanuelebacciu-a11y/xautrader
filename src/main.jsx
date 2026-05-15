import React from 'react'
import ReactDOM from 'react-dom/client'
import TradingApp from './App.jsx'
import './index.css'

// Registra Service Worker per PWA offline
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('[SW] Registrato:', reg.scope))
      .catch(err => console.warn('[SW] Fallito:', err));
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TradingApp />
  </React.StrictMode>
)
