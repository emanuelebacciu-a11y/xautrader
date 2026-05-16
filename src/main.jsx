import React from 'react'
import ReactDOM from 'react-dom/client'
import TradingApp from './App.jsx'
import './index.css'

// Fix altezza reale su iOS Safari/PWA
// In standalone iOS, screen.height / devicePixelRatio è più affidabile di window.innerHeight
// perché innerHeight può essere ancora aggiornato quando il codice gira al mount
function getViewportHeight() {
  const isStandalone =
    ('standalone' in navigator && navigator.standalone === true) ||
    window.matchMedia('(display-mode: standalone)').matches;

  if (isStandalone) {
    // In PWA standalone su iOS, screen.height in CSS pixel è l'altezza fisica schermo
    // meno la status bar (~54px su iPhone 15 Pro Max con Dynamic Island)
    // Usiamo il minore tra screen.height e visualViewport.height se disponibile
    const screenH = Math.round(screen.height);
    const visualH = window.visualViewport ? Math.round(window.visualViewport.height) : 0;
    const innerH = window.innerHeight;

    // Se visualViewport è disponibile e sano, è il più preciso
    if (visualH > 500) return visualH;
    // Altrimenti innerHeight se sembra corretto (> 800 su iPhone 15 PM)
    if (innerH > 800) return innerH;
    // Ultimo fallback: screen.height (include status bar, ma meglio del nero)
    return screenH;
  }

  // Safari normale: innerHeight già esclude la barra browser
  return window.innerHeight;
}

function setVh() {
  const h = getViewportHeight();
  document.documentElement.style.setProperty('--vh', `${h * 0.01}px`);
  document.documentElement.style.setProperty('--app-height', `${h}px`);
}

// Calcolo iniziale (può essere impreciso se la PWA non è ancora a regime)
setVh();

// Ricalcolo sicuro dopo che tutto è caricato
window.addEventListener('load', () => setTimeout(setVh, 100));

// Quando la PWA torna in foreground dal background
window.addEventListener('pageshow', () => setTimeout(setVh, 50));

// Focus ripristina sempre l'altezza corretta (es. dopo tastiera)
window.addEventListener('focus', setVh);

window.addEventListener('resize', setVh);
window.addEventListener('orientationchange', () => {
  setTimeout(setVh, 100);
  setTimeout(setVh, 500); // doppio: orientamento può essere lento
});

// visualViewport API: più precisa su iOS moderno
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', setVh);
}

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
