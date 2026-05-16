import React from 'react'
import ReactDOM from 'react-dom/client'
import TradingApp from './App.jsx'
import './index.css'

// Fix altezza reale su iOS Safari/PWA
// --vh viene usato come var CSS per avere l'altezza visibile reale
function setVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setVh();
window.addEventListener('resize', setVh);
window.addEventListener('orientationchange', () => setTimeout(setVh, 100));

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
