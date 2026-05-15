import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Flame, ChevronRight, Star, X, Check } from 'lucide-react';

/* ============= GLOBAL STYLES — Apple motion system ============= */
const GLOBAL_CSS = `
  @keyframes xt-fade-up {
    from { opacity:0; transform:translateY(18px) scale(0.98); }
    to   { opacity:1; transform:translateY(0)    scale(1);    }
  }
  @keyframes xt-slide-in-right {
    from { opacity:0; transform:translateX(28px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes xt-slide-in-left {
    from { opacity:0; transform:translateX(-28px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes xt-scale-in {
    from { opacity:0; transform:scale(0.94); }
    to   { opacity:1; transform:scale(1); }
  }
  @keyframes xt-check-in {
    0%   { transform: scale(0) rotate(-20deg); opacity:0; }
    60%  { transform: scale(1.3) rotate(5deg);  opacity:1; }
    100% { transform: scale(1)   rotate(0deg);  opacity:1; }
  }
  @keyframes xt-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes xt-breathe {
    0%,100% { opacity:1; }
    50%      { opacity:0.45; }
  }
  @keyframes xt-pop {
    0%   { transform: scale(1); }
    35%  { transform: scale(0.91); }
    65%  { transform: scale(1.06); }
    100% { transform: scale(1); }
  }

  .xt-page { animation: xt-fade-up 0.36s cubic-bezier(0.34,1.18,0.64,1) both; }

  .xt-card {
    animation: xt-scale-in 0.30s cubic-bezier(0.25,0.46,0.45,0.94) both;
    transition: transform 0.20s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.20s ease;
    will-change: transform;
  }

  .xt-btn {
    transition: transform 0.18s cubic-bezier(0.25,0.46,0.45,0.94), background 0.18s ease, color 0.18s ease;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    will-change: transform;
  }
  .xt-btn.xt-pressing { transform: scale(0.93) !important; }

  .xt-check {
    transition: background 0.16s ease, border-color 0.16s ease, transform 0.18s cubic-bezier(0.25,0.46,0.45,0.94);
  }
  .xt-check.xt-pressing { transform: scale(0.88) !important; }
  .xt-check-icon { animation: xt-check-in 0.26s cubic-bezier(0.34,1.3,0.64,1) both; }

  .xt-row {
    transition: background 0.16s ease, border-color 0.16s ease, transform 0.18s cubic-bezier(0.25,0.46,0.45,0.94);
    -webkit-tap-highlight-color: transparent;
    will-change: transform;
  }
  .xt-row.xt-pressing { transform: scale(0.990) !important; }

  .xt-seg-pill {
    transition: background 0.22s cubic-bezier(0.25,0.46,0.45,0.94), color 0.18s ease, transform 0.18s cubic-bezier(0.25,0.46,0.45,0.94);
  }
  .xt-seg-pill.xt-pressing { transform: scale(0.92) !important; }

  .xt-tab-btn {
    transition: background 0.22s cubic-bezier(0.25,0.46,0.45,0.94);
    -webkit-tap-highlight-color: transparent;
    will-change: transform;
  }
  .xt-tab-icon {
    transition: transform 0.22s cubic-bezier(0.25,0.46,0.45,0.94);
  }
  .xt-tab-btn.xt-pressing .xt-tab-icon { transform: scale(0.86) !important; }

  .xt-live-dot { animation: xt-breathe 2.2s ease-in-out infinite; }

  @keyframes xt-open-glow {
    0%,100% { box-shadow: 0 0 0 1px rgba(255,182,39,0.25), 0 0 8px rgba(255,182,39,0.12); }
    50%      { box-shadow: 0 0 0 1.5px rgba(255,182,39,0.55), 0 0 18px rgba(255,182,39,0.28); }
  }
  .xt-open-trade { animation: xt-open-glow 2.4s ease-in-out infinite; }

  @keyframes xt-cal-open-pulse {
    0%,100% { box-shadow: 0 0 0 1px rgba(255,182,39,0.30), 0 0 6px rgba(255,182,39,0.15); }
    50%      { box-shadow: 0 0 0 2px rgba(255,182,39,0.60), 0 0 14px rgba(255,182,39,0.30); }
  }
  .xt-cal-open { animation: xt-cal-open-pulse 2.2s ease-in-out infinite; }

  .xt-shimmer-overlay {
    background: linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.055) 50%, transparent 75%);
    background-size: 200% 100%;
    animation: xt-shimmer 4s linear infinite;
    pointer-events: none;
    border-radius: inherit;
  }

  .xt-stagger-1  { animation-delay: 0.04s; }
  .xt-stagger-2  { animation-delay: 0.08s; }
  .xt-stagger-3  { animation-delay: 0.12s; }
  .xt-stagger-4  { animation-delay: 0.16s; }
  .xt-stagger-5  { animation-delay: 0.20s; }
  .xt-stagger-6  { animation-delay: 0.24s; }
  .xt-stagger-7  { animation-delay: 0.28s; }

  * { -webkit-tap-highlight-color: transparent; }

  /* ── iOS Switch spring ── */
  .xt-switch-thumb {
    transition: left 0.28s cubic-bezier(0.34, 1.56, 0.64, 1),
                transform 0.16s cubic-bezier(0.25,0.46,0.45,0.94);
  }
  .xt-switch-pressing .xt-switch-thumb { transform: scaleX(1.22) !important; }
  .xt-switch-track {
    transition: background 0.22s ease;
  }

  /* ── Star rating press ── */
  .xt-star {
    transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), opacity 0.12s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .xt-star:active { transform: scale(0.80) !important; }

  /* ── Confluence chip press ── */
  .xt-chip {
    transition: transform 0.18s cubic-bezier(0.25,0.46,0.45,0.94),
                background 0.16s ease, opacity 0.12s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .xt-chip.xt-pressing { transform: scale(0.88) !important; }

  /* ── Calendar cell press ── */
  .xt-cal-cell {
    transition: transform 0.18s cubic-bezier(0.25,0.46,0.45,0.94),
                background 0.15s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .xt-cal-cell.xt-pressing { transform: scale(0.90) !important; }

  /* ── Profondità: ombra dinamica su press ── */
  .xt-btn.xt-pressing { transform: scale(0.93) !important; box-shadow: 0 1px 3px rgba(0,0,0,0.08) !important; }
  .xt-seg-pill.xt-pressing { transform: scale(0.90) !important; }
`;

/* ============= HAPTIC ENGINE =============
   Apple Taptic Engine simulation per web.
   iOS Safari: AudioContext click (22μs burst).
   Android: navigator.vibrate con pattern calibrati.
   Desktop: silenzioso (solo feedback visivo).
   ---------------------------------------- */
let _hapticCtx = null;
const _getCtx = () => {
  if (!_hapticCtx && typeof AudioContext !== 'undefined') {
    try { _hapticCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(_){}
  }
  return _hapticCtx;
};

// Genera un click sintetico via AudioContext (iOS)
const _audioClick = (freq = 1200, dur = 0.008, gain = 0.18) => {
  const ctx = _getCtx();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.frequency.value = freq;
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  } catch(_) {}
};

const _vibe = (pattern) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try { navigator.vibrate(pattern); } catch(_) {}
  }
};

// Risveglia AudioContext (richiede un gesto utente) — chiamato al primo tap
let _hapticReady = false;
const _wakeHaptic = () => {
  if (_hapticReady) return;
  _hapticReady = true;
  const ctx = _getCtx();
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(()=>{});
};

// Tipi Apple Taptic Engine → web
const haptic = {
  // Selezione — picker scroll, tab switch, star hover
  selection: () => {
    _wakeHaptic();
    _vibe(2);
    _audioClick(1400, 0.005, 0.10);
  },
  // Light impact — checkbox, chip tag
  light: () => {
    _wakeHaptic();
    _vibe(4);
    _audioClick(1100, 0.007, 0.14);
  },
  // Medium impact — toggle switch, button confirm
  medium: () => {
    _wakeHaptic();
    _vibe(7);
    _audioClick(900, 0.010, 0.20);
  },
  // Heavy impact — destructive, important nav
  heavy: () => {
    _wakeHaptic();
    _vibe(12);
    _audioClick(700, 0.014, 0.28);
  },
  // Rigid — toggle ON (snap netto)
  rigid: () => {
    _wakeHaptic();
    _vibe([5, 0, 5]);
    _audioClick(1300, 0.006, 0.22);
  },
  // Soft — toggle OFF (rilascio morbido)
  soft: () => {
    _wakeHaptic();
    _vibe(3);
    _audioClick(800, 0.009, 0.12);
  },
  // Success — conferma operazione
  success: () => {
    _wakeHaptic();
    _vibe([5, 60, 9]);
    setTimeout(()=>_audioClick(1100, 0.007, 0.16), 0);
    setTimeout(()=>_audioClick(1400, 0.006, 0.20), 65);
  },
  // Warning — attenzione
  warning: () => {
    _wakeHaptic();
    _vibe([8, 50, 6, 50, 4]);
    _audioClick(600, 0.014, 0.22);
  },
  // Error
  error: () => {
    _wakeHaptic();
    _vibe([10, 40, 10, 40, 14]);
    _audioClick(350, 0.018, 0.30);
  },
};



function injectGlobalCSS() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('xt-styles')) return;
  const s = document.createElement('style');
  s.id = 'xt-styles';
  s.textContent = GLOBAL_CSS;
  document.head.appendChild(s);
}

/* ============= SCROLL-AWARE PRESS MANAGER + HAPTIC =============
   Gestisce .xt-pressing + haptic automatico per ogni classe.
   ─────────────────────────────────────────────────────────── */
const DRAG_THRESHOLD = 8;

// Mappa classe → tipo haptic
const HAPTIC_MAP = {
  'xt-tab-btn':  'selection',   // tab bar
  'xt-seg-pill': 'selection',   // segmented control
  'xt-check':    'light',       // checkbox
  'xt-chip':     'light',       // confluence chip
  'xt-cal-cell': 'light',       // calendario giorno
  'xt-btn':      'medium',      // bottoni generici
  'xt-row':      'light',       // trade row expand
  'xt-star':     'selection',   // stelle confidence
};

function injectPressManager() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('xt-press-manager')) return;
  const marker = document.createElement('div');
  marker.id = 'xt-press-manager';
  document.body.appendChild(marker);

  let target = null;
  let startX = 0;
  let startY = 0;
  let moved  = false;
  const SELECTORS = '.xt-btn, .xt-check, .xt-row, .xt-seg-pill, .xt-tab-btn, .xt-chip, .xt-cal-cell, .xt-star';

  document.addEventListener('touchstart', (e) => {
    const el = e.target.closest(SELECTORS);
    if (!el) return;
    target  = el;
    startX  = e.touches[0].clientX;
    startY  = e.touches[0].clientY;
    moved   = false;
    target._pressTimer = setTimeout(() => {
      if (!moved && target) {
        target.classList.add('xt-pressing');
        // Haptic automatico al press — identifica tipo dal className
        const type = Object.keys(HAPTIC_MAP).find(cls => target.classList.contains(cls));
        if (type && haptic[HAPTIC_MAP[type]]) haptic[HAPTIC_MAP[type]]();
      }
    }, 12);
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!target) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      moved = true;
      clearTimeout(target._pressTimer);
      target.classList.remove('xt-pressing');
    }
  }, { passive: true });

  const release = () => {
    if (!target) return;
    clearTimeout(target._pressTimer);
    target.classList.remove('xt-pressing');
    target = null;
  };
  document.addEventListener('touchend',    release, { passive: true });
  document.addEventListener('touchcancel', release, { passive: true });
}


const useDragCrosshair = () => {
  const [crosshair, setCrosshair] = useState(null);
  const containerRef = useRef(null);
  const dataRef      = useRef([]);
  const activeRef    = useRef(false);   // crosshair attivo (gesto orizzontale confermato)
  const pendingRef   = useRef(false);   // touchstart ricevuto, direzione ancora da decidere
  const startXRef    = useRef(0);
  const startYRef    = useRef(0);

  const getIndexFromX = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el || !dataRef.current.length) return null;
    const rect = el.getBoundingClientRect();
    const chartLeft  = rect.left + 40;
    const chartWidth = rect.width - 45;
    const fraction   = Math.max(0, Math.min(1, (clientX - chartLeft) / chartWidth));
    return Math.round(fraction * (dataRef.current.length - 1));
  }, []);

  const handleStart = useCallback((e) => {
    if (!e.touches) {
      // mouse: comportamento invariato
      activeRef.current = true;
      const idx = getIndexFromX(e.clientX);
      if (idx !== null) setCrosshair({ index: idx, x: e.clientX, y: e.clientY });
      return;
    }
    // touch: registra punto di partenza, aspetta di capire la direzione
    pendingRef.current = true;
    activeRef.current  = false;
    startXRef.current  = e.touches[0].clientX;
    startYRef.current  = e.touches[0].clientY;
  }, [getIndexFromX]);

  const handleMove = useCallback((e) => {
    if (!e.touches) {
      // mouse
      if (!activeRef.current) return;
      const idx = getIndexFromX(e.clientX);
      if (idx !== null) setCrosshair({ index: idx, x: e.clientX, y: e.clientY });
      return;
    }

    const clientX = e.touches[0].clientX;
    const clientY = e.touches[0].clientY;
    const dx = Math.abs(clientX - startXRef.current);
    const dy = Math.abs(clientY - startYRef.current);

    if (pendingRef.current) {
      // Direzione ancora da decidere — aspetta almeno 6px di movimento
      if (dx < 6 && dy < 6) return;
      if (dy > dx) {
        // Gesto verticale → scroll, abbandona
        pendingRef.current = false;
        return;
      }
      // Gesto orizzontale confermato → attiva crosshair
      pendingRef.current = false;
      activeRef.current  = true;
    }

    if (!activeRef.current) return;
    e.preventDefault(); // blocca scroll solo quando crosshair è attivo
    const idx = getIndexFromX(clientX);
    if (idx !== null) setCrosshair({ index: idx, x: clientX, y: clientY });
  }, [getIndexFromX]);

  const handleEnd = useCallback(() => {
    activeRef.current  = false;
    pendingRef.current = false;
    setCrosshair(null);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('touchstart',  handleStart, { passive: true });
    el.addEventListener('touchmove',   handleMove,  { passive: false });
    el.addEventListener('touchend',    handleEnd,   { passive: true });
    el.addEventListener('touchcancel', handleEnd,   { passive: true });
    el.addEventListener('mousedown',   handleStart, { passive: true });
    el.addEventListener('mousemove',   handleMove,  { passive: true });
    el.addEventListener('mouseup',     handleEnd,   { passive: true });
    el.addEventListener('mouseleave',  handleEnd,   { passive: true });
    return () => {
      el.removeEventListener('touchstart',  handleStart);
      el.removeEventListener('touchmove',   handleMove);
      el.removeEventListener('touchend',    handleEnd);
      el.removeEventListener('touchcancel', handleEnd);
      el.removeEventListener('mousedown',   handleStart);
      el.removeEventListener('mousemove',   handleMove);
      el.removeEventListener('mouseup',     handleEnd);
      el.removeEventListener('mouseleave',  handleEnd);
    };
  }, [handleStart, handleMove, handleEnd]);

  return { containerRef, dataRef, crosshair };
};

/* ============= DRAG CHART WRAPPER ============= */
const DragChart = ({ C, data, height, children, labelKey, valueKey, valuePrefix='', valueSuffix='', valueColor }) => {
  const { containerRef, dataRef, crosshair } = useDragCrosshair();
  dataRef.current = data;
  const activePoint = crosshair !== null ? data[crosshair.index] : null;

  // Dimensioni del container tracciate in stato per forzare re-render corretto
  const [containerW, setContainerW] = useState(0);
  const [containerH, setContainerH] = useState(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => {
      setContainerW(el.offsetWidth);
      setContainerH(el.offsetHeight);
    });
    obs.observe(el);
    setContainerW(el.offsetWidth);
    setContainerH(el.offsetHeight);
    return () => obs.disconnect();
  }, []);

  // Posizione X crosshair in pixel assoluti dentro il container
  const CHART_LEFT  = 40; // margine sinistro Recharts
  const CHART_RIGHT = 5;
  const chartWidth  = Math.max(containerW - CHART_LEFT - CHART_RIGHT, 1);
  const crosshairX  = crosshair !== null && data.length > 1
    ? CHART_LEFT + (crosshair.index / (data.length - 1)) * chartWidth
    : null;

  return (
    <div style={{ position: 'relative', userSelect: 'none', touchAction: 'pan-x' }}>
      <div ref={containerRef} style={{ cursor: 'crosshair', position: 'relative' }}>
        {children}
        {/* SVG overlay crosshair — sempre delle stesse dimensioni del container */}
        {crosshairX !== null && containerW > 0 && containerH > 0 && (
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              overflow: 'visible',
            }}
            viewBox={`0 0 ${containerW} ${containerH}`}
            preserveAspectRatio="none"
          >
            {/* Linea verticale tratteggiata */}
            <line
              x1={crosshairX} y1={0}
              x2={crosshairX} y2={containerH}
              stroke="rgba(255,255,255,0.35)"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            {/* Linea orizzontale a puntini sottilissima */}
            <line
              x1={CHART_LEFT} y1={containerH / 2}
              x2={containerW - CHART_RIGHT} y2={containerH / 2}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={1}
              strokeDasharray="2 5"
            />
            {/* Pallino cyan sull'asse X */}
            <circle
              cx={crosshairX}
              cy={containerH - 2}
              r={4}
              fill="none"
              stroke="#7DF9FF"
              strokeWidth={1.5}
            />
          </svg>
        )}
      </div>
      {activePoint && (
        <div style={{
          position: 'absolute',
          top: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          background: C.glassBar,
          backdropFilter: 'saturate(180%) blur(30px)',
          WebkitBackdropFilter: 'saturate(180%) blur(30px)',
          border: `0.5px solid ${C.sep2}`,
          borderRadius: 12,
          padding: '6px 14px',
          pointerEvents: 'none',
          zIndex: 10,
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          whiteSpace: 'nowrap',
        }}>
          <span style={{ color: C.secondary, fontSize: 11, fontFamily: FONT.mono }}>
            {activePoint[labelKey]}
          </span>
          <span style={{
            color: valueColor
              ? (typeof valueColor === 'function' ? valueColor(activePoint[valueKey]) : valueColor)
              : C.primary,
            fontSize: 14, fontFamily: FONT.mono, fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {valuePrefix}{typeof activePoint[valueKey] === 'number' ? activePoint[valueKey].toFixed(2) : activePoint[valueKey]}{valueSuffix}
          </span>
        </div>
      )}
    </div>
  );
};

/* ============= PERSISTED STATE ============= */
const usePersistedState = (key, initial) => {
  const [state, setState] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initial;
    } catch { return initial; }
  });
  const timer = useRef(null);
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try { window.localStorage.setItem(key, JSON.stringify(state)); } catch {}
    }, 400);
    return () => timer.current && clearTimeout(timer.current);
  }, [key, state]);
  return [state, setState];
};

/* ============= AUTO LIGHT/DARK ============= */
const useColorScheme = () => {
  const [scheme, setScheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setScheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return scheme;
};

/* ============= ACCOUNTS ============= */
const ACCOUNT_DEFAULTS = [
  { id: 'main',  name: 'VT Markets · Main',  broker: 'VT Markets',  balanceInit: 10000, currency: 'USD' },
  { id: 'demo',  name: 'VT Markets · Demo',  broker: 'VT Markets',  balanceInit:  5000, currency: 'USD' },
];

/* ============= LIVE CLOCK ============= */
const useLiveClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
};

/* ============= CONF COLORS ============= */
const CONF_COLORS_MAP = {
  FIBREVERSE: '#C77DFF', '3D': '#C77DFF', SWEEP: '#C77DFF',
  VAO: '#C77DFF', POC: '#C77DFF', VAH: '#C77DFF', VAL: '#C77DFF',
  ORIGINE: '#7DF9FF', 'ORIGINE REVERSE': '#7DF9FF', OBB: '#7DF9FF',
  OBV: '#7DF9FF', VWAP: '#FFB627',
};

/* ============= COSTS / FRICTION ============= */

/* ============= METRICHE TOTALI (PERFORMANCE TAB SHEETS) ============= */
/* ============= COMPUTE ALL STATS FROM REAL TRADES ============= */
// Unica fonte di verità — nessun dato mock hardcoded
const computeAllStats = (trades) => {
  const closed = (trades || []).filter(t => !t.open);
  const n = closed.length;
  if (n === 0) return null; // nessun dato → UI mostra stato vuoto

  const wins   = closed.filter(t => t.pnl > 0);
  const losses = closed.filter(t => t.pnl < 0);
  const wr     = Math.round(wins.length / n * 100);
  const grossW = wins.reduce((s,t) => s+t.pnl, 0);
  const grossL = Math.abs(losses.reduce((s,t) => s+t.pnl, 0));
  const total  = grossW - grossL;
  const avgWin = wins.length   ? grossW / wins.length   : 0;
  const avgLos = losses.length ? grossL / losses.length : 0;
  const pf     = grossL > 0 ? grossW / grossL : grossW > 0 ? 99 : 0;
  const exp    = total / n;
  const rrs    = closed.filter(t=>t.rr>0).map(t=>t.rr);
  const avgRR  = rrs.length ? rrs.reduce((s,r)=>s+r,0)/rrs.length : 0;
  const bestRR = rrs.length ? Math.max(...rrs) : 0;
  const lgWin  = wins.length   ? Math.max(...wins.map(t=>t.pnl))   : 0;
  const lgLos  = losses.length ? Math.max(...losses.map(t=>t.pnl)) : 0;

  // Equity curve
  const BALANCE_INIT = 10000;
  const byDate = {};
  closed.forEach(t => { byDate[t.date] = (byDate[t.date]||0) + t.pnl; });
  const dates = Object.keys(byDate).sort();
  let eq = BALANCE_INIT, hwm = BALANCE_INIT, maxDD = 0;
  dates.forEach(d => {
    eq += byDate[d];
    if (eq > hwm) hwm = eq;
    const dd = hwm - eq;
    if (dd > maxDD) maxDD = dd;
  });
  const currEq  = BALANCE_INIT + total;
  const currDD  = hwm - currEq;
  const maxDDPct = hwm > 0 ? maxDD/hwm*100 : 0;
  const roi     = (total/BALANCE_INIT)*100;
  const tradeDays = dates.length || 1;
  const roiDaily  = roi / tradeDays;
  const roiWeekly = roiDaily * 5;
  const roiMonthly = roiDaily * 22;

  // Sharpe / Sortino
  const pnls = closed.map(t=>t.pnl);
  const mean = total/n;
  const variance = pnls.reduce((s,p)=>s+(p-mean)**2,0)/n;
  const stdDev = Math.sqrt(variance);
  const sharpe = stdDev > 0 ? mean/stdDev : 0;
  const sharpeAnnual = sharpe * Math.sqrt(252);
  const downPnls = pnls.filter(p=>p<0);
  const downVar  = downPnls.reduce((s,p)=>s+p**2,0)/Math.max(downPnls.length,1);
  const sortino  = downVar > 0 ? mean/Math.sqrt(downVar) : 0;
  const kelly    = avgLos > 0 ? (wr/100 - (1-wr/100)*(avgWin/avgLos)) : 0;

  // Statistical edge
  const skew = stdDev > 0 ? pnls.reduce((s,p)=>s+((p-mean)/stdDev)**3,0)/n : 0;
  const zscore = stdDev > 0 ? (mean/stdDev)*Math.sqrt(n) : 0;

  // MAE / MFE
  const maes = closed.filter(t=>t.mae).map(t=>t.mae);
  const mfes = closed.filter(t=>t.mfe).map(t=>t.mfe);
  const avgMAE = maes.length ? maes.reduce((s,v)=>s+v,0)/maes.length : 0;
  const avgMFE = mfes.length ? mfes.reduce((s,v)=>s+v,0)/mfes.length : 0;
  const maxMAE = maes.length ? Math.min(...maes) : 0;
  const maxMFE = mfes.length ? Math.max(...mfes) : 0;
  const mfeMaeRatio = avgMAE < 0 ? Math.abs(avgMFE/avgMAE) : 0;
  const edgeCaptured = avgMFE > 0 ? Math.min((avgWin/avgMFE)*100, 100) : 0;

  // Streak
  let maxW=0, maxL=0, curW=0, curL=0;
  const sorted = [...closed].sort((a,b)=>a.date.localeCompare(b.date)||a.id-b.id);
  sorted.forEach(t => {
    if (t.pnl>0) { curW++; curL=0; if(curW>maxW)maxW=curW; }
    else          { curL++; curW=0; if(curL>maxL)maxL=curL; }
  });
  // Current streak
  let curStreak=0, curType=null;
  [...sorted].reverse().forEach(t => {
    if (t.pnl===0) return;
    const isW = t.pnl>0;
    if (curType===null) { curType=isW; curStreak=1; }
    else if (curType===isW) curStreak++;
  });

  // Closures
  const nTP     = closed.filter(t=>t.closed==='TP').length;
  const nSL     = closed.filter(t=>t.closed==='SL').length;
  const nBE     = closed.filter(t=>t.closed==='BE').length;
  const nSP     = closed.filter(t=>t.closed==='SP').length;
  const nManual = closed.filter(t=>!['TP','SL','BE','SP'].includes(t.closed||'')).length;

  // Costs
  const totSpread = closed.reduce((s,t)=>s+(t.spread||0),0);
  const totComm   = closed.reduce((s,t)=>s+(t.commission||0),0);
  const totSwap   = closed.reduce((s,t)=>s+(t.swap||0),0);
  const totSlip   = closed.reduce((s,t)=>s+(t.slippage||0),0);
  const totCost   = totSpread+totComm+totSwap+totSlip;
  const costPerTrade = n ? totCost/n : 0;
  const costOnPnl    = total !== 0 ? Math.abs(totCost/total)*100 : 0;

  // Best/Worst day
  const dayEntries = Object.entries(byDate);
  const bestDay  = dayEntries.length ? dayEntries.reduce((a,b)=>b[1]>a[1]?b:a) : null;
  const worstDay = dayEntries.filter(([,v])=>v<0).length ? dayEntries.filter(([,v])=>v<0).reduce((a,b)=>b[1]<a[1]?b:a) : null;

  // Avg holding
  const durs = closed.filter(t=>t.duration>0).map(t=>t.duration);
  const avgHold = durs.length ? durs.reduce((s,v)=>s+v,0)/durs.length : 0;
  const avgHoldStr = avgHold > 0 ? avgHold >= 60 ? `${Math.floor(avgHold/60)}h ${Math.round(avgHold%60)}m` : `${Math.round(avgHold)}m` : '—';

  // Breakdowns
  const SESS_COLORS = { ASIAN:'#FF457A', FRANKFURT:'#FFB627', LONDON:'#C77DFF', NEWYORK:'#7DF9FF' };
  const breakSess = ['ASIAN','FRANKFURT','LONDON','NEWYORK'].map(s => {
    const t = closed.filter(tr=>(tr.session||'').toUpperCase()===s);
    const w = t.filter(tr=>tr.pnl>0).length;
    const p = t.reduce((acc,tr)=>acc+tr.pnl,0);
    const r = t.filter(tr=>tr.rr>0).map(tr=>tr.rr);
    return { name:s==='NEWYORK'?'New York':s.charAt(0)+s.slice(1).toLowerCase(), trades:t.length, wr:t.length?Math.round(w/t.length*100):0, pnl:p, avg:t.length?p/t.length:0, rr:r.length?r.reduce((a,b)=>a+b,0)/r.length:0, color:SESS_COLORS[s] };
  }).filter(s=>s.trades>0);

  const breakDay = ['Lun','Mar','Mer','Gio','Ven','Sab','Dom'].map((name,i) => {
    const t = closed.filter(tr=>(new Date(tr.date).getDay()+6)%7===i);
    const w = t.filter(tr=>tr.pnl>0).length;
    const p = t.reduce((acc,tr)=>acc+tr.pnl,0);
    const r = t.filter(tr=>tr.rr>0).map(tr=>tr.rr);
    return { name, trades:t.length, wr:t.length?Math.round(w/t.length*100):0, pnl:p, avg:t.length?p/t.length:0, rr:r.length?r.reduce((a,b)=>a+b,0)/r.length:0 };
  });

  const MONTH_NAMES = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
  const breakMonth = MONTH_NAMES.map((name,i) => {
    const t = closed.filter(tr=>new Date(tr.date).getMonth()===i);
    const w = t.filter(tr=>tr.pnl>0).length;
    const p = t.reduce((acc,tr)=>acc+tr.pnl,0);
    return { name, trades:t.length, wr:t.length?Math.round(w/t.length*100):0, pnl:p, avg:t.length?p/t.length:0 };
  }).filter(m=>m.trades>0);

  const breakType = ['Scalp','Intraday','Swing','Position'].map(name => {
    const t = closed.filter(tr=>(tr.tradeType||'').toLowerCase()===name.toLowerCase());
    const w = t.filter(tr=>tr.pnl>0).length;
    const p = t.reduce((acc,tr)=>acc+tr.pnl,0);
    return { name, trades:t.length, wr:t.length?Math.round(w/t.length*100):0, pnl:p, avg:t.length?p/t.length:0 };
  }).filter(s=>s.trades>0);

  const breakHour = Array.from({length:24},(_,h) => {
    const t = closed.filter(tr => {
      if (!tr.timeEntry) return false;
      const utcH = parseInt((tr.timeEntry||'00:00').split(':')[0]);
      return ((utcH+2)%24)===h; // AMS DST semplificato
    });
    const w = t.filter(tr=>tr.pnl>0).length;
    const p = t.reduce((acc,tr)=>acc+tr.pnl,0);
    return { name:`${String(h).padStart(2,'0')}:00`, trades:t.length, wr:t.length?Math.round(w/t.length*100):0, pnl:p, avg:t.length?p/t.length:0 };
  }).filter(h=>h.trades>0);

  const HOLD_BUCKETS = [{name:'<15min',min:0,max:15},{name:'15-30m',min:15,max:30},{name:'30-60m',min:30,max:60},{name:'1-4h',min:60,max:240},{name:'4-8h',min:240,max:480},{name:'>8h',min:480,max:Infinity}];
  const breakHolding = HOLD_BUCKETS.map(b => {
    const t = closed.filter(tr=>tr.duration>=b.min&&tr.duration<b.max);
    const w = t.filter(tr=>tr.pnl>0).length;
    const p = t.reduce((acc,tr)=>acc+tr.pnl,0);
    return { name:b.name, trades:t.length, wr:t.length?Math.round(w/t.length*100):0, pnl:p, avg:t.length?p/t.length:0 };
  }).filter(b=>b.trades>0);

  // Matrice giorno × sessione calcolata
  const DAYS = ['Lun','Mar','Mer','Gio','Ven'];
  const SESS = ['ASIAN','FRANKFURT','LONDON','NEWYORK'];
  const matrixData = DAYS.map((_,di) =>
    SESS.map(s => {
      const t = closed.filter(tr=>(new Date(tr.date).getDay()+6)%7===di && (tr.session||'').toUpperCase()===s);
      const w = t.filter(tr=>tr.pnl>0).length;
      const p = t.reduce((acc,tr)=>acc+tr.pnl,0);
      const r = t.filter(tr=>tr.rr>0).map(tr=>tr.rr);
      return { pnl:p, wr:t.length?Math.round(w/t.length*100):0, rr:r.length?r.reduce((a,b)=>a+b,0)/r.length:0, trades:t.length };
    })
  );

  // Rolling (30/60/90 trades)
  const rolling = [30,60,90].map(k => {
    const slice = sorted.slice(-k);
    const sw = slice.filter(t=>t.pnl>0).length;
    const sgw = slice.filter(t=>t.pnl>0).reduce((s,t)=>s+t.pnl,0);
    const sgl = Math.abs(slice.filter(t=>t.pnl<0).reduce((s,t)=>s+t.pnl,0));
    const sm = slice.reduce((s,t)=>s+t.pnl,0)/Math.max(slice.length,1);
    const sv = slice.reduce((s,t)=>s+(t.pnl-sm)**2,0)/Math.max(slice.length,1);
    const ss = Math.sqrt(sv);
    return { period:`${k}T`, sharpe:ss>0?sm/ss:0, pf:sgl>0?sgw/sgl:0, wr:slice.length?Math.round(sw/slice.length*100):0 };
  });

  // Behavioral post-streak (calcolato dai trade reali)
  const buckets = {after3Wplus:[],after2W:[],base:[],after1L:[],after2Lplus:[]};
  for (let i=1;i<sorted.length;i++) {
    let cw=0,cl=0;
    for (let j=i-1;j>=0;j--) { if(sorted[j].pnl>0)cw++; else break; }
    for (let j=i-1;j>=0;j--) { if(sorted[j].pnl<0)cl++; else break; }
    const t = sorted[i];
    if (cl>=2) buckets.after2Lplus.push(t);
    else if (cl===1) buckets.after1L.push(t);
    else if (cw>=3) buckets.after3Wplus.push(t);
    else if (cw>=2) buckets.after2W.push(t);
    else buckets.base.push(t);
  }
  const postStreak = [
    {name:'Dopo 3W+',arr:buckets.after3Wplus},
    {name:'Dopo 2W', arr:buckets.after2W},
    {name:'Base',    arr:buckets.base},
    {name:'Dopo 1L', arr:buckets.after1L},
    {name:'Dopo 2L+',arr:buckets.after2Lplus},
  ].map(b => {
    const bw=b.arr.filter(t=>t.pnl>0).length;
    const bp=b.arr.reduce((s,t)=>s+t.pnl,0);
    return {name:b.name,trades:b.arr.length,wr:b.arr.length?Math.round(bw/b.arr.length*100):0,pnl:bp,avg:b.arr.length?bp/b.arr.length:0};
  });

  const fmt = (v,d=2) => isFinite(v)&&!isNaN(v) ? v.toFixed(d) : '—';

  return {
    // metriche per MetricsView
    general: [
      {label:'Win Rate',      value:`${wr}%`,             sub:`${wins.length}/${n} trades`},
      {label:'Profit Tot',    value:`${total>=0?'+':''}$${fmt(total)}`, sub:'netto', accent:'green'},
      {label:'Trades',        value:`${n}`,               sub:'chiusi'},
      {label:'R:R Medio',     value:`${fmt(avgRR)}`,      sub:'media multipli'},
      {label:'Best R:R',      value:`${fmt(bestRR,1)}`,   sub:'miglior trade'},
      {label:'Avg Win',       value:`+$${fmt(avgWin)}`,   sub:'media vincite', accent:'green'},
      {label:'Avg Loss',      value:`−$${fmt(avgLos)}`,   sub:'media perdite', accent:'red'},
      {label:'Largest Win',   value:`+$${fmt(lgWin)}`,    accent:'green'},
      {label:'Largest Loss',  value:`−$${fmt(Math.abs(lgLos))}`, accent:'red'},
      {label:'Expectancy',    value:`${exp>=0?'+':''}$${fmt(exp)}`, sub:'per trade', accent:'green'},
    ],
    equity: [
      {label:'Current Equity',  value:`$${fmt(currEq)}`,  sub:'live', accent:'green'},
      {label:'High Water Mark', value:`$${fmt(hwm)}`,     sub:'massimo storico', accent:'cyan'},
      {label:'Current DD',      value:`−$${fmt(currDD)}`, sub:'da HWM'},
      {label:'Max DD $',        value:`−$${fmt(maxDD)}`,  accent:'red'},
      {label:'Max DD %',        value:`−${fmt(maxDDPct)}%`, accent:'red'},
      {label:'ROI Totale',      value:`${roi>=0?'+':''}${fmt(roi)}%`, sub:'su balance iniziale', accent:'green'},
    ],
    risk: [
      {label:'Profit Factor',   value:`${fmt(pf)}`,           sub:'gross W / |gross L|', accent:'cyan'},
      {label:'Sharpe',          value:`${fmt(sharpe)}`,        sub:'per trade'},
      {label:'Sharpe Annual',   value:`${fmt(sharpeAnnual,1)}`,sub:'×√252', accent:'green'},
      {label:'Sortino',         value:`${fmt(sortino)}`,       sub:'downside risk', accent:'cyan'},
      {label:'Kelly %',         value:`${fmt(kelly*100,1)}%`,  sub:'optimal sizing', accent:'purple'},
      {label:'Max DD $',        value:`−$${fmt(maxDD)}`,       accent:'red'},
      {label:'Max DD %',        value:`−${fmt(maxDDPct)}%`,    accent:'red'},
      {label:'Skewness',        value:`${skew>=0?'+':''}${fmt(skew)}`, sub:'> 0 = right-tail', accent: skew>=0?'green':'red'},
      {label:'Z-Score',         value:`${fmt(zscore)}`,        sub:'> 2 = significativo', accent:'green'},
    ],
    excursion: [
      {label:'Avg MAE',       value:`−$${fmt(Math.abs(avgMAE))}`, sub:'max adverse', accent:'red'},
      {label:'Avg MFE',       value:`+$${fmt(avgMFE)}`,          sub:'max favorable', accent:'green'},
      {label:'Max MAE',       value:`−$${fmt(Math.abs(maxMAE))}`,sub:'peggiore intra-trade', accent:'red'},
      {label:'Max MFE',       value:`+$${fmt(maxMFE)}`,          sub:'migliore intra-trade', accent:'green'},
      {label:'MFE/MAE Ratio', value:`${fmt(mfeMaeRatio)}`,       sub:'efficienza setup', accent:'cyan'},
      {label:'Edge Captured', value:`${fmt(edgeCaptured)}%`,     sub:'P&L / max MFE', accent:'purple'},
    ],
    roi: [
      {label:'ROI Totale',  value:`${roi>=0?'+':''}${fmt(roi)}%`,          sub:'su balance iniziale', accent:'green'},
      {label:'ROI Daily',   value:`${roiDaily>=0?'+':''}${fmt(roiDaily)}%`,sub:'media giornaliera', accent:'cyan'},
      {label:'ROI Weekly',  value:`${roiWeekly>=0?'+':''}${fmt(roiWeekly)}%`,sub:'proiezione settimana', accent:'purple'},
      {label:'ROI Monthly', value:`${roiMonthly>=0?'+':''}${fmt(roiMonthly)}%`,sub:'proiezione mese', accent:'yellow'},
    ],
    streak: [
      {label:'Max Streak Win',  value:`${maxW}`, sub:'consecutive', accent:'green'},
      {label:'Max Streak Loss', value:`${maxL}`, sub:'consecutive', accent:'red'},
      {label:'Gross Win',       value:`+$${fmt(grossW)}`, accent:'green'},
      {label:'Gross Loss',      value:`−$${fmt(grossL)}`, accent:'red'},
    ],
    closures: [
      {label:'# TP',     value:`${nTP}`,     accent:'green'},
      {label:'# SL',     value:`${nSL}`,     accent:'red'},
      {label:'# BE',     value:`${nBE}`,     accent:'yellow'},
      {label:'# SP',     value:`${nSP}`,     accent:'cyan'},
      {label:'# Manual', value:`${nManual}`, accent:'tertiary'},
    ],
    costs: [
      {label:'Spread Tot',   value:`${fmt(totSpread)}$`,    accent:'red'},
      {label:'Commissione',  value:`${fmt(totComm)}$`,      accent:'red'},
      {label:'Swap Tot',     value:`${fmt(totSwap)}$`,      accent:'red'},
      {label:'Costi Tot',    value:`${fmt(totCost)}$`,      sub:'attriti totali', accent:'red'},
      {label:'Costo/Trade',  value:`${fmt(costPerTrade)}$`, sub:'tutto incluso',  accent:'orange'},
      {label:'Costi su P&L', value:`${fmt(costOnPnl)}%`,   sub:'incidenza',      accent:'yellow'},
      {label:'Avg Slippage', value:`${fmt(durs.length?totSlip/n:0)}$`, sub:'per trade', accent:'orange'},
    ],
    extremes: [
      {label:'Best Day',   value:bestDay  ? `+$${fmt(bestDay[1])}`           : '—', sub:bestDay?bestDay[0]:'',     accent:'green'},
      {label:'Worst Day',  value:worstDay ? `−$${fmt(Math.abs(worstDay[1]))}`: '—', sub:worstDay?worstDay[0]:'', accent:'red'},
      {label:'Avg Hold',   value:avgHoldStr, sub:'per trade', accent:'cyan'},
      {label:'R:R Realiz.',value:`${fmt(avgRR)}`, sub:'reale', accent:'yellow'},
    ],
    rolling: rolling.map(r => ([
      {label:`Sharpe ${r.period}`, value:fmt(r.sharpe), sub:'rolling'},
      {label:`PF ${r.period}`,     value:fmt(r.pf),     sub:'rolling', accent:'cyan'},
      {label:`WR ${r.period}`,     value:`${r.wr}%`,    sub:'rolling', accent: r.wr>=60?'green':r.wr>=40?'yellow':'red'},
    ])).flat(),
    // breakdown
    breakSess:    breakSess,
    breakDay:     breakDay,
    breakMonth:   breakMonth,
    breakType:    breakType,
    breakHour:    breakHour,
    breakHolding: breakHolding,
    postStreak:   postStreak,
    matrixData:   matrixData,
    // equity per proiezione
    currEq, hwm, total, mean, BALANCE_INIT, tradeDays,
    currentStreak: { streak:curStreak, isWin:curType },
    // raw per grafici
    closedTrades: closed,
  };
};

/* ============= PALETTE LIGHT/DARK ============= */
const palette = {
  dark: {
    green:'#39FF14', cyan:'#7DF9FF', purple:'#C77DFF', red:'#FF073A',
    yellow:'#FFE600', orange:'#FFB627', pink:'#FF457A',
    bg:'#000000',
    glass:    '#1C1C1E',
    glass2:   '#2C2C2E',
    glass3:   '#3A3A3C',
    glassBar: '#1C1C1E',
    sep:      'rgba(255,255,255,0.08)',
    sep2:     'rgba(255,255,255,0.12)',
    primary:  '#FFFFFF',
    secondary:'rgba(255,255,255,0.65)',
    tertiary: 'rgba(255,255,255,0.38)',
    quat:     'rgba(255,255,255,0.18)',
    iconBg:   '#000',
    ambient:  `none`,
  },
  light: {
    green:'#00B814', cyan:'#0099B3', purple:'#8B2EBC', red:'#D9001F',
    yellow:'#B89400', orange:'#D17500', pink:'#C92668',
    bg:'#F2F2F7',
    glass:    'rgba(255, 255, 255, 0.72)',
    glass2:   'rgba(245, 245, 247, 0.85)',
    glass3:   'rgba(229, 229, 234, 0.85)',
    glassBar: 'rgba(255, 255, 255, 0.78)',
    sep:      'rgba(0,0,0,0.08)',
    sep2:     'rgba(0,0,0,0.12)',
    primary:  '#000000',
    secondary:'rgba(0,0,0,0.65)',
    tertiary: 'rgba(0,0,0,0.40)',
    quat:     'rgba(0,0,0,0.20)',
    iconBg:   '#FFF',
    ambient:  `radial-gradient(circle at 20% 0%, #C77DFF20, transparent 50%), radial-gradient(circle at 80% 100%, #7DF9FF15, transparent 50%)`,
  },
};

const FONT = {
  display: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
  text:    '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
  mono:    '"SF Mono", ui-monospace, Menlo, Monaco, monospace',
};

const RADIUS = { card: 32, inset: 22, pill: 999 };

/* ── neonText: sfumatura neon leggerissima solo sulle scritte grandi ── */
const neonText = (color, scheme) => {
  if (scheme !== 'dark') return {};
  // intensità bassissima: visibile ma non aggressiva
  return { textShadow: `0 0 24px ${color}1E, 0 0 8px ${color}0F` };
};

/* ============= COMPONENTS ============= */
const Glass = ({ C, children, className='', padding='p-5', radius=RADIUS.card, style={} }) => (
  <div className={`xt-card ${className}`} style={{
    background: C.glass,
    border: `0.5px solid ${C.sep2}`,
    borderRadius: radius,
    boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset',
    ...style,
  }}>
    <div className={padding}>{children}</div>
  </div>
);

const GlassInset = ({ C, children, className='', padding='p-3', style={} }) => (
  <div className={className} style={{
    background: C.glass2,
    border: `0.5px solid ${C.sep}`,
    borderRadius: RADIUS.inset,
    ...style,
  }}>
    <div className={padding}>{children}</div>
  </div>
);

const Sparkline = ({ data, color, height = 28 }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const norm = (v) => max === min ? 0.5 : (v - min) / (max - min);
  const w = 72;
  const padding = 2;
  const h = height - padding * 2;
  // Smooth curve usando comandi quadratici Bezier
  const points = data.map((v,i)=>[(data.length > 1 ? i/(data.length-1) : 0.5)*w, padding + h - norm(v)*h]);
  let path = `M ${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [x, y] = points[i];
    const [px, py] = points[i-1];
    const cx = (px + x) / 2;
    path += ` Q ${cx},${py} ${cx},${(py+y)/2} T ${x},${y}`;
  }
  return (
    <svg width={w} height={height} style={{overflow:'visible'}}>
      <defs>
        <linearGradient id={`sparkGrad-${color.replace('#','')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={`${path} L ${w},${height} L 0,${height} Z`} fill={`url(#sparkGrad-${color.replace('#','')})`}/>
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
};

const Stat = ({C, label, value, sub, color, spark, sparkColor, className='', style={}}) => (
  <Glass C={C} padding="p-4" className={className} style={style}>
    <div className="flex items-start justify-between mb-1.5">
      <span style={{color:C.secondary,fontSize:12,fontFamily:FONT.text,fontWeight:500,letterSpacing:'-0.08px'}}>{label}</span>
      {spark && <Sparkline data={spark} color={sparkColor || color || C.primary}/>}
    </div>
    <div style={{color: color || C.primary, fontSize:28, fontFamily:FONT.display, fontWeight:600, letterSpacing:'-0.6px', lineHeight:1.1, fontVariantNumeric:'tabular-nums', ...neonText(color || C.primary, C.scheme)}}>{value}</div>
    {sub && <div style={{color:C.tertiary, fontSize:11, fontFamily:FONT.mono, marginTop:4}}>{sub}</div>}
  </Glass>
);

const SectionHeader = ({C, children, action}) => (
  <div className="flex items-end justify-between mb-3 px-1">
    <h2 style={{fontFamily:FONT.display, fontSize:22, fontWeight:700, letterSpacing:'-0.4px', color:C.primary, ...neonText(C.primary, C.scheme)}}>{children}</h2>
    {action}
  </div>
);

const Eyebrow = ({C, children}) => (
  <div style={{color:C.tertiary, fontSize:11, fontFamily:FONT.text, fontWeight:600, letterSpacing:'0.4px', textTransform:'uppercase', marginBottom:12}}>
    {children}
  </div>
);

const SegmentedControl = ({C, options, value, onChange}) => (
  <div className="inline-flex p-0.5" style={{
    background:C.glass2, borderRadius:RADIUS.pill,
    backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
    border:`0.5px solid ${C.sep}`,
  }}>
    {options.map(opt=>(
      <button key={opt} onClick={()=>{haptic.selection();onChange?.(opt);}} className="xt-seg-pill"
        style={{
          padding:'6px 14px', fontSize:12, fontFamily:FONT.text, fontWeight:600,
          color: value===opt ? C.primary : C.secondary,
          background: value===opt ? C.glass3 : 'transparent',
          borderRadius: RADIUS.pill, border:'none', cursor:'pointer', letterSpacing:'-0.08px',
        }}>
        {opt}
      </button>
    ))}
  </div>
);

const Tag = ({children, color, size='md'}) => (
  <span style={{
    fontSize: size==='sm'?10:11, fontFamily:FONT.text, fontWeight:600, color,
    background:`${color}1F`, padding: size==='sm'?'2.5px 8px':'3px 10px',
    borderRadius:7, letterSpacing:'-0.06px', textTransform:'uppercase',
    lineHeight: 1.2,
  }}>{children}</span>
);

const FilterChip = ({C, label, active, onClick, count, color}) => (
  <button onClick={()=>{haptic.selection();onClick?.();}} className="xt-btn xt-chip" style={{
    padding:'5px 12px', fontSize:11, fontFamily:FONT.text, fontWeight:600,
    color: active ? (color ? C.bg : C.bg) : (color || C.secondary),
    background: active ? (color || C.primary) : C.glass2,
    backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)',
    border:`0.5px solid ${active ? (color || C.primary) : color ? color+'55' : C.sep}`,
    borderRadius:RADIUS.pill, cursor:'pointer', letterSpacing:'-0.08px', transition:'all 0.15s',
  }}>
    {label}{count !== undefined && <span style={{marginLeft:5,opacity:0.6}}>{count}</span>}
  </button>
);

const ConfidenceRating = ({C, value, onChange}) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(n=>(
      <button key={n}
        onClick={()=>{ haptic.selection(); onChange?.(n); }}
        className="xt-star"
        style={{background:'none',border:'none',cursor:'pointer',padding:'2px',lineHeight:0}}>
        <Star size={14} fill={n <= (value||0) ? C.yellow : 'none'} stroke={n <= (value||0) ? C.yellow : C.tertiary} strokeWidth={1.5}/>
      </button>
    ))}
  </div>
);

/* ============= GOAL TRACKER ============= */
const GoalRow = ({ C, label, balanceInit, currentPnl, targetPct, color, editing, onTargetChange }) => {
  const pct     = parseFloat(targetPct) || 0;
  const targetUsd = balanceInit * pct / 100;
  const donePct   = targetUsd > 0 ? Math.min(currentPnl / targetUsd * 100, 100) : 0;
  const missingPct = Math.max(pct - (currentPnl / balanceInit * 100), 0);
  return (
    <div>
      <div className="flex justify-between items-start mb-2 gap-2">
        <span style={{color:C.secondary,fontSize:12,fontFamily:FONT.text,fontWeight:600,letterSpacing:'-0.08px',flexShrink:0}}>{label}</span>
        <div className="flex flex-col items-end gap-0.5">
          {editing ? (
            <div className="flex items-center gap-1.5">
              <span style={{color:C.tertiary,fontSize:11,fontFamily:FONT.mono}}>Target %</span>
              <input type="text" inputMode="decimal" value={targetPct}
                onChange={e=>onTargetChange(e.target.value)}
                style={{background:C.glass2,border:`0.5px solid ${C.sep}`,borderRadius:6,padding:'2px 6px',
                  color:C.primary,fontSize:13,fontFamily:FONT.mono,fontWeight:600,width:60,
                  textAlign:'right',outline:'none',WebkitAppearance:'none'}}/>
              <span style={{color:C.tertiary,fontSize:11,fontFamily:FONT.mono}}>%</span>
            </div>
          ) : (
            <span style={{color:color,fontSize:15,fontFamily:FONT.mono,fontWeight:700,fontVariantNumeric:'tabular-nums'}}>
              {pct.toFixed(1)}% → ${targetUsd.toFixed(0)}
            </span>
          )}
          <div className="flex items-center gap-2">
            <span style={{color:C.green,fontSize:11,fontFamily:FONT.mono,fontWeight:600}}>
              +{(currentPnl/balanceInit*100).toFixed(2)}% fatto
            </span>
            <span style={{color:C.tertiary,fontSize:11,fontFamily:FONT.mono}}>·</span>
            <span style={{color:missingPct > 0 ? C.orange : C.green, fontSize:11,fontFamily:FONT.mono,fontWeight:600}}>
              {missingPct > 0 ? `−${missingPct.toFixed(2)}% manca` : '✓ raggiunto'}
            </span>
          </div>
        </div>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{background:C.glass3}}>
        <div className="h-full rounded-full transition-all" style={{
          width:`${donePct}%`,
          background:`linear-gradient(90deg, ${color}, ${color}cc)`,
          boxShadow:`0 0 8px ${color}40`,
        }}/>
      </div>
    </div>
  );
};

const GoalTracker = ({ C }) => {
  // balanceInit mock
  const balanceInit = 10000;
  const currentPnl  = 510; // mock daily/cumulative PnL

  const [goals, setGoals] = usePersistedState('xt_goals_pct', {
    monthly: { targetPct: '15.0' },
    yearly:  { targetPct: '120.0' },
  });
  const [editing, setEditing] = useState(false);

  return (
    <Glass C={C}>
      <SectionHeader C={C} action={
        <button onClick={()=>setEditing(!editing)} style={{
          padding:'4px 10px',fontSize:11,fontFamily:FONT.text,fontWeight:600,
          color:editing?C.cyan:C.secondary, background:'transparent',
          border:'none',borderRadius:RADIUS.pill,cursor:'pointer',letterSpacing:'-0.08px',
        }}>{editing?'Fine':'Modifica'}</button>
      }>Obiettivi</SectionHeader>
      <div className="space-y-4">
        <GoalRow C={C} label="Mensile" balanceInit={balanceInit} currentPnl={currentPnl}
          targetPct={goals.monthly.targetPct} color={C.green} editing={editing}
          onTargetChange={(v)=>setGoals({...goals, monthly:{targetPct:v}})}/>
        <GoalRow C={C} label="Annuale" balanceInit={balanceInit} currentPnl={currentPnl}
          targetPct={goals.yearly.targetPct} color={C.cyan} editing={editing}
          onTargetChange={(v)=>setGoals({...goals, yearly:{targetPct:v}})}/>
      </div>
      {editing && (
        <div style={{marginTop:10,color:C.tertiary,fontSize:10,fontFamily:FONT.text,textAlign:'center'}}>
          Inserisci la % del conto che vuoi raggiungere. Il sistema calcola quanto manca.
        </div>
      )}
    </Glass>
  );
};

/* ============= iOS SWITCH ============= */
const IOSSwitch = ({ value, onChange, color }) => {
  const [pressing, setPressing] = React.useState(false);
  const handleToggle = () => {
    // Rigid = ON snap, Soft = OFF release
    if (!value) haptic.rigid(); else haptic.soft();
    onChange(!value);
  };
  return (
    <button
      onClick={handleToggle}
      onMouseDown={()=>setPressing(true)}
      onMouseUp={()=>setPressing(false)}
      onMouseLeave={()=>setPressing(false)}
      onTouchStart={()=>setPressing(true)}
      onTouchEnd={()=>setPressing(false)}
      role="switch" aria-checked={value}
      className={pressing ? 'xt-switch-track xt-switch-pressing' : 'xt-switch-track'}
      style={{
        position:'relative',
        width:44, height:26, borderRadius:13,
        background: value ? (color || '#39FF14') : 'rgba(120,120,128,0.32)',
        border:'none', cursor:'pointer', padding:0,
        transition:'background 0.22s ease',
        flexShrink:0, outline:'none',
      }}>
      <div className="xt-switch-thumb" style={{
        position:'absolute', top:1,
        left: value ? 19 : 1,
        width:22, height:22, borderRadius:'50%',
        background:'#fff',
        boxShadow:'0 2px 4px rgba(0,0,0,0.25), 0 0 0 0.5px rgba(0,0,0,0.04)',
        transformOrigin: value ? 'right center' : 'left center',
        // Thumb si schiaccia verso destra/sinistra al press (identico UIKit)
        transform: pressing ? (value ? 'scaleX(1.18) translateX(-2px)' : 'scaleX(1.18) translateX(2px)') : 'scaleX(1)',
        transition:'left 0.28s cubic-bezier(0.34,1.56,0.64,1), transform 0.14s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}/>
    </button>
  );
};

/* ============= SETTINGS MODAL ============= */
// Row e SectionTitle a livello modulo — evita ricreazione ad ogni render
const SettingsRow = ({ C, label, sub, children }) => (
  <div className="flex items-center justify-between py-3" style={{borderBottom:`0.5px solid ${C.sep}`}}>
    <div className="flex-1 min-w-0">
      <div style={{color:C.primary,fontSize:14,fontFamily:FONT.text,fontWeight:500,letterSpacing:'-0.1px'}}>{label}</div>
      {sub && <div style={{color:C.tertiary,fontSize:11,fontFamily:FONT.text,marginTop:2}}>{sub}</div>}
    </div>
    <div className="ml-3 flex-shrink-0">{children}</div>
  </div>
);

const SettingsSectionTitle = ({ children }) => (
  <div style={{
    color:'rgba(128,128,136,1)', fontSize:11, fontFamily:FONT.text, fontWeight:600,
    letterSpacing:'0.4px', textTransform:'uppercase', padding:'18px 4px 8px',
  }}>{children}</div>
);

const SettingsModal = ({ C, open, onClose, settings, setSettings, accounts, activeAccount, setActiveAccount, scheme, schemeOverride, setSchemeOverride }) => {
  if (!open) return null;

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:100,
      background:'rgba(0,0,0,0.6)',
      backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
      display:'flex', alignItems:'flex-start', justifyContent:'center',
      padding:'env(safe-area-inset-top, 0) 16px env(safe-area-inset-bottom, 0)',
      overflowY:'auto',
    }} onClick={onClose}>
      <div style={{
        marginTop:60, marginBottom:60,
        width:'100%', maxWidth:520,
        background: C.glass,
        backdropFilter:'saturate(180%) blur(50px)', WebkitBackdropFilter:'saturate(180%) blur(50px)',
        border:`0.5px solid ${C.sep2}`, borderRadius:32,
        padding:24,
        boxShadow:'0 20px 60px rgba(0,0,0,0.5)',
      }} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2">
          <h2 style={{fontFamily:FONT.display,fontSize:22,fontWeight:700,letterSpacing:'-0.4px',color:C.primary}}>Impostazioni</h2>
          <button onClick={onClose} style={{
            width:30,height:30,borderRadius:15, background:C.glass2,
            border:`0.5px solid ${C.sep}`, cursor:'pointer',
            display:'flex',alignItems:'center',justifyContent:'center',
          }}>
            <X size={14} style={{color:C.secondary}}/>
          </button>
        </div>

        {/* Aspetto */}
        <SettingsSectionTitle>Aspetto</SettingsSectionTitle>
        <div style={{background:C.glass2,borderRadius:14,padding:'2px 14px'}}>
          <SettingsRow C={C} label="Tema scuro" sub={schemeOverride==='auto' ? `Auto · ${scheme==='dark'?'attualmente scuro':'attualmente chiaro'}` : (schemeOverride==='dark'?'Sempre scuro':'Sempre chiaro')}>
            <SegmentedControl C={C} options={['Auto','Scuro','Chiaro']}
              value={schemeOverride==='auto'?'Auto':schemeOverride==='dark'?'Scuro':'Chiaro'}
              onChange={(v)=>setSchemeOverride(v==='Auto'?'auto':v==='Scuro'?'dark':'light')}/>
          </SettingsRow>
        </div>

        {/* Account */}
        <SettingsSectionTitle>Account</SettingsSectionTitle>
        <div style={{background:C.glass2,borderRadius:14,padding:'2px 14px'}}>
          {accounts.map((a,i)=>(
            <SettingsRow C={C} key={a.id} label={a.name} sub={`${a.broker} · Balance iniziale $${a.balanceInit.toLocaleString()}`}>
              <button onClick={()=>setActiveAccount(a.id)} style={{
                padding:'5px 12px', fontSize:11, fontFamily:FONT.text, fontWeight:600,
                color: activeAccount===a.id ? C.bg : C.cyan,
                background: activeAccount===a.id ? C.cyan : 'transparent',
                border:`1px solid ${C.cyan}`, borderRadius:RADIUS.pill, cursor:'pointer',
              }}>{activeAccount===a.id ? 'Attivo' : 'Attiva'}</button>
            </SettingsRow>
          ))}
        </div>

        {/* Protezioni */}
        <SettingsSectionTitle>Protezioni</SettingsSectionTitle>
        <div style={{background:C.glass2,borderRadius:14,padding:'2px 14px'}}>
          <SettingsRow C={C} label="Cooldown dopo 2 loss" sub="Banner di pausa di 30 min dopo 2 trade in perdita consecutivi">
            <IOSSwitch value={settings.cooldownEnabled} onChange={v=>setSettings({...settings, cooldownEnabled:v})} color={C.red}/>
          </SettingsRow>
          <SettingsRow C={C} label="Lock obiettivo giornaliero" sub="Banner verde quando raggiungi il target $ del giorno">
            <IOSSwitch value={settings.dailyLockEnabled} onChange={v=>setSettings({...settings, dailyLockEnabled:v})} color={C.green}/>
          </SettingsRow>
        </div>

        {/* Backup e Ripristino */}
        <SettingsSectionTitle>Backup & Ripristino</SettingsSectionTitle>
        <div style={{background:C.glass2,borderRadius:14,padding:'2px 14px'}}>
          <SettingsRow C={C} label="Salva backup JSON" sub="Esporta note, confluenze, impostazioni in un file datato">
            <button onClick={()=>{
              const data = {};
              Object.keys(localStorage).filter(k=>k.startsWith('xt_')).forEach(k=>{data[k]=localStorage.getItem(k);});
              data['_backup_date']    = new Date().toISOString();
              data['_backup_version'] = 'v1.1';
              const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
              const url  = URL.createObjectURL(blob);
              const a    = document.createElement('a');
              a.href = url;
              a.download = `xautrader-backup-${new Date().toISOString().slice(0,10)}.json`;
              a.click();
              URL.revokeObjectURL(url);
              haptic.success();
            }} style={{
              padding:'6px 14px', fontSize:12, fontFamily:FONT.text, fontWeight:600,
              color: C.bg, background: C.primary, border:'none',
              borderRadius:RADIUS.pill, cursor:'pointer',
            }}>Salva</button>
          </SettingsRow>
          <SettingsRow C={C} label="Ripristina da file" sub="Carica un backup precedente — sovrascrive i dati attuali">
            <label style={{
              padding:'6px 14px', fontSize:12, fontFamily:FONT.text, fontWeight:600,
              color: C.cyan, background: `${C.cyan}15`, border:`1px solid ${C.cyan}40`,
              borderRadius:RADIUS.pill, cursor:'pointer', display:'inline-block',
            }}>
              Carica
              <input type="file" accept=".json" style={{display:'none'}} onChange={(e)=>{
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                  try {
                    const d = JSON.parse(ev.target.result);
                    let count = 0;
                    Object.entries(d).forEach(([k,v]) => {
                      if (k.startsWith('xt_')) { localStorage.setItem(k, v); count++; }
                    });
                    haptic.success();
                    alert(`✓ Ripristinati ${count} valori. Ricarica la pagina per applicare.`);
                  } catch { haptic.error(); alert('File non valido o corrotto.'); }
                };
                reader.readAsText(file);
                e.target.value = '';
              }}/>
            </label>
          </SettingsRow>
        </div>

        <SettingsSectionTitle>Esportazione</SettingsSectionTitle>
        <div style={{background:C.glass2,borderRadius:14,padding:'2px 14px'}}>
          <SettingsRow C={C} label="Esporta report PDF" sub="Statistiche complete — ottimizzato per stampa">
            <button onClick={()=>window.print()} style={{
              padding:'6px 14px', fontSize:12, fontFamily:FONT.text, fontWeight:600,
              color: C.primary, background: 'transparent', border:`1px solid ${C.sep2}`,
              borderRadius:RADIUS.pill, cursor:'pointer',
            }}>Genera</button>
          </SettingsRow>
        </div>

        <div style={{color:C.tertiary,fontSize:10,fontFamily:FONT.mono,marginTop:20,textAlign:'center'}}>
          XAUTRADER · v1.1 · backup cloud in arrivo
        </div>
      </div>
    </div>
  );
};

const tradeGrade = (rr, C) => {
  const r = rr || 0;
  if (r >= 3) return { label: 'A+', color: C.green };
  if (r >= 2) return { label: 'A',  color: C.cyan };
  if (r >= 1) return { label: 'B',  color: C.purple };
  return { label: 'C', color: C.tertiary };
};

/* ============= CONFLUENCE TAGGER ============= */

const TF_LIST = ['M1','M2','M3','M7','M13','M17','M25','M33','M90','M99','H2','H3','H6','H12','D1','D3','1W'];

// Colori per categoria
const CONF_COLORS = {
  noTF:   '#C77DFF', // viola — confluenze senza TF
  withTF: '#7DF9FF', // cyan  — confluenze con TF
  vwap:   '#FFB627', // arancio — VWAP/KEYZONE
};

// Definizione confluenze
const CONF_NO_TF = ['FIBREVERSE','3D','VAO','POC','VAH','VAL','SWEEP'];
const CONF_WITH_TF = ['ORIGINE','ORIGINE REVERSE','OBB','OBV'];
// VWAP è gestita separatamente

// TF Dropdown
const TFDropdown = ({ C, value, onChange, placeholder='TF' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <div ref={ref} style={{position:'relative', flexShrink:0}}>
      <button onClick={()=>setOpen(!open)} className="xt-btn flex items-center gap-1" style={{
        padding:'4px 8px', borderRadius:8, border:`0.5px solid ${value ? CONF_COLORS.withTF+'60' : C.sep}`,
        background: value ? `${CONF_COLORS.withTF}18` : C.glass3,
        color: value ? CONF_COLORS.withTF : C.tertiary,
        fontSize:10, fontFamily:FONT.mono, fontWeight:700, cursor:'pointer', minWidth:44,
      }}>
        {value || placeholder}
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div style={{
          position:'absolute', top:'calc(100% + 4px)', left:0, zIndex:50,
          background:'#1C1C1E', border:`0.5px solid ${C.sep2}`,
          borderRadius:12, padding:4, minWidth:64,
          boxShadow:'0 8px 32px rgba(0,0,0,0.6)',
          display:'grid', gridTemplateColumns:'1fr 1fr', gap:2,
        }}>
          {value && (
            <button onClick={()=>{ onChange(null); setOpen(false); }}
              style={{gridColumn:'1/-1', padding:'4px 8px', borderRadius:7, border:'none',
                background:`${C.red}22`, color:C.red, fontSize:10, fontFamily:FONT.mono,
                fontWeight:600, cursor:'pointer', marginBottom:2}}>
              Reset
            </button>
          )}
          {TF_LIST.map(tf=>(
            <button key={tf} onClick={()=>{ onChange(tf); setOpen(false); }} className="xt-btn"
              style={{
                padding:'5px 6px', borderRadius:7, border:'none', cursor:'pointer',
                background: value===tf ? `${CONF_COLORS.withTF}28` : 'transparent',
                color: value===tf ? CONF_COLORS.withTF : C.secondary,
                fontSize:10, fontFamily:FONT.mono, fontWeight:700, textAlign:'center',
              }}>
              {tf}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Chip confluenza generica (con o senza TF)
const ConfChip = ({ C, label, color, tfs=[], onRemoveTF, onAddTF, onRemove, withTF=false }) => {
  return (
    <div style={{
      display:'inline-flex', alignItems:'center', flexWrap:'wrap', gap:4,
      padding:'4px 6px 4px 10px',
      background:`${color}18`, border:`0.5px solid ${color}45`,
      borderRadius:12, marginBottom:2,
    }}>
      <span style={{fontSize:11, fontFamily:FONT.text, fontWeight:700, color, letterSpacing:'0.1px'}}>{label}</span>
      {/* TF badges */}
      {tfs.map((tf,i)=>(
        <div key={i} className="flex items-center gap-0.5" style={{
          padding:'2px 4px 2px 6px', borderRadius:6,
          background:`${color}28`, border:`0.5px solid ${color}50`,
        }}>
          <span style={{fontSize:9, fontFamily:FONT.mono, fontWeight:700, color}}>{tf}</span>
          <button onClick={()=>onRemoveTF(i)} style={{background:'none',border:'none',cursor:'pointer',padding:'0 1px',display:'flex',lineHeight:1}}>
            <X size={8} style={{color}}/>
          </button>
        </div>
      ))}
      {/* Add TF button */}
      {withTF && (
        <TFDropdown C={C} value={null} placeholder="+ TF" onChange={(tf)=>{ if(tf) onAddTF(tf); }}/>
      )}
      {/* Remove chip */}
      <button onClick={onRemove} style={{background:'none',border:'none',cursor:'pointer',padding:'0 2px',display:'flex',lineHeight:1,marginLeft:2}}>
        <X size={10} style={{color:`${color}90`}}/>
      </button>
    </div>
  );
};

// VWAP chip speciale
const VWAPChip = ({ C, item, onRemove, onAddTF, onRemoveTF }) => {
  const isKZ = item.bull && item.bear;
  const color = isKZ ? '#FF457A' : item.bull ? C.green : C.red;
  const label = isKZ ? 'VWAP KEYZONE' : item.bull ? 'VWAP ▲' : 'VWAP ▼';
  return (
    <div style={{
      display:'inline-flex', alignItems:'center', flexWrap:'wrap', gap:4,
      padding:'4px 6px 4px 10px',
      background:`${color}18`, border:`0.5px solid ${color}45`,
      borderRadius:12, marginBottom:2,
    }}>
      <span style={{fontSize:11, fontFamily:FONT.text, fontWeight:700, color, letterSpacing:'0.1px'}}>{label}</span>
      {item.tfs.map((tf,i)=>(
        <div key={i} className="flex items-center gap-0.5" style={{
          padding:'2px 4px 2px 6px', borderRadius:6,
          background:`${color}28`, border:`0.5px solid ${color}50`,
        }}>
          <span style={{fontSize:9, fontFamily:FONT.mono, fontWeight:700, color}}>{tf}</span>
          <button onClick={()=>onRemoveTF(i)} style={{background:'none',border:'none',cursor:'pointer',padding:'0 1px',display:'flex'}}>
            <X size={8} style={{color}}/>
          </button>
        </div>
      ))}
      <TFDropdown C={C} value={null} placeholder="+ TF" onChange={(tf)=>{ if(tf) onAddTF(tf); }}/>
      <button onClick={onRemove} style={{background:'none',border:'none',cursor:'pointer',padding:'0 2px',display:'flex',marginLeft:2}}>
        <X size={10} style={{color:`${color}90`}}/>
      </button>
    </div>
  );
};

const ConfluenceTagger = ({ C, tradeId, confluences, setConfluences }) => {
  const data = confluences[tradeId] || { noTF: [], withTF: [], vwap: [] };

  // ── helpers ──
  const update = (fn) => setConfluences(prev => ({ ...prev, [tradeId]: fn(prev[tradeId] || { noTF:[], withTF:[], vwap:[] }) }));

  // noTF: toggle semplice
  const toggleNoTF = (name) => update(d => {
    const exists = d.noTF.find(x=>x.name===name);
    if (exists) return { ...d, noTF: d.noTF.filter(x=>x.name!==name) };
    if (name === 'FIBREVERSE' || name === '3D') return { ...d, noTF: [...d.noTF, { name, count:1 }] };
    return { ...d, noTF: [...d.noTF, { name }] };
  });
  const incFib = () => update(d => ({ ...d, noTF: d.noTF.map(x=>x.name==='FIBREVERSE'?{...x,count:(x.count||1)+1}:x) }));
  const decFib = () => update(d => ({ ...d, noTF: d.noTF.map(x=>x.name==='FIBREVERSE'?{...x,count:Math.max(1,(x.count||1)-1)}:x) }));
  const inc3D  = () => update(d => ({ ...d, noTF: d.noTF.map(x=>x.name==='3D'?{...x,count:(x.count||1)+1}:x) }));
  const dec3D  = () => update(d => ({ ...d, noTF: d.noTF.map(x=>x.name==='3D'?{...x,count:Math.max(1,(x.count||1)-1)}:x) }));

  // withTF: aggiungi istanza con TF array
  const addWithTF = (name) => update(d => ({ ...d, withTF: [...d.withTF, { name, tfs:[] }] }));
  const removeWithTF = (idx) => update(d => ({ ...d, withTF: d.withTF.filter((_,i)=>i!==idx) }));
  const addTFtoWithTF = (idx, tf) => update(d => ({
    ...d, withTF: d.withTF.map((x,i)=>i===idx && !x.tfs.includes(tf) ? {...x,tfs:[...x.tfs,tf]}:x)
  }));
  const removeTFfromWithTF = (idx, tfi) => update(d => ({
    ...d, withTF: d.withTF.map((x,i)=>i===idx ? {...x,tfs:x.tfs.filter((_,j)=>j!==tfi)}:x)
  }));

  // VWAP
  const addVWAP = (type) => update(d => ({ ...d, vwap: [...d.vwap, { bull: type==='bull', bear: type==='bear', tfs:[] }] }));
  const addVWAPKZ = () => update(d => ({ ...d, vwap: [...d.vwap, { bull:true, bear:true, tfs:[] }] }));
  const removeVWAP = (idx) => update(d => ({ ...d, vwap: d.vwap.filter((_,i)=>i!==idx) }));
  const addTFtoVWAP = (idx, tf) => update(d => ({
    ...d, vwap: d.vwap.map((x,i)=>i===idx && !x.tfs.includes(tf) ? {...x,tfs:[...x.tfs,tf]}:x)
  }));
  const removeTFfromVWAP = (idx, tfi) => update(d => ({
    ...d, vwap: d.vwap.map((x,i)=>i===idx ? {...x,tfs:x.tfs.filter((_,j)=>j!==tfi)}:x)
  }));

  const totalCount = data.noTF.length + data.withTF.length + data.vwap.length;

  // VWAP popup
  const [vwapOpen, setVwapOpen] = useState(false);
  const vwapRef = useRef(null);
  useEffect(() => {
    if (!vwapOpen) return;
    const handler = (e) => { if (vwapRef.current && !vwapRef.current.contains(e.target)) setVwapOpen(false); };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('touchstart', handler); };
  }, [vwapOpen]);

  return (
    <GlassInset C={C} padding="p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full" style={{background:C.cyan}}/>
          <span style={{color:C.secondary,fontSize:10,fontFamily:FONT.text,fontWeight:600,letterSpacing:'0.3px',textTransform:'uppercase'}}>
            Confluenze {totalCount > 0 && <span style={{color:C.cyan}}>· {totalCount}</span>}
          </span>
        </div>
      </div>

      {/* ── Chips attive ── */}
      {totalCount > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {data.noTF.map((x,i)=>(
            x.name === 'FIBREVERSE' ? (
              <div key={i} style={{
                display:'inline-flex', alignItems:'center', gap:4,
                padding:'4px 6px 4px 10px',
                background:`${CONF_COLORS.noTF}18`, border:`0.5px solid ${CONF_COLORS.noTF}45`,
                borderRadius:12,
              }}>
                <span style={{fontSize:11,fontFamily:FONT.text,fontWeight:700,color:CONF_COLORS.noTF}}>FIBREVERSE</span>
                <div className="flex items-center" style={{background:`${CONF_COLORS.noTF}28`,borderRadius:8,overflow:'hidden'}}>
                  <button onClick={decFib} style={{background:'none',border:'none',cursor:'pointer',padding:'2px 6px',color:CONF_COLORS.noTF,fontSize:13,lineHeight:1,fontWeight:700}}>−</button>
                  <span style={{fontSize:11,fontFamily:FONT.mono,fontWeight:700,color:CONF_COLORS.noTF,minWidth:16,textAlign:'center'}}>{x.count||1}</span>
                  <button onClick={incFib} style={{background:'none',border:'none',cursor:'pointer',padding:'2px 6px',color:CONF_COLORS.noTF,fontSize:13,lineHeight:1,fontWeight:700}}>+</button>
                </div>
                <button onClick={()=>toggleNoTF('FIBREVERSE')} style={{background:'none',border:'none',cursor:'pointer',padding:'0 2px',display:'flex',marginLeft:2}}>
                  <X size={10} style={{color:`${CONF_COLORS.noTF}90`}}/>
                </button>
              </div>
            ) : x.name === '3D' ? (
              <div key={i} style={{
                display:'inline-flex', alignItems:'center', gap:4,
                padding:'4px 6px 4px 10px',
                background:`${CONF_COLORS.noTF}18`, border:`0.5px solid ${CONF_COLORS.noTF}45`,
                borderRadius:12,
              }}>
                <span style={{fontSize:11,fontFamily:FONT.text,fontWeight:700,color:CONF_COLORS.noTF}}>3D</span>
                <div className="flex items-center" style={{background:`${CONF_COLORS.noTF}28`,borderRadius:8,overflow:'hidden'}}>
                  <button onClick={dec3D} style={{background:'none',border:'none',cursor:'pointer',padding:'2px 6px',color:CONF_COLORS.noTF,fontSize:13,lineHeight:1,fontWeight:700}}>−</button>
                  <span style={{fontSize:11,fontFamily:FONT.mono,fontWeight:700,color:CONF_COLORS.noTF,minWidth:16,textAlign:'center'}}>{x.count||1}</span>
                  <button onClick={inc3D} style={{background:'none',border:'none',cursor:'pointer',padding:'2px 6px',color:CONF_COLORS.noTF,fontSize:13,lineHeight:1,fontWeight:700}}>+</button>
                </div>
                <button onClick={()=>toggleNoTF('3D')} style={{background:'none',border:'none',cursor:'pointer',padding:'0 2px',display:'flex',marginLeft:2}}>
                  <X size={10} style={{color:`${CONF_COLORS.noTF}90`}}/>
                </button>
              </div>
            ) : (
              <ConfChip key={i} C={C} label={x.name} color={CONF_COLORS.noTF}
                onRemove={()=>toggleNoTF(x.name)} withTF={false}/>
            )
          ))}
          {data.withTF.map((x,i)=>(
            <ConfChip key={i} C={C} label={x.name} color={CONF_COLORS.withTF}
              tfs={x.tfs} withTF
              onAddTF={(tf)=>addTFtoWithTF(i,tf)}
              onRemoveTF={(tfi)=>removeTFfromWithTF(i,tfi)}
              onRemove={()=>removeWithTF(i)}/>
          ))}
          {data.vwap.map((x,i)=>(
            <VWAPChip key={i} C={C} item={x}
              onAddTF={(tf)=>addTFtoVWAP(i,tf)}
              onRemoveTF={(tfi)=>removeTFfromVWAP(i,tfi)}
              onRemove={()=>removeVWAP(i)}/>
          ))}
        </div>
      )}

      {/* ── Gruppo 1: FIBREVERSE, OBB, 3D, ORIGINE, ORIGINE REVERSE, SWEEP ── */}
      <div className="mb-2">
        <div className="flex flex-wrap gap-1.5">
          {['FIBREVERSE','3D'].map(name=>{
            const active = data.noTF.find(x=>x.name===name);
            return (
              <button key={name} onClick={()=>{haptic.light();toggleNoTF(name);}} className="xt-btn xt-chip" style={{
                padding:'5px 10px', borderRadius:8, cursor:'pointer',
                border:`0.5px solid ${active ? CONF_COLORS.noTF+'60' : C.sep}`,
                background: active ? `${CONF_COLORS.noTF}22` : C.glass3,
                color: active ? CONF_COLORS.noTF : C.secondary,
                fontSize:11, fontFamily:FONT.mono, fontWeight:700,
              }}>{name}</button>
            );
          })}
          {['OBB','ORIGINE','ORIGINE REVERSE'].map(name=>(
            <button key={name} onClick={()=>{haptic.light();addWithTF(name);}} className="xt-btn xt-chip" style={{
              padding:'5px 10px', borderRadius:8, cursor:'pointer',
              border:`0.5px solid ${C.sep}`,
              background: C.glass3,
              color: C.secondary,
              fontSize:11, fontFamily:FONT.mono, fontWeight:700,
            }}>{name}</button>
          ))}
          {['SWEEP'].map(name=>{
            const active = data.noTF.find(x=>x.name===name);
            return (
              <button key={name} onClick={()=>{haptic.light();toggleNoTF(name);}} className="xt-btn xt-chip" style={{
                padding:'5px 10px', borderRadius:8, cursor:'pointer',
                border:`0.5px solid ${active ? CONF_COLORS.noTF+'60' : C.sep}`,
                background: active ? `${CONF_COLORS.noTF}22` : C.glass3,
                color: active ? CONF_COLORS.noTF : C.secondary,
                fontSize:11, fontFamily:FONT.mono, fontWeight:700,
              }}>{name}</button>
            );
          })}
        </div>
      </div>

      {/* ── Gruppo 2: VWAP, OBV, VAO, POC, VAH, VAL ── */}
      <div className="mb-2" style={{borderTop:`0.5px solid ${C.sep}`, paddingTop:8}}>
        <div className="flex flex-wrap gap-1.5">
          {/* VWAP — singolo bottone, popup con le 3 scelte */}
          <div ref={vwapRef} style={{position:'relative', display:'inline-block'}}>
            <button onClick={()=>setVwapOpen(o=>!o)} className="xt-btn" style={{
              padding:'5px 10px', borderRadius:8, cursor:'pointer',
              border:`0.5px solid ${C.sep}`,
              background: C.glass3,
              color: C.secondary,
              fontSize:11, fontFamily:FONT.mono, fontWeight:700,
            }}>VWAP</button>
            {vwapOpen && (
              <div style={{
                position:'absolute', top:'calc(100% + 6px)', left:0, zIndex:60,
                background:'#1C1C1E', border:`0.5px solid rgba(255,255,255,0.12)`,
                borderRadius:12, padding:'6px', minWidth:130,
                boxShadow:'0 8px 32px rgba(0,0,0,0.65)',
                display:'flex', flexDirection:'column', gap:4,
              }}>
                <button onClick={()=>{ addVWAP('bull'); setVwapOpen(false); }} className="xt-btn" style={{
                  padding:'7px 12px', borderRadius:8, cursor:'pointer', border:'none',
                  background:`${C.green}18`, color:C.green,
                  fontSize:11, fontFamily:FONT.mono, fontWeight:700, textAlign:'left',
                }}>▲ RIALZISTA</button>
                <button onClick={()=>{ addVWAP('bear'); setVwapOpen(false); }} className="xt-btn" style={{
                  padding:'7px 12px', borderRadius:8, cursor:'pointer', border:'none',
                  background:`${C.red}18`, color:C.red,
                  fontSize:11, fontFamily:FONT.mono, fontWeight:700, textAlign:'left',
                }}>▼ RIBASSISTA</button>
                <button onClick={()=>{ addVWAPKZ(); setVwapOpen(false); }} className="xt-btn" style={{
                  padding:'7px 12px', borderRadius:8, cursor:'pointer', border:'none',
                  background:'#FF457A18', color:'#FF457A',
                  fontSize:11, fontFamily:FONT.mono, fontWeight:700, textAlign:'left',
                }}>⬡ KEYZONE</button>
              </div>
            )}
          </div>
          {['OBV'].map(name=>(
            <button key={name} onClick={()=>{haptic.light();addWithTF(name);}} className="xt-btn xt-chip" style={{
              padding:'5px 10px', borderRadius:8, cursor:'pointer',
              border:`0.5px solid ${C.sep}`,
              background: C.glass3,
              color: C.secondary,
              fontSize:11, fontFamily:FONT.mono, fontWeight:700,
            }}>{name}</button>
          ))}
          {['VAO','POC','VAH','VAL'].map(name=>{
            const active = data.noTF.find(x=>x.name===name);
            return (
              <button key={name} onClick={()=>{haptic.light();toggleNoTF(name);}} className="xt-btn xt-chip" style={{
                padding:'5px 10px', borderRadius:8, cursor:'pointer',
                border:`0.5px solid ${active ? CONF_COLORS.noTF+'60' : C.sep}`,
                background: active ? `${CONF_COLORS.noTF}22` : C.glass3,
                color: active ? CONF_COLORS.noTF : C.secondary,
                fontSize:11, fontFamily:FONT.mono, fontWeight:700,
              }}>{name}</button>
            );
          })}
        </div>
      </div>

    </GlassInset>
  );
};

/* ============= MARKDOWN MINI RENDER ============= */
// Supporta **bold**, *italic*, - bullet, [text](url)
const renderMarkdown = (text, C) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, i) => {
    let html = line
      .replace(/\*\*(.+?)\*\*/g, `<strong style="color:${C.primary};font-weight:600">$1</strong>`)
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[(.+?)\]\((.+?)\)/g, `<a href="$2" target="_blank" rel="noopener" style="color:${C.cyan};text-decoration:underline">$1</a>`);
    if (line.trim().startsWith('- ')) {
      html = `<span style="color:${C.tertiary}">•</span> ` + html.replace(/^- /, '');
    }
    return <div key={i} dangerouslySetInnerHTML={{__html: html || '&nbsp;'}}/>;
  });
};

const detectStreak = (trades) => {
  let streak = 0; let type = null;
  const sorted = [...trades].sort((a,b)=>b.id - a.id);
  for (const t of sorted) {
    if (t.pnl === 0) continue;
    const isWin = t.pnl > 0;
    if (type === null) { type = isWin; streak = 1; }
    else if (type === isWin) streak++;
    else break;
  }
  return { streak, isWin: type };
};

// Cooldown: dopo 2 trade loss consecutivi (un trade = un basket, anche con scaglioni multipli conta come 1)
const detectCooldown = (trades) => {
  // Aggrega per basket
  const baskets = {};
  trades.forEach(t => {
    if (!baskets[t.basket]) baskets[t.basket] = { pnl: 0, date: t.date, id: t.id };
    baskets[t.basket].pnl += t.pnl;
    if (t.id > baskets[t.basket].id) baskets[t.basket].id = t.id;
  });
  const list = Object.values(baskets).sort((a,b)=>b.id - a.id);
  let count = 0;
  for (const b of list) {
    if (b.pnl < 0) count++;
    else break;
  }
  return count >= 2;
};

// Daily target check
const checkDailyTarget = (todayTrades, target) => {
  const pnl = todayTrades.reduce((s,t)=>s+t.pnl, 0);
  return { reached: pnl >= target && target > 0, pnl };
};

/* ============= APP ICONS ============= */
const AppIcon = ({ children, gradient, active, size = 32 }) => (
  <div style={{
    width: size, height: size,
    borderRadius: size * 0.32,
    background: gradient,
    display:'flex', alignItems:'center', justifyContent:'center',
    boxShadow: active
      ? `0 0 0 0.5px rgba(255,255,255,0.18), 0 4px 12px rgba(0,0,0,0.5)`
      : `0 0 0 0.5px rgba(255,255,255,0.08)`,
    transition:'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
    transform: active ? 'scale(1)' : 'scale(0.92)',
    flexShrink: 0,
  }}>
    {children}
  </div>
);

const IconToday = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill={color}/>
  </svg>
);
const IconHistory = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="16" rx="2.5" stroke={color} strokeWidth="2"/>
    <path d="M3 9h18M8 3v4M16 3v4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="9" cy="14" r="1.4" fill={color}/>
    <circle cx="15" cy="14" r="1.4" fill={color}/>
  </svg>
);
const IconStats = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect x="3"  y="11" width="4" height="10" rx="1.2" fill={color}/>
    <rect x="10" y="6"  width="4" height="15" rx="1.2" fill={color}/>
    <rect x="17" y="2"  width="4" height="19" rx="1.2" fill={color}/>
  </svg>
);

const IconAnalytics = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="6"  cy="18" r="2" fill={color}/>
    <circle cx="12" cy="12" r="2" fill={color}/>
    <circle cx="18" cy="6"  r="2" fill={color}/>
    <path d="M6 16l6-4 6-6" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const tabIcons = (C) => ({
  daily:     { glyph: IconToday,    gradient: `linear-gradient(135deg, ${C.green}, #14a300)` },
  temporal:  { glyph: IconHistory,  gradient: `linear-gradient(135deg, ${C.cyan}, #0099b3)` },
  stats:     { glyph: IconStats,    gradient: `linear-gradient(135deg, ${C.purple}, #7a2eb5)` },
});

/* ============= RISK BAR (protezioni) ============= */
const RiskBar = ({ C, label, current, limit, isPct, editing, rawValue, onRawChange }) => {
  const ok = current > limit;
  const pctFill = limit < 0 ? Math.min(Math.abs(Math.min(current, 0) / limit) * 100, 100) : 0;
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span style={{color:C.secondary,fontSize:11,fontFamily:FONT.text,fontWeight:500}}>{label}</span>
        <div className="flex items-center gap-2">
          <span style={{color: ok?C.green:C.red, fontSize:12, fontFamily:FONT.mono, fontWeight:600, fontVariantNumeric:'tabular-nums'}}>
            {current >= 0 ? '+' : ''}{current.toFixed(2)}{isPct?'%':''}
          </span>
          <span style={{color:C.tertiary,fontSize:11,fontFamily:FONT.mono}}>/</span>
          {editing ? (
            <div className="flex items-center" style={{
              background:C.glass3, border:`0.5px solid ${C.red}50`,
              borderRadius:8, padding:'3px 8px', gap:2, display:'flex', alignItems:'center',
            }}>
              <span style={{color:C.red,fontSize:13,fontFamily:FONT.mono,fontWeight:700,userSelect:'none'}}>−</span>
              <input
                type="text"
                inputMode="decimal"
                value={rawValue}
                onChange={e => {
                  // allow empty string, digits and single dot only
                  const v = e.target.value.replace(/[^0-9.]/g, '');
                  onRawChange(v);
                }}
                onBlur={e => {
                  // on blur: if empty or 0, reset to '0.1'
                  if (!e.target.value || parseFloat(e.target.value) === 0) onRawChange('0.1');
                }}
                style={{
                  width:44, background:'transparent', border:'none', outline:'none',
                  color:C.red, fontSize:13, fontFamily:FONT.mono, fontWeight:700,
                  textAlign:'right', fontVariantNumeric:'tabular-nums',
                }}
              />
              <span style={{color:C.tertiary,fontSize:11,fontFamily:FONT.mono}}>%</span>
            </div>
          ) : (
            <span style={{color:C.secondary, fontSize:12, fontFamily:FONT.mono, fontWeight:600, fontVariantNumeric:'tabular-nums'}}>
              −{Math.abs(limit).toFixed(1)}%
            </span>
          )}
        </div>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{background:C.glass3}}>
        <div className="h-full rounded-full transition-all"
             style={{width:`${pctFill}%`, background: ok ? (pctFill > 70 ? C.yellow : C.green) : C.red}}/>
      </div>
    </div>
  );
};

/* ============= PROTEZIONI CARD ============= */
const ProtezioniCard = ({ C, dayPnLPct, weeklyPnLPct, consecLoss }) => {
  const [editing, setEditing] = useState(false);
  const [config, setConfig] = usePersistedState('xt_risk_limits', {
    dailyLoss: '2.5',
    weeklyLoss: '5.0',
    maxConsec: '3',
  });

  // raw strings during editing — separate so we can clear without issues
  const [rawDaily,  setRawDaily]  = useState(config.dailyLoss);
  const [rawWeekly, setRawWeekly] = useState(config.weeklyLoss);
  const [rawConsec, setRawConsec] = useState(config.maxConsec);

  const startEdit = () => {
    setRawDaily(config.dailyLoss);
    setRawWeekly(config.weeklyLoss);
    setRawConsec(config.maxConsec);
    setEditing(true);
  };

  const commitEdit = () => {
    const d = Math.max(0.1, parseFloat(rawDaily)  || 0.1).toFixed(1);
    const w = Math.max(0.1, parseFloat(rawWeekly) || 0.1).toFixed(1);
    const c = Math.max(1,   parseInt(rawConsec)   || 1).toString();
    setConfig({ dailyLoss: d, weeklyLoss: w, maxConsec: c });
    setEditing(false);
  };

  const dailyLimit   = -(parseFloat(config.dailyLoss)  || 2.5);
  const weeklyLimit  = -(parseFloat(config.weeklyLoss) || 5.0);
  const maxConsec    =   parseInt(config.maxConsec)     || 3;

  const dailyOk   = dayPnLPct   > dailyLimit;
  const weeklyOk  = weeklyPnLPct > weeklyLimit;
  const consecOk  = consecLoss   < maxConsec;
  const allOk     = dailyOk && weeklyOk && consecOk;

  return (
    <Glass C={C}>
      <SectionHeader C={C} action={
        <div className="flex items-center gap-2">
          <span style={{
            color: allOk ? C.green : C.red,
            fontSize:11, fontFamily:FONT.text, fontWeight:600,
            letterSpacing:'0.3px', textTransform:'uppercase',
          }}>● {allOk ? 'Operativo' : 'STOP'}</span>
          <button onClick={editing ? commitEdit : startEdit} style={{
            padding:'4px 10px', fontSize:11, fontFamily:FONT.text, fontWeight:600,
            color: editing ? C.cyan : C.secondary,
            background:'transparent', border:'none',
            borderRadius:RADIUS.pill, cursor:'pointer',
          }}>{editing ? 'Fine' : 'Limiti'}</button>
        </div>
      }>Protezioni</SectionHeader>

      <div className="space-y-4">
        <RiskBar C={C} label="Daily P&L" current={dayPnLPct}
          limit={dailyLimit} isPct
          editing={editing} rawValue={rawDaily} onRawChange={setRawDaily}/>
        <RiskBar C={C} label="Weekly P&L" current={weeklyPnLPct}
          limit={weeklyLimit} isPct
          editing={editing} rawValue={rawWeekly} onRawChange={setRawWeekly}/>

        <div className="flex items-center justify-between">
          <span style={{color:C.secondary,fontSize:11,fontFamily:FONT.text,fontWeight:500}}>Loss consecutive</span>
          <div className="flex items-center gap-2">
            <span style={{color: consecOk ? C.green : C.red, fontSize:12, fontFamily:FONT.mono, fontWeight:600}}>
              {consecLoss}
            </span>
            <span style={{color:C.tertiary,fontSize:11,fontFamily:FONT.mono}}>/</span>
            {editing ? (
              <div className="flex items-center" style={{
                background:C.glass3, border:`0.5px solid ${C.orange}50`,
                borderRadius:8, padding:'3px 8px', display:'flex', alignItems:'center', gap:2,
              }}>
                <input
                  type="text"
                  inputMode="numeric"
                  value={rawConsec}
                  onChange={e => setRawConsec(e.target.value.replace(/[^0-9]/g, ''))}
                  onBlur={e => { if (!e.target.value || parseInt(e.target.value) < 1) setRawConsec('1'); }}
                  style={{
                    width:28, background:'transparent', border:'none', outline:'none',
                    color:C.orange, fontSize:13, fontFamily:FONT.mono, fontWeight:700,
                    textAlign:'center', fontVariantNumeric:'tabular-nums',
                  }}
                />
              </div>
            ) : (
              <span style={{color:C.secondary, fontSize:12, fontFamily:FONT.mono, fontWeight:600}}>
                {maxConsec}
              </span>
            )}
          </div>
        </div>
      </div>
    </Glass>
  );
};

/* ============= DAILY ============= */
const DailyView = ({ C, now, settings, trades, equity }) => {
  const allTrades = trades || [];
  const equityCurve = equity && equity.length > 0 ? equity : [{day:'Dep.',value:10000}];
  const today = useMemo(() => { const d = new Date().toISOString().slice(0,10); return allTrades.filter(t=>t.date===d); }, [allTrades]);
  const dayPnL = useMemo(() => today.reduce((s,t)=>s+t.pnl,0), [today]);
  const dayWR  = today.length ? Math.round(today.filter(t=>t.pnl>0).length/today.length*100) : 0;
  const BALANCE_INIT = equityCurve[0]?.value || 10000;
  const BALANCE_NOW = equityCurve[equityCurve.length-1]?.value || BALANCE_INIT;
  const dayPnLPct = BALANCE_NOW > 0 ? (dayPnL / BALANCE_NOW * 100) : 0;
  // Weekly P&L: somma ultimi 5 giorni trading dal mock
  const weeklyPnL = useMemo(() => { const now = new Date(); const mon = new Date(now); mon.setDate(now.getDate()-((now.getDay()+6)%7)); const monStr = mon.toISOString().slice(0,10); return allTrades.filter(t=>t.date>=monStr).reduce((s,t)=>s+t.pnl,0); }, [allTrades]);
  const weeklyPnLPct = BALANCE_NOW > 0 ? (weeklyPnL / BALANCE_NOW * 100) : 0;
  // Consecutive losses: trade più recenti con pnl < 0
  const consecLoss = useMemo(() => {
    const sorted = [...allTrades].sort((a,b) => b.id - a.id);
    let n = 0;
    for (const t of sorted) { if (t.pnl < 0) n++; else break; }
    return n;
  }, []);
  const [expanded, setExpanded] = useState(null);
  const [notes, setNotes] = usePersistedState('xt_notes', {});
  const [confidence, setConfidence] = usePersistedState('xt_confidence', {});
  const [dayReflection, setDayReflection] = usePersistedState('xt_day_reflection', {});
  const [confluences, setConfluences] = usePersistedState('xt_confluences', {});  // {tradeId: ['Fib 0.618','EMA200']}
  const [filter, setFilter] = useState('ALL');
  const [savedFlash, setSavedFlash] = useState(false);
  const savedFlashMounted = useRef(false);

  useEffect(() => {
    if (!savedFlashMounted.current) { savedFlashMounted.current = true; return; }
    if (Object.keys(notes).length === 0 && Object.keys(dayReflection).length === 0) return;
    setSavedFlash(true);
    const t = setTimeout(()=>setSavedFlash(false), 1200);
    return () => clearTimeout(t);
  }, [notes, dayReflection]);

  const updateNote = (id, field, value) =>
    setNotes(prev => ({ ...prev, [id]: { ...(prev[id]||{}), [field]: value } }));

  const filtered = useMemo(() => {
    let base = filter === 'ALL' ? today
      : filter === 'LONG' || filter === 'SHORT' ? today.filter(t => t.dir === filter)
      : filter === 'RUN' ? today.filter(t => t.open && t.partials && t.partials.length > 0)
      : today.filter(t => t.closed === filter);
    // Trade aperti sempre in cima
    return [...base].sort((a, b) => {
      if (a.open && !b.open) return -1;
      if (!a.open && b.open) return  1;
      return b.id - a.id;
    });
  }, [today, filter]);

  const counts = useMemo(() => ({
    ALL: today.length,
    LONG: today.filter(t=>t.dir==='LONG').length,
    SHORT: today.filter(t=>t.dir==='SHORT').length,
    TP: today.filter(t=>t.closed==='TP').length,
    SL: today.filter(t=>t.closed==='SL').length,
    BE: today.filter(t=>t.closed==='BE').length,
    RUN: today.filter(t=>t.open && t.partials && t.partials.length > 0).length,
  }), [today]);

  const dateLabel = useMemo(() => {
    const opts = { weekday:'long', day:'numeric', month:'long' };
    return now.toLocaleDateString('it-IT', opts).replace(/^./, c => c.toUpperCase());
  }, [now]);
  const timeLabel = useMemo(() => now.toLocaleTimeString('it-IT', { hour:'2-digit', minute:'2-digit', second:'2-digit' }), [now]);

  const DAILY_TARGET = settings?.dailyTarget || 150;
  const targetPct    = Math.min(dayPnL / DAILY_TARGET * 100, 100);
  const targetDone   = dayPnL >= DAILY_TARGET;

  return (
    <div className="space-y-4">
      <Glass C={C} padding="p-6">
        <div className="flex items-center justify-between mb-3">
          <div style={{color:C.tertiary, fontSize:11, fontFamily:FONT.text, fontWeight:600, letterSpacing:'0.4px', textTransform:'uppercase'}}>
            {dateLabel} · {timeLabel}
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1" style={{
            background: `${C.green}12`,
            border: `0.5px solid ${C.green}35`,
            borderRadius: RADIUS.pill,
          }}>
            <div className="w-1 h-1 rounded-full" style={{background:C.green, opacity:0.8}}/>
            <span style={{color:C.green, fontSize:11, fontFamily:FONT.mono, fontWeight:600, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.2px'}}>
              ${BALANCE_NOW.toFixed(2)}
            </span>
          </div>
        </div>

        {/* P&L principale — occupa tutta la larghezza */}
        <div>
          <div style={{fontFamily:FONT.display, fontSize:52, fontWeight:700, letterSpacing:'-1.2px', lineHeight:1, color: dayPnL>=0?C.green:C.red, fontVariantNumeric:'tabular-nums', ...neonText(dayPnL>=0?C.green:C.red, C.scheme)}}>
            {dayPnL>=0?'+':''}${dayPnL.toFixed(2)}
          </div>
          <div style={{color: dayPnL>=0?C.green:C.red, fontSize:16, fontFamily:FONT.mono, fontWeight:600, marginTop:4, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.3px', ...neonText(dayPnL>=0?C.green:C.red, C.scheme)}}>
            {dayPnLPct>=0?'+':''}{dayPnLPct.toFixed(2)}% del conto
          </div>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <Tag color={dayPnL>=0?C.green:C.red}>P&L Giorno</Tag>
            <Tag color={C.cyan}>{today.length} trades</Tag>
            <Tag color={C.purple}>{dayWR}% win</Tag>
          </div>
        </div>

        {/* Target giornaliero progress */}
        <div className="mt-4 pt-4" style={{borderTop:`0.5px solid ${C.sep}`}}>
          <div className="flex items-center justify-between mb-2">
            <div>
              {targetDone
                ? <span style={{color:C.green,fontSize:11,fontFamily:FONT.mono,fontWeight:700,letterSpacing:'0.2px'}}>✓ TARGET RAGGIUNTO</span>
                : <span style={{color:C.tertiary,fontSize:11,fontFamily:FONT.text,fontWeight:500}}>Target giornaliero</span>
              }
            </div>
            <span style={{color:C.secondary,fontSize:11,fontFamily:FONT.mono,fontVariantNumeric:'tabular-nums'}}>
              <span style={{color: targetDone ? C.green : C.primary, fontWeight:700}}>${Math.max(dayPnL,0).toFixed(0)}</span>
              <span style={{color:C.tertiary}}> / ${DAILY_TARGET}</span>
              {!targetDone && <span style={{color:C.orange,fontSize:10}}> · −${(DAILY_TARGET - Math.max(dayPnL,0)).toFixed(0)} mancano</span>}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{background:C.glass3}}>
            <div className="h-full rounded-full" style={{
              width:`${Math.max(targetPct,0)}%`,
              background: targetDone
                ? `linear-gradient(90deg,${C.green},${C.cyan})`
                : targetPct > 60
                  ? `linear-gradient(90deg,${C.yellow},${C.green})`
                  : `linear-gradient(90deg,${C.orange},${C.yellow})`,
              boxShadow: targetDone ? `0 0 10px ${C.green}60` : `0 0 6px ${C.orange}40`,
              transition: 'width 0.6s cubic-bezier(0.34,1.18,0.64,1)',
            }}/>
          </div>

          {/* Equity — riga sotto la barra, allineata a destra */}
          <div className="flex items-center justify-end mt-3 gap-1.5">
            <span style={{color:C.tertiary, fontSize:10, fontFamily:FONT.text, fontWeight:500}}>Equity</span>
            <span style={{color:C.secondary, fontSize:13, fontFamily:FONT.mono, fontWeight:600, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.3px'}}>
              ${BALANCE_NOW.toFixed(2)}
            </span>
            <span style={{color:C.green, fontSize:10, fontFamily:FONT.mono, fontWeight:500}}>
              ↑{((BALANCE_NOW - BALANCE_INIT)/BALANCE_INIT*100).toFixed(2)}%
            </span>
          </div>
        </div>
      </Glass>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat C={C} label="P&L Giorno" value={`$${dayPnL.toFixed(2)}`} color={dayPnL>=0?C.green:C.red} sub="netto commissioni"  className="xt-stagger-1"/>
        <Stat C={C} label="Win Rate"   value={`${dayWR}%`} color={C.cyan}   sub={`${today.filter(t=>t.pnl>0).length}/${today.length} trades`}  className="xt-stagger-2"/>
        <Stat C={C} label="Best R:R"   value={(() => { const rrVals = today.map(t=>t.rr||0).filter(v=>v>0); return rrVals.length ? Math.max(...rrVals).toFixed(1) : '—'; })()} color={C.purple} sub="multipli"  className="xt-stagger-3"/>
        <Stat C={C} label="Avg Hold"   value="47m" color={C.yellow} sub="durata media"  className="xt-stagger-4"/>
      </div>

      <Glass C={C}>
        <SectionHeader C={C}>Trade del giorno</SectionHeader>
          <div className="flex flex-wrap gap-1.5 mb-3">
            <FilterChip C={C} label="Tutti" count={counts.ALL}   active={filter==='ALL'}   onClick={()=>setFilter('ALL')}/>
            <FilterChip C={C} label="Long"  count={counts.LONG}  active={filter==='LONG'}  onClick={()=>setFilter('LONG')}/>
            <FilterChip C={C} label="Short" count={counts.SHORT} active={filter==='SHORT'} onClick={()=>setFilter('SHORT')}/>
            <FilterChip C={C} label="TP"    count={counts.TP}    active={filter==='TP'}    onClick={()=>setFilter('TP')}/>
            <FilterChip C={C} label="SL"    count={counts.SL}    active={filter==='SL'}    onClick={()=>setFilter('SL')}/>
            <FilterChip C={C} label="BE"    count={counts.BE}    active={filter==='BE'}    onClick={()=>setFilter('BE')}/>
            {counts.RUN > 0 && <FilterChip C={C} label="Run" count={counts.RUN} active={filter==='RUN'} onClick={()=>setFilter('RUN')} color={C.orange}/>}
          </div>

          {/* Quick stats bar — aggiornata col filtro attivo */}
          {filtered.length > 0 && (() => {
            const closed = filtered.filter(t=>!t.open);
            const wins   = closed.filter(t=>t.pnl>0);
            const qs_wr  = closed.length ? Math.round(wins.length/closed.length*100) : 0;
            const qs_pnl = filtered.reduce((s,t)=>s+t.pnl,0);
            const rrArr  = closed.filter(t=>t.rr>0);
            const qs_rr  = rrArr.length ? rrArr.reduce((s,t)=>s+t.rr,0)/rrArr.length : 0;
            const qs_exp = closed.length ? qs_pnl/closed.length : 0;
            return (
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[
                  {l:'P&L',      v:`${qs_pnl>=0?'+':''}$${qs_pnl.toFixed(0)}`, c:qs_pnl>=0?C.green:C.red},
                  {l:'WR',       v:`${qs_wr}%`,  c:qs_wr>=60?C.green:qs_wr>=40?C.yellow:C.red},
                  {l:'Avg R:R',  v:qs_rr>0?qs_rr.toFixed(2):'—', c:C.purple},
                  {l:'Exp/trade',v:`${qs_exp>=0?'+':''}$${qs_exp.toFixed(0)}`, c:qs_exp>=0?C.cyan:C.red},
                ].map((s,i)=>(
                  <GlassInset C={C} key={i} padding="p-2">
                    <div style={{color:C.tertiary,fontSize:8,fontFamily:FONT.text,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.3px'}}>{s.l}</div>
                    <div style={{color:s.c,fontSize:13,fontFamily:FONT.mono,fontWeight:700,marginTop:2,fontVariantNumeric:'tabular-nums'}}>{s.v}</div>
                  </GlassInset>
                ))}
              </div>
            );
          })()}

          <div className="space-y-1">
            {filtered.length === 0 && (
              <div className="py-10 flex flex-col items-center justify-center gap-2">
                <div style={{
                  width:44, height:44, borderRadius:14,
                  background:C.glass2, border:`0.5px solid ${C.sep}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke={C.tertiary} strokeWidth="1.8"/>
                    <path d="M16.5 16.5L21 21" stroke={C.tertiary} strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </div>
                <span style={{color:C.tertiary,fontSize:13,fontFamily:FONT.text,fontWeight:500}}>
                  Nessun trade con questo filtro
                </span>
              </div>
            )}
            {filtered.map((t, idx) => {
              const isExpanded = expanded === t.id;
              const tradeNotes = notes[t.id] || {};
              const grade = tradeGrade(t.rr, C);
              const pnlPct = BALANCE_NOW > 0 ? (t.pnl / BALANCE_NOW * 100) : 0;
              return (
                <div key={t.id} style={{borderTop: idx===0?'none':`0.5px solid ${C.sep}`}}
                  className={t.open ? 'xt-open-trade' : ''}
                  >
                  <div onClick={()=>setExpanded(isExpanded ? null : t.id)}
                       className="xt-row flex items-center justify-between py-3 cursor-pointer px-2.5 -mx-2.5"
                       style={{background: isExpanded ? C.glass3 : 'transparent', borderRadius: RADIUS.inset}}>
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-8 rounded-full" style={{background:t.open?C.orange:t.pnl>=0?C.green:C.red}}/>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {t.open && (
                            <div className="flex items-center gap-1" style={{padding:'2px 6px',borderRadius:6,background:`${C.orange}22`,border:`0.5px solid ${C.orange}55`}}>
                              <div className="xt-live-dot rounded-full" style={{background:C.orange,width:5,height:5}}/>
                              <span style={{color:C.orange,fontSize:9,fontFamily:FONT.mono,fontWeight:700,letterSpacing:'0.4px'}}>LIVE</span>
                            </div>
                          )}
                          <span style={{color:C.primary,fontSize:13,fontFamily:FONT.text,fontWeight:500}}>
                            {t.dir} · {t.basket}
                          </span>
                          <Tag color={grade.color} size="sm">{grade.label}</Tag>
                          {t.partials && t.partials.length > 0 && <Tag color={C.cyan} size="sm">{t.partials.length} parziali</Tag>}
                          {t.tags.map(tag => (
                            <Tag key={tag} color={tag==='A+'?C.green:tag==='FOMO'?C.red:C.purple} size="sm">{tag}</Tag>
                          ))}
                        </div>
                        <div style={{color:C.tertiary,fontSize:11,fontFamily:FONT.mono,marginTop:1}}>
                          {t.session} · {t.closed ?? (t.open?'aperto':'—')} · {(t.rr??0).toFixed(1)}R
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(tradeNotes.good||tradeNotes.bad||tradeNotes.next) && (
                        <div className="w-1 h-1 rounded-full" style={{background:C.cyan}}/>
                      )}
                      <div className="text-right">
                        <div style={{color:t.open?C.orange:t.pnl>=0?C.green:C.red,fontSize:14,fontFamily:FONT.mono,fontWeight:600,fontVariantNumeric:'tabular-nums'}}>
                          {t.pnl>=0?'+':''}${t.pnl.toFixed(2)}
                        </div>
                        <div style={{color:t.open?C.orange:t.pnl>=0?C.green:C.red,fontSize:10,fontFamily:FONT.mono,fontWeight:500,opacity:0.75,fontVariantNumeric:'tabular-nums'}}>
                          {pnlPct>=0?'+':''}{pnlPct.toFixed(2)}%
                        </div>
                      </div>
                      <ChevronRight size={12} style={{color:C.tertiary,transform: isExpanded?'rotate(90deg)':'rotate(0deg)',transition:'transform 0.2s'}}/>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="pb-3 px-2.5 -mx-2.5 space-y-3">
                      <div className="grid grid-cols-4 gap-2 mt-2 mb-1">
                        {[
                          {l:'Entry', v:t.entry.toFixed(2)},
                          {l: t.open ? 'Live' : 'Exit',
                           v: t.open ? (t.currentPrice?.toFixed(2) ?? '—') : (t.exit?.toFixed(2) ?? '—')},
                          {l:'Size',  v:t.size.toFixed(2)},
                          {l:'Pips',  v: t.exit != null ? Math.abs(t.exit - t.entry).toFixed(2) : '—'},
                        ].map((d,i)=>(
                          <GlassInset C={C} key={i} padding="p-2.5">
                            <div style={{color:C.tertiary,fontSize:9,fontFamily:FONT.text,fontWeight:600,letterSpacing:'0.3px',textTransform:'uppercase'}}>{d.l}</div>
                            <div style={{color:C.primary,fontSize:13,fontFamily:FONT.mono,fontWeight:600,marginTop:2,fontVariantNumeric:'tabular-nums'}}>{d.v}</div>
                          </GlassInset>
                        ))}
                      </div>

                      {/* Costi: Commission / Swap / Spread / Slippage */}
                      <GlassInset C={C} padding="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span style={{color:C.orange,fontSize:10,fontFamily:FONT.text,fontWeight:600,letterSpacing:'0.3px',textTransform:'uppercase'}}>Costi & Attriti</span>
                          <span style={{color:C.tertiary,fontSize:10,fontFamily:FONT.mono}}>
                            Tot {((t.commission||0)+(t.swap||0)+(t.spread||0)).toFixed(2)} $
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            {l:'Commission',v:t.commission||0},
                            {l:'Swap',v:t.swap||0},
                            {l:'Spread',v:t.spread||0},
                            {l:'Slippage',v:t.slippage||0},
                          ].map((d,i)=>(
                            <div key={i} style={{textAlign:'center',padding:'4px 0'}}>
                              <div style={{color:C.tertiary,fontSize:9,fontFamily:FONT.text,fontWeight:600,letterSpacing:'0.3px',textTransform:'uppercase'}}>{d.l}</div>
                              <div style={{color: d.v < 0 ? C.red : C.secondary, fontSize:12, fontFamily:FONT.mono, fontWeight:600, marginTop:2, fontVariantNumeric:'tabular-nums'}}>
                                {d.v < 0 ? '' : d.v > 0 ? '+' : ''}{d.v.toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </GlassInset>

                      {t.partials && t.partials.length > 0 && (
                        <GlassInset C={C} padding="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span style={{color:C.cyan,fontSize:10,fontFamily:FONT.text,fontWeight:600,letterSpacing:'0.3px',textTransform:'uppercase'}}>
                              Chiusure parziali · {t.partials.length}
                            </span>
                            <span style={{color:C.tertiary,fontSize:10,fontFamily:FONT.mono}}>
                              Σ {t.partials.reduce((s,p)=>s+p.size,0).toFixed(2)} lots
                            </span>
                          </div>
                          <div className="space-y-1">
                            {t.partials.map((p, i) => (
                              <div key={i} className="flex items-center justify-between" style={{padding:'6px 0',borderBottom:`0.5px solid ${C.sep}`}}>
                                <div className="flex items-center gap-2.5">
                                  <span style={{color:C.cyan,fontSize:10,fontFamily:FONT.mono,fontWeight:600,fontVariantNumeric:'tabular-nums',minWidth:38}}>{p.time}</span>
                                  <span style={{color:C.secondary,fontSize:11,fontFamily:FONT.mono,fontVariantNumeric:'tabular-nums'}}>{p.size.toFixed(2)} @ {p.exit.toFixed(2)}</span>
                                </div>
                                <span style={{color:p.pnl>=0?C.green:C.red,fontSize:11,fontFamily:FONT.mono,fontWeight:600,fontVariantNumeric:'tabular-nums'}}>
                                  {p.pnl>=0?'+':''}${p.pnl.toFixed(2)}
                                </span>
                              </div>
                            ))}
                            {t.open && (() => {
                              const closedLots = t.partials.reduce((s,p)=>s+p.size,0);
                              const residualLots = Math.max(t.size - closedLots, 0);
                              if (residualLots <= 0) return null;
                              return (
                                <div className="flex items-center justify-between" style={{padding:'6px 0'}}>
                                  <div className="flex items-center gap-2.5">
                                    <div className="flex items-center gap-1" style={{minWidth:38}}>
                                      <div className="xt-live-dot rounded-full" style={{background:C.orange,width:5,height:5}}/>
                                      <span style={{color:C.orange,fontSize:9,fontFamily:FONT.mono,fontWeight:700,letterSpacing:'0.4px'}}>LIVE</span>
                                    </div>
                                    <span style={{color:C.secondary,fontSize:11,fontFamily:FONT.mono,fontVariantNumeric:'tabular-nums'}}>
                                      {residualLots.toFixed(2)} @ {t.currentPrice?.toFixed(1) ?? '—'}
                                    </span>
                                  </div>
                                  <span style={{color:C.orange,fontSize:11,fontFamily:FONT.mono,fontWeight:600,fontVariantNumeric:'tabular-nums'}}>
                                    {t.pnl - t.partials.reduce((s,p)=>s+p.pnl,0) >= 0 ? '+' : ''}${(t.pnl - t.partials.reduce((s,p)=>s+p.pnl,0)).toFixed(2)}
                                  </span>
                                </div>
                              );
                            })()}
                          </div>
                        </GlassInset>
                      )}

                      <GlassInset C={C} padding="p-3">
                        <div className="flex items-center justify-between">
                          <span style={{color:C.secondary,fontSize:12,fontFamily:FONT.text,fontWeight:500}}>Confidence</span>
                          <ConfidenceRating C={C} value={confidence[t.id]} onChange={(n)=>setConfidence(prev=>({...prev,[t.id]:n}))}/>
                        </div>
                      </GlassInset>

                      {/* Confluenze multi-tag */}
                      <ConfluenceTagger C={C} tradeId={t.id} confluences={confluences} setConfluences={setConfluences}/>

                      {[
                        {key:'good',label:'Funzionato',color:C.green,ph:'Setup, decisione, gestione…'},
                        {key:'bad', label:'Errore',    color:C.red,  ph:'Cosa non doveva accadere…'},
                        {key:'next',label:'Lezione',   color:C.cyan, ph:'Cosa replicare o evitare…'},
                      ].map(f=>(
                        <div key={f.key}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-1 h-1 rounded-full" style={{background:f.color}}/>
                            <span style={{color:C.secondary,fontSize:10,fontFamily:FONT.text,fontWeight:600,letterSpacing:'0.2px',textTransform:'uppercase'}}>{f.label}</span>
                          </div>
                          <textarea rows={2} value={tradeNotes[f.key]||''}
                            onChange={(e)=>updateNote(t.id, f.key, e.target.value)}
                            placeholder={f.ph}
                            className="w-full p-3 resize-none focus:outline-none transition"
                            style={{
                              background: C.glass2, backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
                              border:`0.5px solid ${C.sep}`, borderRadius:RADIUS.inset,
                              color:C.primary, fontSize:12, fontFamily:FONT.text,
                            }}
                            onFocus={(e)=>e.target.style.borderColor=`${f.color}50`}
                            onBlur={(e)=>e.target.style.borderColor=C.sep}/>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Glass>

      {/* ── PROTEZIONI GIORNALIERE ── */}
      <ProtezioniCard C={C} dayPnLPct={dayPnLPct} weeklyPnLPct={weeklyPnLPct} consecLoss={consecLoss}/>
      <Glass C={C}>
        <SectionHeader C={C} action={
          savedFlash && (
            <span style={{color:C.green,fontSize:11,fontFamily:FONT.text,fontWeight:600,display:'flex',alignItems:'center',gap:4,opacity:savedFlash?1:0,transition:'opacity 0.3s'}}>
              <Check size={11} strokeWidth={3}/> Salvato
            </span>
          )
        }>Riflessione del giorno</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {key:'good',     label:'Cosa ha funzionato', color:C.green, ph:'Pattern e decisioni complessive…'},
            {key:'errors',   label:'Errori commessi',    color:C.red,   ph:'Violazioni regole, FOMO, revenge…'},
            {key:'tomorrow', label:'Domani',             color:C.cyan,  ph:'3 azioni concrete per domani…'},
          ].map((f,i)=>(
            <div key={i}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{background:f.color}}/>
                <span style={{color:C.secondary,fontSize:12,fontFamily:FONT.text,fontWeight:600,letterSpacing:'-0.08px'}}>{f.label}</span>
              </div>
              <textarea rows={3} value={dayReflection[f.key]||''}
                onChange={(e)=>setDayReflection(prev=>({...prev,[f.key]:e.target.value}))}
                placeholder={f.ph}
                className="w-full p-3 resize-none focus:outline-none transition"
                style={{
                  background: C.glass2, backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
                  border:`0.5px solid ${C.sep}`, borderRadius:RADIUS.inset,
                  color:C.primary, fontSize:13, fontFamily:FONT.text,
                }}
                onFocus={(e)=>e.target.style.borderColor=`${f.color}50`}
                onBlur={(e)=>e.target.style.borderColor=C.sep}/>
            </div>
          ))}
        </div>
      </Glass>

      {/* Costi & Attriti — in evidenza */}
      {(() => {
        const closed = today.filter(t=>!t.open);
        const totSpread = closed.reduce((s,t)=>s+(t.spread||0),0);
        const totComm   = closed.reduce((s,t)=>s+(t.commission||0),0);
        const totSwap   = closed.reduce((s,t)=>s+(t.swap||0),0);
        const totSlip   = closed.reduce((s,t)=>s+(t.slippage||0),0);
        const totCost   = totSpread+totComm+totSwap+totSlip;
        const cpTrade   = closed.length ? totCost/closed.length : 0;
        const pnlTot    = closed.reduce((s,t)=>s+t.pnl,0);
        const costPct   = pnlTot !== 0 ? Math.abs(totCost/pnlTot)*100 : 0;
        if (closed.length === 0) return null;
        return (
          <Glass C={C} padding="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full" style={{background:C.orange}}/>
                <span style={{color:C.primary,fontSize:15,fontFamily:FONT.display,fontWeight:700,letterSpacing:'-0.3px'}}>Costi & Attriti</span>
              </div>
              <span style={{color:C.red,fontSize:13,fontFamily:FONT.mono,fontWeight:700}}>−${Math.abs(totCost).toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                {l:'Spread',       v:totSpread},
                {l:'Commissioni',  v:totComm},
                {l:'Swap',         v:totSwap},
                {l:'Slippage',     v:totSlip},
              ].map((d,i)=>(
                <GlassInset C={C} key={i} padding="p-2.5">
                  <div style={{color:C.tertiary,fontSize:9,fontFamily:FONT.text,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.3px'}}>{d.l}</div>
                  <div style={{color:C.red,fontSize:13,fontFamily:FONT.mono,fontWeight:700,marginTop:2,fontVariantNumeric:'tabular-nums'}}>
                    {d.v.toFixed(2)}$
                  </div>
                </GlassInset>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-2.5">
              <span style={{color:C.tertiary,fontSize:10,fontFamily:FONT.text}}>Costo/trade</span>
              <span style={{color:C.orange,fontSize:11,fontFamily:FONT.mono,fontWeight:600}}>{cpTrade.toFixed(2)}$</span>
              <span style={{color:C.tertiary,fontSize:10,fontFamily:FONT.text,marginLeft:4}}>Incidenza su P&L</span>
              <span style={{color:C.yellow,fontSize:11,fontFamily:FONT.mono,fontWeight:600}}>{costPct.toFixed(1)}%</span>
            </div>
          </Glass>
        );
      })()}

    </div>
  );
};

/* ============= EQUITY CHART CARD (standalone, con state propri) ============= */
const EquityChartCard = ({ C, equity }) => {
  const equityCurve = equity && equity.length > 0 ? equity : [{day:'Dep.',value:10000}];
  const equityFull = equityCurve.map(d=>({...d,projection:null}));
  const [equityRange, setEquityRange] = usePersistedState('xt_equity_range', '1W');
  const [showProjection, setShowProjection] = usePersistedState('xt_show_proj', false);
  const [showCalPicker, setShowCalPicker] = useState(false);
  const [calPickerMonth, setCalPickerMonth] = useState(4);
  const [customRange, setCustomRange] = useState(null);

  const equityRangeData = useMemo(() => {
    const n = equityCurve.length;
    if (n === 0) return [{day:'—',value:10000,projection:null}];
    const last = equityCurve[n-1].value;
    if (equityRange === '1D') {
      const prev = n > 1 ? equityCurve[n-2].value : last;
      return Array.from({length:24},(_,h)=>({
        day: `${String(h).padStart(2,'0')}:00`,
        value: n >= 2 ? Math.round(prev + (last-prev) * (h/23)) : last,
        projection: null,
      }));
    }
    if (equityRange === '1M') return equityCurve.slice(-31).map(d=>({...d,projection:null}));
    if (equityRange === 'ALL') {
      if (showProjection) {
        const g = n > 1 ? (last - equityCurve[0].value) / Math.max(n-1,1) : 0;
        const proj = Array.from({length:30},(_,i)=>({day:`+${i+1}g`,value:null,projection:Math.round(last+g*(i+1))}));
        return [...equityCurve.map(d=>({...d,projection:null})),{...equityCurve[n-1],projection:last},...proj];
      }
      return equityCurve.map(d=>({...d,projection:null}));
    }
    return equityCurve.slice(-8).map(d=>({...d,projection:null}));
  }, [equityRange, showProjection, equityCurve]);

  const BALANCE_NOW = equityCurve[equityCurve.length-1]?.value || 10000;
  const BALANCE_INIT = equityCurve[0]?.value || 10000;

  return (
    <Glass C={C}>
      {/* Header row: titolo + toggle proiezione + range + calendario */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <span style={{fontFamily:FONT.display,fontSize:17,fontWeight:700,letterSpacing:'-0.3px',color:C.primary}}>Equity</span>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={()=>setShowProjection(!showProjection)} className="xt-btn flex items-center gap-1.5 px-2.5 py-1" style={{
            background: showProjection ? `${C.purple}22` : C.glass2,
            border: `0.5px solid ${showProjection ? C.purple : C.sep}`,
            borderRadius: RADIUS.pill, cursor:'pointer',
          }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 5l7 7-7 7" stroke={showProjection ? C.purple : C.tertiary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{color: showProjection ? C.purple : C.tertiary, fontSize:10, fontFamily:FONT.text, fontWeight:600}}>Proiezione</span>
          </button>
          <SegmentedControl C={C} options={['1D','1W','1M','ALL']} value={equityRange} onChange={v=>{setEquityRange(v);setCustomRange(null);}}/>
          <button onClick={()=>setShowCalPicker(!showCalPicker)} className="xt-btn" style={{
            width:28,height:28,borderRadius:8,
            background: customRange ? `${C.cyan}22` : C.glass2,
            border:`0.5px solid ${customRange ? C.cyan : C.sep}`,
            cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="16" rx="2.5" stroke={customRange ? C.cyan : C.tertiary} strokeWidth="1.8"/>
              <path d="M3 9h18M8 3v4M16 3v4" stroke={customRange ? C.cyan : C.tertiary} strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mini calendar picker */}
      {showCalPicker && (
        <GlassInset C={C} className="mb-3" padding="p-3">
          {(() => {
            const MONTHS = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
            const DAYS_IN = [31,28,31,30,31,30,31,31,30,31,30,31];
            const month = calPickerMonth;
            const year  = 2026;
            const daysInMonth = DAYS_IN[month];
            const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;
            const totalCells = Math.ceil((firstDow + daysInMonth) / 7) * 7;
            const toKey = (m, d) => `${year}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const fromKey = customRange?.from;
            const toKeyEnd = customRange?.to;
            return (
              <>
                <div className="flex items-center justify-between mb-2">
                  <button onClick={()=>setCalPickerMonth(m=>Math.max(0,m-1))} style={{background:'none',border:'none',cursor:'pointer',padding:'2px 6px',color:C.tertiary,fontSize:16}}>‹</button>
                  <span style={{color:C.primary,fontSize:12,fontFamily:FONT.text,fontWeight:700}}>{MONTHS[month]} {year}</span>
                  <button onClick={()=>setCalPickerMonth(m=>Math.min(11,m+1))} style={{background:'none',border:'none',cursor:'pointer',padding:'2px 6px',color:C.tertiary,fontSize:16}}>›</button>
                  <button onClick={()=>setShowCalPicker(false)} style={{background:'none',border:'none',cursor:'pointer',padding:2,marginLeft:4}}>
                    <X size={12} style={{color:C.tertiary}}/>
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-0.5" style={{marginBottom:4}}>
                  {['L','M','M','G','V','S','D'].map((d,i)=>(
                    <div key={i} style={{color:C.tertiary,fontSize:9,fontFamily:FONT.mono,textAlign:'center',padding:'2px 0'}}>{d}</div>
                  ))}
                  {Array.from({length:totalCells},(_,i)=>{
                    const dayNum = i - firstDow + 1;
                    if (dayNum < 1 || dayNum > daysInMonth) return <div key={i}/>;
                    const key = toKey(month, dayNum);
                    const isFrom = key === fromKey;
                    const isTo   = key === toKeyEnd;
                    const inRange = fromKey && toKeyEnd && key > fromKey && key < toKeyEnd;
                    const isEdge  = isFrom || isTo;
                    return (
                      <button key={i} onClick={()=>{
                        if (!customRange || customRange.to) {
                          setCustomRange({from:key, to:null});
                        } else {
                          const sorted = [customRange.from, key].sort();
                          setCustomRange({from:sorted[0], to:sorted[1]});
                          setShowCalPicker(false);
                        }
                      }} style={{
                        width:'100%',aspectRatio:'1',borderRadius:6,border:'none',cursor:'pointer',
                        background: isEdge ? C.cyan : inRange ? `${C.cyan}22` : 'transparent',
                        color: isEdge ? C.bg : inRange ? C.cyan : C.secondary,
                        fontSize:10,fontFamily:FONT.mono,fontWeight:isEdge?700:400,
                      }}>{dayNum}</button>
                    );
                  })}
                </div>
                {customRange && !customRange.to && (
                  <div style={{color:C.tertiary,fontSize:10,fontFamily:FONT.text,marginTop:4,textAlign:'center'}}>Tocca la data di fine</div>
                )}
                {customRange?.from && customRange?.to && (
                  <div className="flex items-center justify-between mt-2">
                    <span style={{color:C.cyan,fontSize:11,fontFamily:FONT.mono,fontWeight:600}}>
                      {customRange.from} → {customRange.to}
                    </span>
                    <button onClick={()=>setCustomRange(null)} style={{
                      background:'none',border:`0.5px solid ${C.sep}`,borderRadius:6,padding:'2px 8px',
                      color:C.tertiary,fontSize:10,fontFamily:FONT.text,cursor:'pointer',
                    }}>Reset</button>
                  </div>
                )}
              </>
            );
          })()}
        </GlassInset>
      )}

      {/* Equity corrente */}
      <div className="flex items-end justify-between mb-3 px-1">
        <div>
          <div style={{color:C.tertiary, fontSize:9, fontFamily:FONT.text, fontWeight:600, letterSpacing:'0.4px', textTransform:'uppercase', marginBottom:4}}>Equity</div>
          <div style={{fontFamily:FONT.display, fontSize:36, fontWeight:700, letterSpacing:'-1px', lineHeight:1, color:C.green, fontVariantNumeric:'tabular-nums', ...neonText(C.green, C.scheme)}}>
            ${BALANCE_NOW.toFixed(2)}
          </div>
        </div>
        <div className="text-right pb-1">
          <div style={{color:C.green, fontSize:14, fontFamily:FONT.mono, fontWeight:600, fontVariantNumeric:'tabular-nums'}}>
            +${(BALANCE_NOW - BALANCE_INIT).toFixed(2)}
          </div>
          <div style={{color:C.green, fontSize:11, fontFamily:FONT.mono, fontWeight:500, opacity:0.75}}>
            +{((BALANCE_NOW - BALANCE_INIT)/BALANCE_INIT*100).toFixed(2)}%
          </div>
        </div>
      </div>

      <DragChart C={C} data={equityRangeData} height={260} labelKey="day" valueKey="value" valuePrefix="$" valueColor={C.green}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={equityRangeData} margin={{top:5,right:5,left:-10,bottom:0}}>
            <CartesianGrid stroke={C.sep} vertical={false}/>
            <XAxis dataKey="day" tick={{fill:C.tertiary,fontSize:10,fontFamily:FONT.mono}} axisLine={false} tickLine={false} dy={8} interval="preserveStartEnd"/>
            <YAxis tick={{fill:C.tertiary,fontSize:11,fontFamily:FONT.mono}} axisLine={false} tickLine={false} domain={['dataMin - 50','dataMax + 50']}/>
            <ReferenceLine
              y={equityRangeData[equityRangeData.length - 1]?.value}
              stroke={C.green} strokeWidth={1} strokeDasharray="3 4" strokeOpacity={0.45}
            />
            <Line type="monotone" dataKey="value" stroke={C.green} strokeWidth={1.75} dot={false} connectNulls={false} isAnimationActive={false}/>
            {showProjection && equityRange === 'ALL' && (
              <Line type="monotone" dataKey="projection" stroke={C.purple} strokeWidth={1.5} strokeDasharray="4 4" dot={false} connectNulls={false} isAnimationActive={false}/>
            )}
          </LineChart>
        </ResponsiveContainer>
      </DragChart>
      {showProjection && equityRange === 'ALL' && (
        <div style={{color:C.tertiary,fontSize:10,fontFamily:FONT.text,marginTop:6,textAlign:'center'}}>
          Proiezione · <span style={{color:C.purple,fontFamily:FONT.mono}}>+$56/giorno</span> stimati · attiva solo in vista ALL
        </div>
      )}
    </Glass>
  );
};

/* ============= TEMPORAL ============= */


// buildCalData usa i trade reali passati come parametro
const buildCalData = (year, month, tradesByDate = {}) => {
  const DAYS_IN = [31,28+(year%4===0&&(year%100!==0||year%400===0)?1:0),31,30,31,30,31,31,30,31,30,31];
  const daysInMonth = DAYS_IN[month];
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // 0=Lun
  const totalCells = Math.ceil((firstDow + daysInMonth) / 7) * 7;
  const key = `${year}-${String(month+1).padStart(2,'0')}`;
  

  return Array.from({length: totalCells}, (_, i) => {
    const dayNum = i - firstDow + 1;
    if (dayNum < 1 || dayNum > daysInMonth) return { day: null, pnl: 0, trades: [], openCount: 0, tradeCount: 0, closedCount: 0 };
    const dateKey = `${year}-${String(month+1).padStart(2,'0')}-${String(dayNum).padStart(2,'0')}`;
    const dayTrades = tradesByDate[dateKey] || [];
    const closedTrades = dayTrades.filter(t=>!t.open);
    const pnl = dayTrades.length > 0
      ? closedTrades.reduce((s,t)=>s+t.pnl, 0)
      : 0;
    const openTrades = dayTrades.filter(t=>t.open);
    return {
      day: dayNum, dateKey, pnl,
      trades: dayTrades,
      openCount: openTrades.length,
      tradeCount: dayTrades.length || (pnl !== 0 ? 1 : 0),
      closedCount: dayTrades.filter(t=>!t.open).length,
    };
  });
};

const MONTHS_IT = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];

// Componente riga trade singolo nel pannello giorno
const DayTradePill = ({ C, t, balance = 10510 }) => {
  const grade = tradeGrade(t.rr || 0, C);
  const pnlPct = (t.pnl / balance * 100);
  const isOpen = t.open;
  const dirColor = t.dir === 'LONG' ? C.green : C.red;

  return (
    <div className={isOpen ? 'xt-open-trade' : ''} style={{
      background: isOpen
        ? `linear-gradient(135deg, ${C.orange}14, ${C.orange}08)`
        : t.pnl >= 0 ? `${C.green}0A` : `${C.red}0A`,
      border: isOpen
        ? `1px dashed ${C.orange}60`
        : `0.5px solid ${t.pnl >= 0 ? C.green+'28' : C.red+'28'}`,
      borderRadius: 14,
      padding: '10px 12px',
      marginBottom: 6,
    }}>
      <div className="flex items-center justify-between">
        {/* Left: dir badge + basket + session */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Dir pill */}
          <div style={{
            padding:'2px 7px', borderRadius: 6,
            background: `${dirColor}22`,
            border: `0.5px solid ${dirColor}50`,
            fontSize: 10, fontFamily: FONT.mono, fontWeight: 700,
            color: dirColor, letterSpacing: '0.3px',
          }}>{t.dir}</div>
          <span style={{color:C.secondary,fontSize:12,fontFamily:FONT.text,fontWeight:500}}>{t.basket}</span>
          <span style={{color:C.tertiary,fontSize:10,fontFamily:FONT.mono}}>{t.session}</span>
          {isOpen && (
            <div className="flex items-center gap-1" style={{
              padding:'2px 7px', borderRadius:6,
              background:`${C.orange}22`, border:`0.5px solid ${C.orange}55`,
            }}>
              <div className="xt-live-dot w-1 h-1 rounded-full" style={{background:C.orange, width:5, height:5}}/>
              <span style={{color:C.orange,fontSize:9,fontFamily:FONT.mono,fontWeight:700,letterSpacing:'0.4px'}}>LIVE</span>
            </div>
          )}
        </div>
        {/* Right: P&L + % */}
        <div className="text-right">
          <div style={{
            color: t.pnl >= 0 ? C.green : C.red,
            fontSize: 13, fontFamily: FONT.mono, fontWeight: 700,
            fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.2px',
          }}>
            {t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)}
          </div>
          <div style={{
            color: t.pnl >= 0 ? C.green : C.red,
            fontSize: 10, fontFamily: FONT.mono, fontWeight: 600,
            opacity: 0.72, fontVariantNumeric: 'tabular-nums',
          }}>
            {pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Second row: entry / exit (or current) / size / R:R / grade */}
      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
        <span style={{color:C.tertiary,fontSize:10,fontFamily:FONT.mono}}>
          E: <span style={{color:C.secondary}}>{t.entry.toFixed(1)}</span>
        </span>
        {isOpen ? (
          <span style={{color:C.tertiary,fontSize:10,fontFamily:FONT.mono}}>
            Now: <span style={{color:C.orange,fontWeight:600}}>{t.currentPrice?.toFixed(1)}</span>
          </span>
        ) : (
          <span style={{color:C.tertiary,fontSize:10,fontFamily:FONT.mono}}>
            X: <span style={{color:C.secondary}}>{t.exit?.toFixed(1)}</span>
          </span>
        )}
        <span style={{color:C.tertiary,fontSize:10,fontFamily:FONT.mono}}>
          {t.size.toFixed(2)}L
        </span>
        {!isOpen && t.rr > 0 && (
          <span style={{color:C.tertiary,fontSize:10,fontFamily:FONT.mono}}>
            <span style={{color:grade.color,fontWeight:700}}>{(t.rr??0).toFixed(1)}R</span>
          </span>
        )}
        {!isOpen && t.closed && (
          <div style={{
            padding:'1.5px 6px', borderRadius:5,
            background: t.closed==='TP'?`${C.green}22`:t.closed==='SL'?`${C.red}22`:`${C.yellow}22`,
            border: `0.5px solid ${t.closed==='TP'?C.green+'44':t.closed==='SL'?C.red+'44':C.yellow+'44'}`,
            fontSize:9, fontFamily:FONT.mono, fontWeight:700,
            color: t.closed==='TP'?C.green:t.closed==='SL'?C.red:C.yellow,
            letterSpacing:'0.3px',
          }}>{t.closed}</div>
        )}
        {t.tags?.map(tag=>(
          <Tag key={tag} color={tag==='A+'?C.green:tag==='FOMO'?C.red:C.purple} size="sm">{tag}</Tag>
        ))}
      </div>
    </div>
  );
};

const TemporalView = ({ C, trades, equity }) => {
  const allTrades = trades || [];
  const equityCurve = equity && equity.length > 0 ? equity : [{day:'Dep.',value:10000}];
  const today = new Date();
  const [calYear,  setCalYear]  = useState(2026);
  const [calMonth, setCalMonth] = useState(4); // 0-based, 4=Maggio

  const tradesByDate = useMemo(() => allTrades.reduce((acc,t) => { if(!acc[t.date])acc[t.date]=[]; acc[t.date].push(t); return acc; }, {}), [allTrades]);
  const calData = useMemo(() => buildCalData(calYear, calMonth, tradesByDate), [calYear, calMonth, tradesByDate]);

  const [period, setPeriod] = useState('Mese');
  const [selectedDay, setSelectedDay] = useState(null);

  const maxAbsPnl = useMemo(() => Math.max(...calData.map(c=>Math.abs(c.pnl)).filter(v=>v>0), 1), [calData]);

  const handlePeriodChange = (p) => { setPeriod(p); setSelectedDay(null); window.scrollTo({ top: 0, behavior: 'instant' }); };

  // Naviga mese prev/next
  const prevMonth = () => {
    setSelectedDay(null);
    if (calMonth === 0) { setCalYear(y=>y-1); setCalMonth(11); }
    else setCalMonth(m=>m-1);
  };
  const nextMonth = () => {
    setSelectedDay(null);
    if (calMonth === 11) { setCalYear(y=>y+1); setCalMonth(0); }
    else setCalMonth(m=>m+1);
  };
  // Naviga anno
  const prevYear = () => { setCalYear(y=>y-1); setSelectedDay(null); };
  const nextYear = () => { setCalYear(y=>y+1); setSelectedDay(null); };

  // Riepilogo mese corrente nel calendario
  const calSummary = useMemo(() => {
    const active = calData.filter(c=>c.day !== null);
    const pnl = active.reduce((s,c)=>s+c.pnl, 0);
    const trades = active.reduce((s,c)=>s+c.tradeCount, 0);
    const wins = active.filter(c=>c.pnl>0).length;
    const wr = active.filter(c=>c.pnl!==0).length > 0
      ? Math.round(wins / active.filter(c=>c.pnl!==0).length * 100) : 0;
    const openCount = active.reduce((s,c)=>s+(c.openCount||0),0);
    return { pnl, trades, wr, openCount };
  }, [calData]);

  const periodSummary = useMemo(() => {
    let pnl = 0, trades = 0, wins = 0, label = '', openCount = 0;
    if (period === 'Giorno' && selectedDay) {
      pnl = selectedDay.pnl; trades = selectedDay.tradeCount || (selectedDay.pnl !== 0 ? 1 : 0);
      wins = selectedDay.pnl > 0 ? 1 : 0;
      openCount = selectedDay.openCount || 0;
      label = `${String(selectedDay.day).padStart(2,'0')}/${String(calMonth+1).padStart(2,'0')}/${calYear}`;
    } else if (period === 'Settimana') {
      const active = calData.filter(c=>c.day!==null);
      const week = active.slice(0, 5);
      pnl = week.reduce((s,d)=>s+d.pnl, 0);
      trades = week.reduce((s,d)=>s+d.tradeCount, 0);
      wins = week.filter(d=>d.pnl>0).length;
      openCount = week.reduce((s,d)=>s+(d.openCount||0),0);
      label = 'Settimana corrente';
    } else if (period === 'Mese') {
      pnl = calSummary.pnl; trades = calSummary.trades; openCount = calSummary.openCount;
      wins = calData.filter(c=>c.day!==null&&c.pnl>0).length;
      label = `${MONTHS_IT[calMonth]} ${calYear}`;
    } else if (period === 'Anno') {
      pnl = 2310.00; trades = 104; wins = 67; label = `${calYear} YTD`;
    } else if (period === 'Tutto') {
      pnl = 2310.00; trades = 104; wins = 67; label = 'Cumulativo';
    }
    const wr = trades > 0 ? Math.round(wins/trades*100) : 0;
    return { pnl, trades, wins, wr, label, openCount };
  }, [period, selectedDay, calData, calSummary, calMonth, calYear]);

  // % profit mensile su balance iniziale (10000)
  const BALANCE_INIT = equityCurve[0]?.value || 10000;
  const calPct = (calSummary.pnl / BALANCE_INIT * 100);

  const selectedTrades = useMemo(() => selectedDay?.trades || [], [selectedDay]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3 px-1">
        <h1 style={{fontFamily:FONT.display,fontSize:28,fontWeight:700,letterSpacing:'-0.6px',color:C.primary, ...neonText(C.primary, C.scheme)}}>Storico</h1>
        <SegmentedControl C={C} options={['Giorno','Settimana','Mese','Anno','Tutto']} value={period} onChange={handlePeriodChange}/>
      </div>

      {/* Period summary */}
      <Glass C={C} padding="p-5">
        <Eyebrow C={C}>{periodSummary.label} · totale</Eyebrow>
        <div className="flex items-baseline justify-between flex-wrap gap-4">
          <div style={{fontFamily:FONT.display,fontSize:42,fontWeight:700,letterSpacing:'-1px',lineHeight:1,color:periodSummary.pnl>0?C.green:periodSummary.pnl<0?C.red:C.secondary,fontVariantNumeric:'tabular-nums', ...neonText(periodSummary.pnl>0?C.green:periodSummary.pnl<0?C.red:C.secondary, C.scheme)}}>
            {periodSummary.pnl>0?'+':''}${periodSummary.pnl.toFixed(2)}
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <div style={{color:C.tertiary,fontSize:10,fontFamily:FONT.text,fontWeight:600,letterSpacing:'0.3px',textTransform:'uppercase'}}>Trades</div>
              <div style={{color:C.primary,fontSize:18,fontFamily:FONT.mono,fontWeight:600,marginTop:2,fontVariantNumeric:'tabular-nums'}}>{periodSummary.trades}</div>
            </div>
            <div>
              <div style={{color:C.tertiary,fontSize:10,fontFamily:FONT.text,fontWeight:600,letterSpacing:'0.3px',textTransform:'uppercase'}}>Win Rate</div>
              <div style={{color:periodSummary.wr>=60?C.green:periodSummary.wr>=40?C.yellow:C.red,fontSize:18,fontFamily:FONT.mono,fontWeight:600,marginTop:2,fontVariantNumeric:'tabular-nums'}}>{periodSummary.wr}%</div>
            </div>
            <div>
              <div style={{color:C.tertiary,fontSize:10,fontFamily:FONT.text,fontWeight:600,letterSpacing:'0.3px',textTransform:'uppercase'}}>Avg/Trade</div>
              <div style={{color:periodSummary.trades>0&&periodSummary.pnl/periodSummary.trades>0?C.green:C.red,fontSize:18,fontFamily:FONT.mono,fontWeight:600,marginTop:2,fontVariantNumeric:'tabular-nums'}}>
                {periodSummary.trades>0?`${(periodSummary.pnl/periodSummary.trades).toFixed(2)}`:'—'}
              </div>
            </div>
            {periodSummary.openCount > 0 && (
              <div>
                <div style={{color:C.tertiary,fontSize:10,fontFamily:FONT.text,fontWeight:600,letterSpacing:'0.3px',textTransform:'uppercase'}}>Aperti</div>
                <div className="flex items-center gap-1 mt-2">
                  <div className="xt-live-dot rounded-full" style={{background:C.orange,width:6,height:6}}/>
                  <div style={{color:C.orange,fontSize:18,fontFamily:FONT.mono,fontWeight:700,fontVariantNumeric:'tabular-nums'}}>{periodSummary.openCount}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Glass>

      {/* ── EQUITY COMPLETA ── */}
      <EquityChartCard C={C} equity={equityCurve}/>

      {/* ── CALENDARIO NAVIGABILE ── */}
      <Glass C={C}>
        {/* Header calendario con navigazione mese + anno */}
        <div className="flex items-center justify-between mb-3">
          <span style={{fontFamily:FONT.display,fontSize:17,fontWeight:700,letterSpacing:'-0.3px',color:C.primary}}>Calendario</span>
          <div className="flex items-center gap-1">
            {/* Legenda */}
            <div className="flex items-center gap-2 mr-2">
              <div className="flex items-center gap-1">
                <div style={{width:7,height:7,borderRadius:2,background:C.green,opacity:0.7}}/>
                <span style={{color:C.tertiary,fontSize:9,fontFamily:FONT.mono}}>W</span>
              </div>
              <div className="flex items-center gap-1">
                <div style={{width:7,height:7,borderRadius:2,background:C.red,opacity:0.7}}/>
                <span style={{color:C.tertiary,fontSize:9,fontFamily:FONT.mono}}>L</span>
              </div>
              <div className="flex items-center gap-1">
                <div style={{width:7,height:7,borderRadius:2,background:C.orange,border:`1px dashed ${C.orange}`,opacity:0.8}}/>
                <span style={{color:C.tertiary,fontSize:9,fontFamily:FONT.mono}}>Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Anno navigator */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <button onClick={prevYear} className="xt-btn" style={{background:C.glass2,border:`0.5px solid ${C.sep}`,borderRadius:8,padding:'4px 10px',cursor:'pointer',color:C.secondary,fontSize:14,lineHeight:1}}>‹‹</button>
          <span style={{color:C.primary,fontSize:15,fontFamily:FONT.display,fontWeight:700,minWidth:44,textAlign:'center'}}>{calYear}</span>
          <button onClick={nextYear} className="xt-btn" style={{background:C.glass2,border:`0.5px solid ${C.sep}`,borderRadius:8,padding:'4px 10px',cursor:'pointer',color:C.secondary,fontSize:14,lineHeight:1}}>››</button>
        </div>

        {/* Mese navigator */}
        <div className="flex items-center justify-between mb-3" style={{background:C.glass2,borderRadius:14,padding:'6px 10px',border:`0.5px solid ${C.sep}`}}>
          <button onClick={prevMonth} className="xt-btn" style={{background:'none',border:'none',cursor:'pointer',padding:'4px 8px',color:C.secondary,fontSize:18,lineHeight:1}}>‹</button>
          <div className="text-center">
            <div style={{color:C.primary,fontSize:14,fontFamily:FONT.display,fontWeight:700,letterSpacing:'-0.2px'}}>{MONTHS_IT[calMonth]}</div>
            <div className="flex items-center justify-center gap-3 mt-0.5">
              <span style={{color:calSummary.pnl>=0?C.green:C.red,fontSize:11,fontFamily:FONT.mono,fontWeight:700,fontVariantNumeric:'tabular-nums'}}>
                {calSummary.pnl>=0?'+':''}${calSummary.pnl.toFixed(0)}
              </span>
              <span style={{color:calSummary.pnl>=0?C.green:C.red,fontSize:11,fontFamily:FONT.mono,fontWeight:700,fontVariantNumeric:'tabular-nums'}}>
                {calPct>=0?'+':''}{calPct.toFixed(2)}%
              </span>
              <span style={{color:C.tertiary,fontSize:10,fontFamily:FONT.mono}}>{calSummary.trades}T · {calSummary.wr}%WR</span>
            </div>
          </div>
          <button onClick={nextMonth} className="xt-btn" style={{background:'none',border:'none',cursor:'pointer',padding:'4px 8px',color:C.secondary,fontSize:18,lineHeight:1}}>›</button>
        </div>

        {/* Griglia giorni settimana */}
        <div className="grid grid-cols-7 gap-1.5">
          {['L','M','M','G','V','S','D'].map((d,i)=>(
            <div key={i} style={{color:C.tertiary,fontSize:10,fontFamily:FONT.text,fontWeight:600,textAlign:'center',paddingBottom:6,letterSpacing:'0.2px'}}>{d}</div>
          ))}
          {calData.map((c,i)=>{
            if (c.day === null) return <div key={i}/>;
            const positive = c.pnl>0, negative = c.pnl<0;
            const isSelected = selectedDay?.day === c.day && selectedDay?.dateKey === c.dateKey;
            const hasOpen = c.openCount > 0;
            const baseColor = positive ? C.green : negative ? C.red : null;
            const intensity = c.pnl !== 0 ? Math.min(Math.abs(c.pnl)/maxAbsPnl, 1) : 0;
            const bgAlphaHex = c.pnl!==0 ? Math.round(8+intensity*22).toString(16).padStart(2,'0') : '00';
            const bdAlphaHex = c.pnl!==0 ? Math.round(20+intensity*35).toString(16).padStart(2,'0') : '00';

            return (
              <div key={i}
                onClick={()=>{if(c.pnl!==0||hasOpen){haptic.light();setSelectedDay(isSelected?null:c);}}}
                className={`flex flex-col justify-between relative xt-cal-cell ${hasOpen?'xt-cal-open':''} ${(c.pnl!==0||hasOpen)?'':''}`.trim()}
                style={{
                  aspectRatio:'1',
                  background: hasOpen?`linear-gradient(135deg,${C.orange}14,${C.orange}08)`:c.pnl!==0?`${baseColor}${bgAlphaHex}`:C.glass2,
                  backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)',
                  border: hasOpen?`1px dashed ${C.orange}55`:isSelected?`1px solid ${baseColor}`:c.pnl!==0?`0.5px solid ${baseColor}${bdAlphaHex}`:`0.5px solid ${C.sep}`,
                  borderRadius:14,
                  cursor:(c.pnl!==0||hasOpen)?'pointer':'default',
                  transform:isSelected?'scale(1.06)':'scale(1)',
                  transition:'transform 0.18s cubic-bezier(0.34,1.18,0.64,1)',
                  padding:'6px 6px 5px',
                  overflow:'hidden',
                }}>
                <div className="flex items-center justify-between">
                  <span style={{color:hasOpen?C.orange:c.pnl!==0?baseColor:C.tertiary,fontSize:14,fontFamily:FONT.text,fontWeight:700,lineHeight:1}}>{c.day}</span>
                  {hasOpen&&<div className="xt-live-dot rounded-full" style={{background:C.orange,width:6,height:6}}/>}
                  {!hasOpen&&c.tradeCount>0&&<div style={{fontSize:8,fontFamily:FONT.mono,fontWeight:700,color:baseColor,background:`${baseColor}20`,borderRadius:3,padding:'1px 4px',lineHeight:1}}>{c.tradeCount}</div>}
                </div>
                {c.pnl!==0&&(
                  <span style={{color:hasOpen?C.orange:baseColor,fontSize:11,fontFamily:FONT.mono,fontWeight:700,fontVariantNumeric:'tabular-nums',lineHeight:1,textAlign:'right',alignSelf:'flex-end',letterSpacing:'-0.5px'}}>
                    {c.pnl>0?'+':''}{c.pnl.toFixed(0)}
                  </span>
                )}
                {c.pnl!==0&&<div style={{position:'absolute',bottom:0,left:0,right:0,height:2,borderRadius:'0 0 11px 11px',background:`${hasOpen?C.orange:baseColor}`,opacity:0.35+intensity*0.55,width:`${Math.round(30+intensity*70)}%`}}/>}
                {isSelected&&<div className="xt-shimmer-overlay absolute inset-0"/>}
              </div>
            );
          })}
        </div>

        {/* ── PANNELLO GIORNO ESPANSO ── */}
        {selectedDay !== null && (
          <div className="mt-4">
            <div style={{
              background:selectedDay.openCount>0?`${C.orange}10`:selectedDay.pnl>=0?`${C.green}0C`:`${C.red}0C`,
              border:selectedDay.openCount>0?`1px dashed ${C.orange}50`:`0.5px solid ${selectedDay.pnl>=0?C.green+'30':C.red+'30'}`,
              borderRadius:18, padding:'12px 16px', marginBottom:10,
            }}>
              <div className="flex items-center justify-between">
                <div>
                  <div style={{color:C.tertiary,fontSize:9,fontFamily:FONT.text,fontWeight:600,letterSpacing:'0.4px',textTransform:'uppercase',marginBottom:3}}>
                    {String(selectedDay.day).padStart(2,'0')}/{String(calMonth+1).padStart(2,'0')}/{calYear}
                  </div>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <div style={{color:selectedDay.pnl>0?C.green:selectedDay.pnl<0?C.red:C.secondary,fontSize:26,fontFamily:FONT.display,fontWeight:700,letterSpacing:'-0.6px',fontVariantNumeric:'tabular-nums', ...neonText(selectedDay.pnl>0?C.green:selectedDay.pnl<0?C.red:C.secondary, C.scheme)}}>
                      {selectedDay.pnl>0?'+':''}${selectedDay.pnl.toFixed(2)}
                    </div>
                    <div style={{color:selectedDay.pnl>0?C.green:selectedDay.pnl<0?C.red:C.secondary,fontSize:14,fontFamily:FONT.mono,fontWeight:600,opacity:0.8,fontVariantNumeric:'tabular-nums'}}>
                      {(selectedDay.pnl/10510*100>=0?'+':'')}{(selectedDay.pnl/10510*100).toFixed(2)}%
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {selectedDay.tradeCount>0&&<span style={{color:C.tertiary,fontSize:10,fontFamily:FONT.mono}}><span style={{color:C.secondary,fontWeight:600}}>{selectedDay.tradeCount}</span> trade{selectedDay.tradeCount>1?'s':''}</span>}
                    {selectedDay.openCount>0&&<div className="flex items-center gap-1"><div className="xt-live-dot rounded-full" style={{background:C.orange,width:5,height:5}}/><span style={{color:C.orange,fontSize:10,fontFamily:FONT.mono,fontWeight:700}}>{selectedDay.openCount} aperto{selectedDay.openCount>1?'i':''}</span></div>}
                    {selectedDay.closedCount>0&&<span style={{color:C.tertiary,fontSize:10,fontFamily:FONT.mono}}><span style={{color:C.green,fontWeight:600}}>{selectedDay.trades.filter(t=>!t.open&&t.pnl>0).length}W</span>{' / '}<span style={{color:C.red,fontWeight:600}}>{selectedDay.trades.filter(t=>!t.open&&t.pnl<0).length}L</span></span>}
                  </div>
                </div>
                <button onClick={()=>setSelectedDay(null)} style={{background:C.glass2,border:`0.5px solid ${C.sep}`,borderRadius:10,padding:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <X size={13} style={{color:C.tertiary}}/>
                </button>
              </div>
            </div>
            {selectedTrades.length>0?(
              <div>
                {selectedTrades.filter(t=>t.open).map(t=><DayTradePill key={t.id} C={C} t={t}/>)}
                {selectedTrades.filter(t=>!t.open).map(t=><DayTradePill key={t.id} C={C} t={t}/>)}
              </div>
            ):(
              <div style={{textAlign:'center',padding:'16px 0',color:C.tertiary,fontSize:12,fontFamily:FONT.text}}>
                Nessun trade registrato per questo giorno
              </div>
            )}
          </div>
        )}
      </Glass>

      <GoalTracker C={C}/>
    </div>
  );
};

/* ============= STATS — METRICHE TOTALI + STATISTICHE BREAKDOWN ============= */

// Helper: Stat card che usa accent stringa
const accentColor = (C, k) => k ? (C[k] || C.primary) : C.primary;

const MetricsView = ({ C, stats }) => {
  if (!stats) return (
    <div style={{textAlign:'center',padding:'60px 0',color:C.tertiary,fontSize:14,fontFamily:FONT.text}}>
      Nessun trade registrato ancora.<br/>
      <span style={{fontSize:11,opacity:0.6,display:'block',marginTop:8}}>Le metriche appariranno quando MT5 invierà i dati via webhook.</span>
    </div>
  );

  const groups = [
    { key:'general',   title:'Statistiche Generali',  data: stats.general,   accent:C.green  },
    { key:'equity',    title:'Equity & Drawdown',     data: stats.equity,    accent:C.cyan   },
    { key:'risk',      title:'Risk & Ratios',         data: stats.risk,      accent:C.cyan   },
    { key:'excursion', title:'MAE / MFE',             data: stats.excursion, accent:C.orange },
    { key:'rolling',   title:'Rolling Performance',   data: stats.rolling,   accent:C.purple },
    { key:'roi',       title:'ROI',                   data: stats.roi,       accent:C.yellow },
    { key:'extremes',  title:'Best / Worst & R:R',    data: stats.extremes,  accent:C.green  },
    { key:'streak',    title:'Streak & Extremes',     data: stats.streak,    accent:C.pink   },
    { key:'closures',  title:'Chiusure',              data: stats.closures,  accent:C.green  },
    { key:'costs',     title:'Costi & Attriti',       data: stats.costs,     accent:C.orange },
  ].filter(g => g.data && g.data.length > 0);

  return (
    <div className="space-y-7">
      {groups.map((g, gi) => (
        <div key={g.key}>
          {gi > 0 && <div style={{height:'0.5px', background:C.sep, margin:'0 -8px 24px', opacity:0.6}}/>}
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-1 h-5 rounded-full" style={{ background: g.accent }}/>
            <h2 style={{fontFamily:FONT.display,fontSize:18,fontWeight:700,letterSpacing:'-0.3px',color:C.primary, ...neonText(g.accent, C.scheme)}}>
              {g.title}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {g.data.map((m,i)=>(
              <Stat key={i} C={C} label={m.label} value={m.value} sub={m.sub}
                    color={accentColor(C, m.accent)}/>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ============= TABELLA BREAKDOWN ============= */
const BreakdownTable = ({ C, title, action, columns, rows, showColor, showRR, noPnl }) => (
  <Glass C={C}>
    <SectionHeader C={C} action={action}>{title}</SectionHeader>
    <div className="overflow-x-auto">
      <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr>
            {columns.map((col,i)=>(
              <th key={i} style={{
                color:C.tertiary, fontSize:10, fontFamily:FONT.text, fontWeight:600,
                letterSpacing:'0.3px', textTransform:'uppercase',
                padding:'8px 10px', textAlign: i===0?'left':'right',
                borderBottom:`0.5px solid ${C.sep}`,
              }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row,i)=>(
            <tr key={i} style={{ background: i%2===1 ? C.glass2 : 'transparent' }}>
              <td style={{
                padding:'10px', fontSize:13, fontFamily:FONT.text, fontWeight:500, color:C.primary,
                borderBottom: i < rows.length-1 ? `0.5px solid ${C.sep}` : 'none',
              }}>
                <div className="flex items-center gap-2">
                  {showColor && row.color && <div className="w-2 h-2 rounded-full" style={{ background: row.color }}/>}
                  {row.name}
                </div>
              </td>
              <td style={{padding:'10px',fontSize:13,fontFamily:FONT.mono,fontWeight:500,color:C.secondary,textAlign:'right',fontVariantNumeric:'tabular-nums',
                borderBottom: i < rows.length-1 ? `0.5px solid ${C.sep}` : 'none'}}>
                {row.trades}
              </td>
              <td style={{padding:'10px',fontSize:13,fontFamily:FONT.mono,fontWeight:500,
                color: row.wr === 0 ? C.tertiary : row.wr >= 60 ? C.green : row.wr >= 40 ? C.yellow : C.red,
                textAlign:'right',fontVariantNumeric:'tabular-nums',
                borderBottom: i < rows.length-1 ? `0.5px solid ${C.sep}` : 'none'}}>
                {row.wr}%
              </td>
              {showRR && (
                <td style={{padding:'10px',fontSize:13,fontFamily:FONT.mono,fontWeight:500,
                  color: !row.rr || row.rr===0 ? C.tertiary : row.rr >= 2 ? C.cyan : row.rr >= 1.5 ? C.yellow : C.secondary,
                  textAlign:'right',fontVariantNumeric:'tabular-nums',
                  borderBottom: i < rows.length-1 ? `0.5px solid ${C.sep}` : 'none'}}>
                  {row.rr ? row.rr.toFixed(1)+'R' : '—'}
                </td>
              )}
              {!noPnl && (
                <td style={{padding:'10px',fontSize:13,fontFamily:FONT.mono,fontWeight:600,
                  color: row.pnl === 0 ? C.tertiary : row.pnl > 0 ? C.green : C.red,
                  textAlign:'right',fontVariantNumeric:'tabular-nums',
                  borderBottom: i < rows.length-1 ? `0.5px solid ${C.sep}` : 'none'}}>
                  {row.pnl > 0 ? '+' : ''}${row.pnl.toFixed(2)}
                </td>
              )}
              {!noPnl && row.avg !== undefined && (
                <td style={{padding:'10px',fontSize:13,fontFamily:FONT.mono,fontWeight:500,
                  color: row.avg === 0 ? C.tertiary : row.avg > 0 ? C.green : C.red,
                  textAlign:'right',fontVariantNumeric:'tabular-nums',
                  borderBottom: i < rows.length-1 ? `0.5px solid ${C.sep}` : 'none'}}>
                  {row.avg > 0 ? '+' : ''}${row.avg.toFixed(2)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Glass>
);

/* ============= MATRICE ============= */
const MatrixView = ({ C, matrixData }) => {
  const DAYS = ['Lun','Mar','Mer','Gio','Ven'];
  const SESS = ['ASIAN','FRANKFURT','LONDON','NEWYORK'];
  const data = matrixData || DAYS.map(() => SESS.map(() => ({pnl:0,wr:0,rr:0,trades:0})));
  const allPnl = data.flat().map(c=>c.pnl).filter(v=>v!==0);

  const cellColor = (pnl) => {
    if (pnl === 0) return { bg: C.glass2, text: C.tertiary, border: C.sep };
    const intensity = Math.min(Math.abs(pnl) / max, 1);
    const alpha = Math.round(intensity * 55).toString(16).padStart(2,'0');
    if (pnl > 0) return { bg: `${C.green}${alpha}`, text: C.green, border: `${C.green}40` };
    return { bg: `${C.red}${alpha}`, text: C.red, border: `${C.red}40` };
  };

  return (
    <Glass C={C}>
      <SectionHeader C={C} action={<span style={{color:C.secondary,fontSize:11,fontFamily:FONT.mono}}>P&L · WR · R:R</span>}>
        Matrice Giorno × Sessione
      </SectionHeader>
      <div className="overflow-x-auto">
        <div style={{ minWidth: 320 }}>
          {/* Header row */}
          <div className="grid gap-1" style={{ gridTemplateColumns: `52px repeat(${SESS.length}, 1fr)`, marginBottom:4 }}>
            <div/>
            {SESS.map(s=>(
              <div key={s} style={{
                color:C.tertiary,fontSize:9,fontFamily:FONT.text,fontWeight:600,
                letterSpacing:'0.3px',textTransform:'uppercase',textAlign:'center',padding:'4px 2px',
              }}>{s}</div>
            ))}
          </div>
          {/* Data rows */}
          {DAYS.map((day,di) => (
            <div key={day} className="grid gap-1 mb-1" style={{ gridTemplateColumns: `52px repeat(${SESS.length}, 1fr)` }}>
              <div style={{
                color:C.secondary,fontSize:11,fontFamily:FONT.text,fontWeight:600,
                display:'flex',alignItems:'center',paddingLeft:4,
              }}>{day}</div>
              {SESS.map((sess,si)=>{
                const c = data[di]?.[si] || {pnl:0,wr:0,rr:0,trades:0};
                const col = cellColor(c.pnl);
                const empty = c.trades === 0;
                return (
                  <div key={si} style={{
                    background: col.bg,
                    border: `0.5px solid ${col.border}`,
                    borderRadius: 10,
                    padding:'6px 4px',
                    textAlign:'center',
                  }}>
                    {empty ? (
                      <span style={{color:C.tertiary,fontSize:11,fontFamily:FONT.mono}}>—</span>
                    ) : (
                      <div style={{display:'flex',flexDirection:'column',gap:1}}>
                        <span style={{color:col.text,fontSize:11,fontFamily:FONT.mono,fontWeight:700,fontVariantNumeric:'tabular-nums'}}>
                          {c.pnl > 0 ? '+' : ''}{c.pnl.toFixed(0)}
                        </span>
                        <span style={{color:c.wr>=60?C.green:c.wr>=40?C.yellow:C.red,fontSize:9,fontFamily:FONT.mono,fontWeight:600}}>
                          {c.wr}%
                        </span>
                        <span style={{color:C.tertiary,fontSize:9,fontFamily:FONT.mono}}>
                          {(c.rr||0).toFixed(1)}R
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          {/* Legend */}
          <div className="flex items-center gap-3 mt-2" style={{paddingLeft:4}}>
            <span style={{color:C.tertiary,fontSize:9,fontFamily:FONT.mono}}>P&L $</span>
            <span style={{color:C.tertiary,fontSize:9,fontFamily:FONT.mono}}>· WR %</span>
            <span style={{color:C.tertiary,fontSize:9,fontFamily:FONT.mono}}>· R:R</span>
          </div>
        </div>
      </div>
    </Glass>
  );
};

/* ============= STATISTICHE BREAKDOWN VIEW ============= */
const BreakdownView = ({ C, trades, stats, confluences, confidence, confBreakdown, confCorr }) => {
  const postStreak = stats?.postStreak || [];
  return (
  <div className="space-y-4">
    <MatrixView C={C} matrixData={stats?.matrixData}/>

    <BreakdownTable C={C} title="Per Sessione"
      columns={['Sessione','Trades','WR','P&L','Avg']}
      rows={stats?.breakSess || []} showColor/>

    <BreakdownTable C={C} title="Per Tipo Trade"
      columns={['Tipo','Trades','WR','P&L','Avg']}
      rows={stats?.breakType || []} showColor/>

    <BreakdownTable C={C} title="Per Giorno Settimana"
      columns={['Giorno','Trades','WR','P&L','Avg']}
      rows={(stats?.breakDay || []).filter(d=>d.trades>0)}/>

    <BreakdownTable C={C} title="Per Mese"
      columns={['Mese','Trades','WR','P&L']}
      rows={stats?.breakMonth || []}/>

    <BreakdownTable C={C} title="Per Ora · Amsterdam (DST auto)"
      action={<span style={{color:C.secondary,fontSize:13,fontFamily:FONT.mono}}>00:00 — 23:00</span>}
      columns={['Ora','Trades','WR','P&L']}
      rows={stats?.breakHour || []}/>

    <BreakdownTable C={C} title="Per Holding Time"
      columns={['Bucket','Trades','WR','P&L','Avg']}
      rows={stats?.breakHolding || []}/>

    <BreakdownTable C={C} title="Behavioral · Performance dopo streak"
      action={<span style={{color:C.secondary,fontSize:13,fontFamily:FONT.mono}}>tilt detection</span>}
      columns={['Stato','Trades','WR','P&L','Avg']}
      rows={postStreak.filter(r=>r.trades>0)}/>

    <BreakdownTable C={C} title="Behavioral · Confidence vs P&L"
      action={<span style={{color:C.secondary,fontSize:11,fontFamily:FONT.mono}}>correlazione stelle → risultati</span>}
      columns={['Rating','Trades','WR','P&L','Avg']}
      rows={confCorr || []}/>

    <BreakdownTable C={C} title="Per Confluenza"
      action={
        <span style={{color:C.secondary,fontSize:11,fontFamily:FONT.mono}}>
          {Object.keys(confluences||{}).length > 0 ? '● dati reali' : '○ inserisci confluenze'}
        </span>
      }
      columns={['CONFLUENZA','TRADES','WR','RR']}
      rows={confBreakdown || []} showColor showRR noPnl/>

    <SetupEdgeView C={C}/>
  </div>
  );
};

/* ============= SETUP EDGE DATA ============= */
// Combinazioni di confluenze — ordinate per WR reale sui trade registrati
// Esempi di riferimento setup — verranno calcolati dai trade reali una volta disponibili
const setupCombos = [
  { combo:'ORIGINE + OBB',                    trades:8,  wr:88, rr:2.8, pnl:312.00, avg:39.0,  colors:['#7DF9FF','#7DF9FF'] },
  { combo:'ORIGINE + VWAP ▲',                 trades:7,  wr:86, rr:2.6, pnl:285.00, avg:40.7,  colors:['#7DF9FF','#FFB627'] },
  { combo:'OBB + FIBREVERSE',                 trades:6,  wr:83, rr:2.5, pnl:245.00, avg:40.8,  colors:['#7DF9FF','#C77DFF'] },
  { combo:'ORIGINE + 3D',                     trades:6,  wr:83, rr:2.3, pnl:210.00, avg:35.0,  colors:['#7DF9FF','#C77DFF'] },
  { combo:'ORIGINE + OBB + VWAP ▲',           trades:5,  wr:80, rr:2.9, pnl:198.00, avg:39.6,  colors:['#7DF9FF','#7DF9FF','#FFB627'] },
  { combo:'OBB + POC',                        trades:5,  wr:80, rr:2.4, pnl:188.00, avg:37.6,  colors:['#7DF9FF','#C77DFF'] },
  { combo:'FIBREVERSE + ORIGINE',             trades:5,  wr:80, rr:2.2, pnl:175.00, avg:35.0,  colors:['#C77DFF','#7DF9FF'] },
  { combo:'ORIGINE + SWEEP',                  trades:4,  wr:75, rr:2.4, pnl:142.00, avg:35.5,  colors:['#7DF9FF','#C77DFF'] },
  { combo:'OBB + VWAP ▲ + POC',              trades:4,  wr:75, rr:2.6, pnl:155.00, avg:38.8,  colors:['#7DF9FF','#FFB627','#C77DFF'] },
  { combo:'ORIGINE REVERSE + OBB',            trades:4,  wr:75, rr:2.1, pnl:128.00, avg:32.0,  colors:['#7DF9FF','#7DF9FF'] },
  { combo:'3D + OBB + FIBREVERSE',            trades:3,  wr:67, rr:2.5, pnl: 98.00, avg:32.7,  colors:['#C77DFF','#7DF9FF','#C77DFF'] },
  { combo:'VWAP ▲ + POC + ORIGINE',          trades:3,  wr:67, rr:2.3, pnl: 85.00, avg:28.3,  colors:['#FFB627','#C77DFF','#7DF9FF'] },
  { combo:'FIBREVERSE + SWEEP + OBB',         trades:3,  wr:67, rr:2.0, pnl: 72.00, avg:24.0,  colors:['#C77DFF','#C77DFF','#7DF9FF'] },
  { combo:'ORIGINE REVERSE + VWAP ▼',        trades:3,  wr:67, rr:1.8, pnl: 62.00, avg:20.7,  colors:['#7DF9FF','#FFB627'] },
  { combo:'OBV + OBB',                        trades:3,  wr:67, rr:1.9, pnl: 68.00, avg:22.7,  colors:['#7DF9FF','#7DF9FF'] },
];

/* ============= SETUP EDGE VIEW ============= */
const SetupEdgeView = ({ C }) => {
  const sorted = [...setupCombos]
    .sort((a,b) => b.wr !== a.wr ? b.wr - a.wr : b.trades - a.trades);

  return (
    <Glass C={C}>
      <SectionHeader C={C}
        action={<span style={{color:C.secondary,fontSize:11,fontFamily:FONT.mono}}>↓ WIN RATE</span>}>
        Setup Edge · Combo
      </SectionHeader>

      <div className="space-y-2">
        {sorted.map((row, i) => {
          const wrColor = row.wr >= 80 ? C.green : row.wr >= 67 ? C.cyan : row.wr >= 50 ? C.yellow : C.red;
          const wins = Math.round(row.trades * row.wr / 100);
          return (
            <div key={i} style={{
              background: i % 2 === 1 ? C.glass2 : 'transparent',
              borderRadius: 12,
              padding: '10px 12px',
              border: `0.5px solid ${i === 0 ? C.green+'30' : C.sep}`,
            }}>
              {/* Chips combo + WR badge */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-1" style={{flex:1, minWidth:0}}>
                  {i === 0 && (
                    <span style={{
                      fontSize:9, fontFamily:FONT.mono, fontWeight:700,
                      color:C.green, background:`${C.green}18`,
                      padding:'1px 6px', borderRadius:6, marginRight:2,
                    }}>BEST</span>
                  )}
                  {row.combo.split(' + ').map((part, ci) => (
                    <span key={ci} style={{
                      fontSize:11, fontFamily:FONT.mono, fontWeight:700,
                      color: row.colors[ci] || C.secondary,
                      background:`${row.colors[ci] || C.secondary}15`,
                      padding:'2px 7px', borderRadius:7,
                      border:`0.5px solid ${(row.colors[ci] || C.secondary)}35`,
                      whiteSpace:'nowrap',
                    }}>{part}</span>
                  ))}
                </div>
                {/* WR badge */}
                <div style={{
                  flexShrink:0,
                  background:`${wrColor}15`,
                  border:`0.5px solid ${wrColor}40`,
                  borderRadius:8, padding:'4px 10px',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:1,
                }}>
                  <span style={{fontSize:16,fontFamily:FONT.mono,fontWeight:700,color:wrColor,fontVariantNumeric:'tabular-nums',lineHeight:1}}>{row.wr}%</span>
                  <span style={{fontSize:8,fontFamily:FONT.text,fontWeight:600,color:C.tertiary,letterSpacing:'0.2px',textTransform:'uppercase'}}>win rate</span>
                </div>
              </div>

              {/* Barra WR */}
              <div style={{height:3, borderRadius:2, background:C.glass3, marginBottom:6, overflow:'hidden'}}>
                <div style={{
                  height:'100%', borderRadius:2,
                  width:`${row.wr}%`,
                  background:`linear-gradient(90deg, ${wrColor}, ${wrColor}88)`,
                  boxShadow:`0 0 6px ${wrColor}40`,
                }}/>
              </div>

              {/* Trades W/L + RR */}
              <div className="flex items-center gap-3 flex-wrap">
                <span style={{fontSize:10,fontFamily:FONT.mono,color:C.secondary,fontWeight:600}}>
                  {row.trades} trade{row.trades!==1?'s':''}
                </span>
                <span style={{color:C.tertiary,fontSize:10}}>·</span>
                <span style={{fontSize:10,fontFamily:FONT.mono}}>
                  <span style={{color:C.green,fontWeight:700}}>{wins}W</span>
                  <span style={{color:C.tertiary}}> / </span>
                  <span style={{color:C.red,fontWeight:700}}>{row.trades - wins}L</span>
                </span>
                <span style={{color:C.tertiary,fontSize:10}}>·</span>
                <span style={{fontSize:10,fontFamily:FONT.mono,color:C.cyan,fontWeight:600}}>{row.rr.toFixed(1)}R medio</span>
              </div>
            </div>
          );
        })}
      </div>
    </Glass>
  );
};

/* ============= CONFLUENCE & CONFIDENCE BREAKDOWN ============= */
const computeConfluenceBreakdown = (trades, confluences) => {
  if (!trades||!confluences||Object.keys(confluences).length===0) return [];
  const confMap = {};
  trades.filter(t=>!t.open).forEach(trade => {
    const conf = confluences[trade.id] || confluences[trade.basket];
    if (!conf) return;
    const names = [
      ...(conf.noTF||[]).map(x=>x.name),
      ...(conf.withTF||[]).map(x=>x.name),
      ...(conf.vwap||[]).map(x=>x.bull&&x.bear?'VWAP KEYZONE':x.bull?'VWAP ▲':'VWAP ▼'),
    ].map(n=>n.startsWith('VWAP')?'VWAP':n);
    [...new Set(names)].forEach(name=>{
      if(!confMap[name])confMap[name]=[];
      confMap[name].push(trade);
    });
  });
  return Object.entries(confMap).map(([name,tlist])=>{
    const wins=tlist.filter(t=>t.pnl>0);
    const pnl=tlist.reduce((s,t)=>s+t.pnl,0);
    const rrs=tlist.filter(t=>t.rr>0).map(t=>t.rr);
    return { name, trades:tlist.length, wr:tlist.length?Math.round(wins.length/tlist.length*100):0,
      rr:rrs.length?rrs.reduce((s,r)=>s+r,0)/rrs.length:0, pnl, avg:tlist.length?pnl/tlist.length:0,
      color:CONF_COLORS_MAP[name]||'#C77DFF' };
  }).sort((a,b)=>b.wr!==a.wr?b.wr-a.wr:(b.rr||0)-(a.rr||0));
};

const computeConfidenceBreakdown = (trades, confidence) => {
  if (!trades||!confidence) return [];
  const closed=trades.filter(t=>!t.open);
  const buckets={1:[],2:[],3:[],4:[],5:[]};
  closed.forEach(t=>{ const c=confidence[t.id]; if(c>=1&&c<=5)buckets[c].push(t); });
  const labels={1:'1 ★',2:'2 ★★',3:'3 ★★★',4:'4 ★★★★',5:'5 ★★★★★'};
  return [1,2,3,4,5].map(star=>{
    const tlist=buckets[star];
    const wins=tlist.filter(t=>t.pnl>0);
    const pnl=tlist.reduce((s,t)=>s+t.pnl,0);
    return { name:labels[star], trades:tlist.length,
      wr:tlist.length?Math.round(wins.length/tlist.length*100):0, pnl, avg:tlist.length?pnl/tlist.length:0 };
  }).filter(r=>r.trades>0);
};

/* ============= STATS ROOT ============= */
const StatsView = ({ C, trades }) => {
  const [confluences] = usePersistedState('xt_confluences', {});
  const [confidence]  = usePersistedState('xt_confidence',  {});
  const stats = useMemo(() => computeAllStats(trades || []), [trades]);
  const confBreakdown = useMemo(() => computeConfluenceBreakdown(trades, confluences), [trades, confluences]);
  const confCorr      = useMemo(() => computeConfidenceBreakdown(trades, confidence),  [trades, confidence]);
  const [subTab, setSubTab] = usePersistedState('xt_stats_subtab', 'metrics');

  const subOptions = ['Metriche','Statistiche','Analytics'];
  const subMap     = { Metriche:'metrics', Statistiche:'breakdown', Analytics:'analytics' };
  const subMapRev  = { metrics:'Metriche', breakdown:'Statistiche', analytics:'Analytics' };

  const handleSubTab = (v) => {
    setSubTab(subMap[v] || 'metrics');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3 px-1">
        <h1 style={{fontFamily:FONT.display,fontSize:28,fontWeight:700,letterSpacing:'-0.6px',color:C.primary, ...neonText(C.primary, C.scheme)}}>Performance</h1>
        <SegmentedControl C={C} options={subOptions} value={subMapRev[subTab] || 'Metriche'} onChange={handleSubTab}/>
      </div>

      {subTab === 'metrics'   && <MetricsView   C={C} stats={stats}/>}
      {subTab === 'breakdown' && <BreakdownView C={C} trades={trades} stats={stats} confluences={confluences} confidence={confidence} confBreakdown={confBreakdown} confCorr={confCorr}/>}
      {subTab === 'analytics' && <AnalyticsView C={C} trades={trades}/>}
    </div>
  );
};

/* ============= ANALYTICS DATA ============= */

// 365 giorni per heatmap: gen-mag 2026 (143 giorni) + mock precedente
/* ============= ANNUAL HEATMAP ============= */
const AnnualHeatmap = ({ C, data }) => {
  const all    = data || [];
  const maxV   = Math.max(...all.map(d=>Math.abs(d.pnl)), 1);
  const weeks  = Math.max(...all.map(d=>d.week)) + 1;
  const months = ['Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic','Gen','Feb','Mar','Apr','Mag'];
  const [tooltip, setTooltip] = useState(null); // {date, pnl, x, y}

  const cellColor = (pnl) => {
    if (pnl === 0) return C.glass2;
    const i = Math.min(Math.abs(pnl) / maxV, 1);
    const hex = Math.round(i * 80).toString(16).padStart(2,'0');
    return pnl > 0 ? `${C.green}${hex}` : `${C.red}${hex}`;
  };

  return (
    <Glass C={C}>
      <SectionHeader C={C} action={<span style={{color:C.secondary,fontSize:11,fontFamily:FONT.mono}}>Mag 2025 — Mag 2026</span>}>
        Heatmap Annuale
      </SectionHeader>
      <div style={{overflowX:'auto', position:'relative'}} onClick={()=>setTooltip(null)}>
        {/* Tooltip mobile */}
        {tooltip && (
          <div style={{
            position:'absolute', top: tooltip.y, left: Math.min(tooltip.x, 200),
            background: C.glass3, border:`0.5px solid ${tooltip.pnl>=0?C.green:C.red}55`,
            borderRadius: RADIUS.inset, padding:'6px 10px', zIndex:50,
            backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)',
            pointerEvents:'none', whiteSpace:'nowrap',
            boxShadow:`0 4px 20px ${tooltip.pnl>=0?C.green:C.red}25`,
          }}>
            <div style={{color:C.tertiary,fontSize:9,fontFamily:FONT.mono}}>{tooltip.date}</div>
            <div style={{color:tooltip.pnl>=0?C.green:C.red,fontSize:14,fontFamily:FONT.mono,fontWeight:700,fontVariantNumeric:'tabular-nums'}}>
              {tooltip.pnl>=0?'+':''}${tooltip.pnl.toFixed(2)}
            </div>
          </div>
        )}
        <div style={{minWidth: weeks * 13}}>
          {/* Month labels */}
          <div style={{display:'flex',marginBottom:4,paddingLeft:20}}>
            {Array.from({length:13},(_,m)=>(
              <div key={m} style={{width: m < 12 ? `${Math.floor(weeks/13)*13}px` : 'auto', color:C.tertiary, fontSize:9, fontFamily:FONT.mono, fontWeight:600, flexShrink:0}}>{months[m]}</div>
            ))}
          </div>
          <div style={{display:'flex',gap:0}}>
            {/* Day labels */}
            <div style={{display:'flex',flexDirection:'column',gap:1.5,marginRight:4}}>
              {['L','M','M','G','V','S','D'].map((d,i)=>(
                <div key={i} style={{height:10,fontSize:7,fontFamily:FONT.mono,color:C.tertiary,display:'flex',alignItems:'center'}}>{i%2===1?d:''}</div>
              ))}
            </div>
            {/* Grid */}
            <div style={{display:'flex',gap:1.5}}>
              {Array.from({length:weeks},(_,w)=>(
                <div key={w} style={{display:'flex',flexDirection:'column',gap:1.5}}>
                  {[0,1,2,3,4,5,6].map(dow=>{
                    const cell = all.find(d=>d.week===w && d.day===dow);
                    if (!cell) return <div key={dow} style={{width:10,height:10}}/>;
                    return (
                      <div key={dow}
                        onClick={e => {
                          e.stopPropagation();
                          if (cell.pnl === 0) return;
                          const rect = e.currentTarget.getBoundingClientRect();
                          const parentRect = e.currentTarget.closest('[style*="overflow"]').getBoundingClientRect();
                          setTooltip(t => t?.date === cell.date ? null : {
                            date: cell.date, pnl: cell.pnl,
                            x: rect.left - parentRect.left + 14,
                            y: rect.top  - parentRect.top  + 14,
                          });
                        }}
                        style={{
                          width:10, height:10, borderRadius:2.5,
                          background: cellColor(cell.pnl),
                          border:`0.5px solid ${cell.pnl===0?C.sep:'transparent'}`,
                          cursor: cell.pnl !== 0 ? 'pointer' : 'default',
                          transition:'transform 0.12s ease',
                          transform: tooltip?.date===cell.date ? 'scale(1.6)' : 'scale(1)',
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-2 mt-3" style={{justifyContent:'flex-end'}}>
            <span style={{color:C.tertiary,fontSize:9,fontFamily:FONT.mono}}>Meno</span>
            {[0.15,0.35,0.55,0.75,1.0].map((i,k)=>(
              <div key={k} style={{width:10,height:10,borderRadius:2.5,background:`${C.green}${Math.round(i*80).toString(16).padStart(2,'0')}`}}/>
            ))}
            <span style={{color:C.tertiary,fontSize:9,fontFamily:FONT.mono}}>Più</span>
          </div>
        </div>
      </div>
    </Glass>
  );
};

/* ============= STREAK DISTRIBUTION ============= */
const StreakDistribution = ({ C, data }) => {
  if (!data || data.length === 0) return null;
  return (
    <Glass C={C}>
      <SectionHeader C={C}>Distribuzione Streak</SectionHeader>
      <DragChart C={C} data={data} height={180} labelKey="len" valueKey="count" valueSuffix=" volte"
        valueColor={(v) => C.secondary}>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} margin={{top:5,right:5,left:-15,bottom:0}}>
            <CartesianGrid stroke={C.sep} vertical={false}/>
            <XAxis dataKey="len" tick={{fill:C.tertiary,fontSize:11,fontFamily:FONT.mono}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:C.tertiary,fontSize:11,fontFamily:FONT.mono}} axisLine={false} tickLine={false}/>
            <Bar dataKey="count" radius={[4,4,0,0]} isAnimationActive={false}>
              {data.map((d,i)=>(
                <Cell key={i} fill={d.type==='win'?C.green:C.red}/>
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </DragChart>
      <div style={{color:C.tertiary,fontSize:10,fontFamily:FONT.text,marginTop:8,textAlign:'center'}}>
        Verde = streak vincenti · Rosso = streak perdenti
      </div>
    </Glass>
  );
};

/* ============= MAE/MFE SCATTER ============= */
const MaeMfeScatter = ({ C, data }) => {
  const pts = (data || []).filter(t => t.mae || t.mfe).map((t,i) => ({id:i,mae:t.mae||0,mfe:t.mfe||0,pnl:t.pnl,label:t.basket||`T${i+1}`}));
  if (pts.length === 0) return null;
  const max = Math.max(...pts.map(d=>Math.abs(d.mfe)), 1);
  const minM = Math.min(...pts.map(d=>d.mae));
  const W = 320, H = 220, PX = 40, PY = 20;

  const xScale = (v) => PX + ((v - minM) / (-minM)) * (W - PX - 10);
  const yScale = (v) => PY + (1 - v/max) * (H - PY - 20);

  return (
    <Glass C={C}>
      <SectionHeader C={C} action={<span style={{color:C.secondary,fontSize:11,fontFamily:FONT.mono}}>ogni punto = 1 trade</span>}>MAE / MFE Scatter</SectionHeader>
      <div style={{overflowX:'auto'}}>
        <svg width={W} height={H} style={{overflow:'visible',display:'block',margin:'0 auto'}}>
          {/* Grid */}
          {[0,0.25,0.5,0.75,1].map((t,i)=>(
            <line key={i} x1={PX} x2={W-10} y1={PY+t*(H-PY-20)} y2={PY+t*(H-PY-20)}
              stroke={C.sep} strokeWidth={0.5}/>
          ))}
          {/* Axis labels */}
          <text x={W/2} y={H} fontSize={9} fill={C.tertiary} fontFamily={FONT.mono} textAnchor="middle">MAE (drawdown intra-trade)</text>
          <text x={8} y={H/2} fontSize={9} fill={C.tertiary} fontFamily={FONT.mono} textAnchor="middle" transform={`rotate(-90,8,${H/2})`}>MFE</text>
          {/* Diagonal guide: MAE = MFE */}
          <line x1={PX} x2={W-10} y1={H-20} y2={PY} stroke={C.sep} strokeWidth={1} strokeDasharray="3 3"/>
          {/* Points */}
          {pts.map(d=>{
            const cx = xScale(d.mae), cy = yScale(d.mfe);
            const color = d.pnl >= 0 ? C.green : C.red;
            const r = 5 + Math.abs(d.pnl)/50;
            return (
              <g key={d.id}>
                <circle cx={cx} cy={cy} r={r} fill={`${color}40`} stroke={color} strokeWidth={1.5}/>
                <text x={cx+r+2} y={cy+3} fontSize={8} fill={C.tertiary} fontFamily={FONT.mono}>{d.label}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div style={{color:C.tertiary,fontSize:10,fontFamily:FONT.text,marginTop:8,textAlign:'center'}}>
        Sopra la diagonale = hai lasciato correre · Sotto = hai chiuso troppo presto
      </div>
    </Glass>
  );
};

/* ============= P&L DISTRIBUTION ============= */
const PnlDistribution = ({ C, data }) => {
  const trades = data || [];
  if (trades.length === 0) return null;
  const pnls = trades.map(t => t.pnl);
  const minP = Math.min(...pnls), maxP = Math.max(...pnls);
  const step = Math.max(Math.ceil((maxP - minP) / 12 / 20) * 20, 20);
  const bins = [];
  for (let v = Math.floor(minP/step)*step; v <= maxP + step; v += step) bins.push(v);
  const counts = bins.slice(0,-1).map((lo,i) => ({
    range:`${lo}`,
    count: trades.filter(t => t.pnl>=lo && t.pnl<bins[i+1]).length,
    color: lo >= 0 ? C.green : C.red,
  }));
  const n = trades.length;
  const mean = pnls.reduce((s,v)=>s+v,0)/n;
  const std = Math.sqrt(pnls.reduce((s,v)=>s+(v-mean)**2,0)/n);
  const skew = std>0 ? pnls.reduce((s,v)=>s+((v-mean)/std)**3,0)/n : 0;
  const wr = Math.round(trades.filter(t=>t.pnl>0).length/n*100);
  return (
    <Glass C={C}>
      <SectionHeader C={C} action={<span style={{color:C.secondary,fontSize:11,fontFamily:FONT.mono}}>istogramma P&L</span>}>Distribuzione P&L</SectionHeader>
      <DragChart C={C} data={counts} height={200} labelKey="range" valueKey="count" valueSuffix=" trade"
        valueColor={(v) => C.secondary}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={counts} margin={{top:5,right:5,left:-15,bottom:0}}>
            <CartesianGrid stroke={C.sep} vertical={false}/>
            <XAxis dataKey="range" tick={{fill:C.tertiary,fontSize:10,fontFamily:FONT.mono}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:C.tertiary,fontSize:11,fontFamily:FONT.mono}} axisLine={false} tickLine={false}/>
            <Bar dataKey="count" radius={[4,4,0,0]} isAnimationActive={false}>
              {counts.map((d,i)=><Cell key={i} fill={d.color}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </DragChart>
      <div className="grid grid-cols-3 gap-2 mt-3">
        {[
          {l:'Skewness',v:`${skew>=0?'+':''}${skew.toFixed(2)}`,c:skew>=0?C.green:C.red},
          {l:'% win',v:`${wr}%`,c:C.cyan},
          {l:'Trades',v:`${n}`,c:C.purple},
        ].map((m,i)=>(
          <GlassInset C={C} key={i} padding="p-2">
            <div style={{color:C.tertiary,fontSize:8,fontFamily:FONT.text,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.3px'}}>{m.l}</div>
            <div style={{color:m.c,fontSize:16,fontFamily:FONT.mono,fontWeight:700,marginTop:2}}>{m.v}</div>
          </GlassInset>
        ))}
      </div>
    </Glass>
  );
};

/* ============= ANALYTICS ROOT VIEW ============= */
const AnalyticsView = ({ C, trades }) => {
  const closed = (trades || []).filter(t => !t.open);

  // Heatmap annuale: calcola da trade reali
  const annualHeatmapData = (() => {
    const byDate = {};
    closed.forEach(t => { byDate[t.date] = (byDate[t.date]||0) + t.pnl; });
    const start = new Date(); start.setFullYear(start.getFullYear()-1);
    return Array.from({length:365},(_,i)=>{
      const d = new Date(start); d.setDate(start.getDate()+i);
      const date = d.toISOString().slice(0,10);
      return { date, day:(d.getDay()+6)%7, week:Math.floor(i/7), pnl:byDate[date]||0 };
    });
  })();

  // Streak distribution dai trade reali
  const streakDistData = (() => {
    if (closed.length === 0) return [];
    const sorted = [...closed].sort((a,b)=>a.date.localeCompare(b.date)||a.id-b.id);
    const wins = {}, losses = {};
    let cw=0, cl=0;
    sorted.forEach(t => {
      if (t.pnl > 0) { cw++; cl=0; wins[cw]=(wins[cw]||0)+1; }
      else            { cl++; cw=0; losses[cl]=(losses[cl]||0)+1; }
    });
    const maxW = Math.max(...Object.keys(wins).map(Number), 0);
    const maxL = Math.max(...Object.keys(losses).map(Number), 0);
    return [
      ...Array.from({length:Math.min(maxW,7)},(_,i)=>({len:`${i+1}W`,count:wins[i+1]||0,type:'win'})),
      ...Array.from({length:Math.min(maxL,5)},(_,i)=>({len:`${i+1}L`,count:losses[i+1]||0,type:'loss'})),
    ].filter(d=>d.count>0);
  })();

  return(
  <div className="space-y-4">
    <PnlDistribution C={C} data={closed}/>
    <MaeMfeScatter C={C} data={closed.filter(t=>t.mae||t.mfe)}/>
    <StreakDistribution C={C} data={streakDistData}/>
    <AnnualHeatmap C={C} data={annualHeatmapData}/>
  </div>
  );
};

/* ============= SETTINGS DEFAULTS ============= */
const SETTINGS_DEFAULTS = {
  cooldownEnabled:    true,
  dailyLockEnabled:   true,
  dailyTarget:        150,
  pdfExportEnabled:   false,
  streakDistEnabled:  true,
};

/* ============= ROOT ============= */
export default function TradingApp() {
  useEffect(() => { injectGlobalCSS(); injectPressManager(); }, []);

  const sysScheme = useColorScheme();
  const [schemeOverride, setSchemeOverride] = usePersistedState('xt_scheme_override', 'auto');
  const scheme = schemeOverride === 'auto' ? sysScheme : schemeOverride;
  const C = { ...palette[scheme], scheme };
  const now = useLiveClock();

  const [settings, setSettings]           = usePersistedState('xt_settings', SETTINGS_DEFAULTS);
  const [accounts]                         = useState(ACCOUNT_DEFAULTS);
  const [activeAccount, setActiveAccount]  = usePersistedState('xt_active_account', 'main');
  const [settingsOpen, setSettingsOpen]    = useState(false);

  const TAB_ORDER = ['daily', 'temporal', 'stats'];
  const [tabIdx, setTabIdx] = useState(0);
  const tabIdxRef = useRef(0); // mirror di tabIdx, accessibile nei listener senza closure stale

  // Sync ref ogni volta che tabIdx cambia da React
  useEffect(() => { tabIdxRef.current = tabIdx; }, [tabIdx]);

  // ── Tab navigation — solo tap ──────────────────
  const pagerRef = useRef(null);

  const snapTo = (idx) => {
    const clampedIdx = Math.max(0, Math.min(TAB_ORDER.length - 1, idx));
    if (clampedIdx !== tabIdxRef.current) {
      tabIdxRef.current = clampedIdx;
      setTabIdx(clampedIdx);
    }
  };

  const handleTabTap = (idx) => {
    if (idx === tabIdx) { haptic.selection(); return; } // tap su tab già attiva: light tick
    haptic.medium(); // cambio tab: medium impact
    snapTo(idx);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const tabs = [
    { id:'daily',     label:'Oggi'        },
    { id:'temporal',  label:'Storico'     },
    { id:'stats',     label:'Performance' },
  ];
  const streak       = useMemo(() => detectStreak([]), []);
  const cooldownOn   = useMemo(() => settings.cooldownEnabled && detectCooldown([]), [settings.cooldownEnabled]);
  const todayTrades  = useMemo(() => [], [new Date().toISOString().slice(0,10)]);
  const dailyLock    = useMemo(() => settings.dailyLockEnabled ? checkDailyTarget(todayTrades, settings.dailyTarget || 150) : { reached: false, pnl: 0 }, [settings.dailyLockEnabled, todayTrades, settings.dailyTarget]);
  const icons = useMemo(() => tabIcons(C), [C]);
  const timeStr = now.toLocaleTimeString('it-IT', { hour:'2-digit', minute:'2-digit' });

  return (
    <div className="relative" style={{
      background: C.bg, color: C.primary, fontFamily: FONT.text,
      WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale',
      overflowX: 'hidden',
    }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: C.ambient }}/>

      {/* SETTINGS MODAL */}
      <SettingsModal
        C={C} open={settingsOpen} onClose={()=>setSettingsOpen(false)}
        settings={settings} setSettings={setSettings}
        accounts={accounts} activeAccount={activeAccount} setActiveAccount={setActiveAccount}
        scheme={sysScheme} schemeOverride={schemeOverride} setSchemeOverride={setSchemeOverride}
      />

      {/* HEADER */}
      <header className="sticky top-0 z-30 overflow-hidden" style={{
        background: scheme === 'dark' ? 'rgba(0,0,0,0.48)' : 'rgba(255,255,255,0.58)',
        backdropFilter: 'saturate(200%) blur(32px)',
        WebkitBackdropFilter: 'saturate(200%) blur(32px)',
        borderBottom: `0.5px solid ${C.sep}`,
      }}>
        <div className="absolute inset-0 xt-shimmer-overlay" style={{opacity: scheme==='dark'?1:0.4}}/>
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="xt-btn">
              <AppIcon gradient={`linear-gradient(135deg, ${C.green}, ${C.cyan})`} active size={28}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill={C.iconBg}/>
                </svg>
              </AppIcon>
            </div>
            <div>
              <div style={{fontFamily:FONT.display,fontSize:14,fontWeight:600,letterSpacing:'-0.3px',color:C.primary, ...neonText(C.cyan, C.scheme)}}> XAUTRADER</div>
              <div style={{color:C.tertiary,fontSize:10,fontFamily:FONT.mono,marginTop:-1,fontVariantNumeric:'tabular-nums'}}>{timeStr} · {accounts.find(a=>a.id===activeAccount)?.broker || 'VT MARKETS'}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Cooldown banner */}
            {cooldownOn && (
              <div className="flex items-center gap-1 px-2 py-1" style={{
                background:`${C.red}18`, border:`0.5px solid ${C.red}50`,
                borderRadius:RADIUS.pill,
              }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={C.red} strokeWidth="2"/><path d="M12 7v5l3 3" stroke={C.red} strokeWidth="2" strokeLinecap="round"/></svg>
                <span style={{color:C.red,fontSize:10,fontFamily:FONT.mono,fontWeight:600}}>Pausa</span>
              </div>
            )}
            {/* Daily lock banner */}
            {dailyLock.reached && (
              <div className="flex items-center gap-1 px-2 py-1" style={{
                background:`${C.green}18`, border:`0.5px solid ${C.green}50`,
                borderRadius:RADIUS.pill,
              }}>
                <Check size={9} strokeWidth={3} style={{color:C.green}}/>
                <span style={{color:C.green,fontSize:10,fontFamily:FONT.mono,fontWeight:600}}>Target</span>
              </div>
            )}
            {streak.streak > 0 && (
              <div className="xt-btn flex items-center gap-1.5 px-2.5 py-1" style={{
                background: C.glass2, backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
                border: `0.5px solid ${streak.isWin ? C.green : C.red}40`, borderRadius: RADIUS.pill,
              }}>
                <Flame size={11} style={{color:streak.isWin?C.green:C.red}} strokeWidth={2.5}/>
                <span style={{color:streak.isWin?C.green:C.red,fontSize:11,fontFamily:FONT.mono,fontWeight:600}}>
                  {streak.streak}{streak.isWin?'W':'L'}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-2.5 py-1" style={{
              background: C.glass2, backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
              border: `0.5px solid ${C.sep}`, borderRadius: RADIUS.pill,
            }}>
              <div className="w-1.5 h-1.5 rounded-full xt-live-dot" style={{background:C.green}}/>
              <span style={{color:C.secondary,fontSize:11,fontFamily:FONT.text,fontWeight:500}}>Live</span>
            </div>
            {/* Dark mode toggle pill */}
            <button onClick={()=>setSchemeOverride(scheme==='dark'?'light':'dark')} className="xt-btn" style={{
              width:30, height:30, borderRadius:15,
              background: C.glass2, border:`0.5px solid ${C.sep}`,
              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              {scheme === 'dark'
                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" fill={C.yellow}/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke={C.yellow} strokeWidth="2" strokeLinecap="round"/></svg>
                : <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill={C.secondary}/></svg>
              }
            </button>
            {/* Gear / Settings */}
            <button onClick={()=>setSettingsOpen(true)} className="xt-btn" style={{
              width:30, height:30, borderRadius:15,
              background: C.glass2, border:`0.5px solid ${C.sep}`,
              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke={C.secondary} strokeWidth="1.8"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke={C.secondary} strokeWidth="1.8"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* PAGER — una sola tab alla volta, nessuno scroll nel vuoto */}
      <div style={{ width:'100%' }}>
        <div className="max-w-7xl mx-auto px-5 py-6 pb-32">
          {TAB_ORDER[tabIdx] === 'daily'    && <DailyView    C={C} now={now} settings={settings} trades={[]}/>}
          {TAB_ORDER[tabIdx] === 'temporal' && <TemporalView C={C} trades={[]} equity={[]}/>}
          {TAB_ORDER[tabIdx] === 'stats'    && <StatsView    C={C} trades={[]}/>}
        </div>
      </div>

      {/* BOTTOM TAB BAR */}
      <div className="fixed left-1/2 z-50" style={{
        transform: 'translateX(-50%)',
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
      }}>
        <div style={{
          background: C.glassBar,
          backdropFilter: 'saturate(200%) blur(52px)',
          WebkitBackdropFilter: 'saturate(200%) blur(52px)',
          border: `0.5px solid ${C.sep2}`,
          borderRadius: 36,
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          boxShadow: scheme === 'dark'
            ? '0 14px 44px rgba(0,0,0,0.70), 0 0 0 0.5px rgba(255,255,255,0.05) inset'
            : '0 14px 44px rgba(0,0,0,0.20), 0 0 0 0.5px rgba(255,255,255,0.55) inset',
        }}>
          {tabs.map((t, i) => {
            const active = tabIdx === i;
            const Icon = icons[t.id]?.glyph;
            const grad = icons[t.id]?.gradient;
            return (
              <button key={t.id} onClick={() => handleTabTap(i)}
                      className="xt-tab-btn flex items-center gap-2"
                      style={{
                        padding: active ? '7px 18px 7px 8px' : '7px 14px',
                        borderRadius: 30,
                        background: active ? (scheme==='dark'?'rgba(255,255,255,0.09)':'rgba(0,0,0,0.06)') : 'transparent',
                        border: 'none', cursor: 'pointer',
                      }}>
                <div className="xt-tab-icon">
                  {Icon && grad ? (
                    <AppIcon gradient={grad} active={active} size={32}>
                      <Icon color={C.iconBg}/>
                    </AppIcon>
                  ) : (
                    <div style={{width:32,height:32,borderRadius:10,background:active?`linear-gradient(135deg,${C.orange},${C.pink})`:`${C.glass2}`,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.25s'}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" stroke={active?C.iconBg:C.tertiary} strokeWidth="1.8" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
                {active && (
                  <span style={{
                    fontSize: 14, fontFamily: FONT.text, fontWeight: 600,
                    color: C.primary, letterSpacing: '-0.2px', paddingRight: 4,
                  }}>{t.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
