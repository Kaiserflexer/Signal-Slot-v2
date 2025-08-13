import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const REELS = 5;
const ROWS = 3;
const SPIN_TIME_MS = 1400;
const REEL_STAGGER_MS = 180;
const RANDOMIZE_INTERVAL_MS = 90;

const phrases = [
  "Связь на 🔥!",
  "Патчкорды — в атаку!",
  "Пінгуй — не шкодуй!",
  "VLAN-ы по місцях!",
  "Пакеты пошли!",
  "Мікротик ожив!",
  "Сигнал як по оптиці!",
];

const IconRJ45 = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8">
    <rect x="4" y="8" width="24" height="16" rx="3" className="fill-current opacity-80" />
    <rect x="8" y="12" width="16" height="6" className="fill-black/40" />
    <g className="fill-black/60">
      <rect x="9" y="13" width="2" height="4" />
      <rect x="12" y="13" width="2" height="4" />
      <rect x="15" y="13" width="2" height="4" />
      <rect x="18" y="13" width="2" height="4" />
      <rect x="21" y="13" width="2" height="4" />
    </g>
  </svg>
);
const IconRouter = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8">
    <rect x="6" y="14" width="20" height="10" rx="2" className="fill-current opacity-80" />
    <circle cx="12" cy="19" r="1.5" className="fill-black/60" />
    <circle cx="16" cy="19" r="1.5" className="fill-black/60" />
    <circle cx="20" cy="19" r="1.5" className="fill-black/60" />
    <path d="M8 12c4-6 12-6 16 0" className="stroke-current" strokeWidth="2" fill="none" />
  </svg>
);
const IconDish = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8">
    <path d="M8 24c8 0 16-8 16-16" className="stroke-current" strokeWidth="3" fill="none" />
    <circle cx="24" cy="8" r="2" className="fill-current" />
    <line x1="23" y1="9" x2="28" y2="28" className="stroke-current" strokeWidth="2" />
  </svg>
);
const IconStarlink = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8">
    <path d="M4 20c8-10 16-10 24-8" className="stroke-current" strokeWidth="2" fill="none" />
    <circle cx="14" cy="20" r="3" className="fill-current opacity-80" />
    <rect x="12.5" y="22.5" width="3" height="6" className="fill-current opacity-80" />
  </svg>
);
const IconCoil = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8">
    <circle cx="16" cy="16" r="10" className="stroke-current" strokeWidth="3" fill="none" />
    <circle cx="16" cy="16" r="6" className="stroke-current" strokeWidth="3" fill="none" />
  </svg>
);
const IconRepeater = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8">
    <rect x="7" y="10" width="18" height="12" rx="2" className="fill-current opacity-80" />
    <path d="M10 16h12" className="stroke-black/60" strokeWidth="3" />
    <path d="M12 8c2-4 6-4 8 0" className="stroke-current" strokeWidth="2" fill="none" />
  </svg>
);
const IconWild = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8">
    <polygon points="16,2 20,12 31,12 22,18 26,29 16,22 6,29 10,18 1,12 12,12" className="fill-current" />
  </svg>
);
const IconScatter = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8">
    <circle cx="16" cy="16" r="10" className="fill-current opacity-80" />
    <circle cx="16" cy="16" r="4" className="fill-black/50" />
  </svg>
);

const SYMBOLS = [
  { id: "rj45", label: "RJ-45", Icon: IconRJ45, payout: { 3: 10, 4: 30, 5: 80 } },
  { id: "router", label: "Мікротик", Icon: IconRouter, payout: { 3: 15, 4: 50, 5: 150 } },
  { id: "dish", label: "Антена", Icon: IconDish, payout: { 3: 12, 4: 40, 5: 120 } },
  { id: "starlink", label: "Starlink", Icon: IconStarlink, payout: { 3: 14, 4: 45, 5: 130 } },
  { id: "cable", label: "Бухта", Icon: IconCoil, payout: { 3: 8, 4: 25, 5: 70 } },
  { id: "repeater", label: "Ретранс", Icon: IconRepeater, payout: { 3: 10, 4: 30, 5: 90 } },
  { id: "wild", label: "WILD", Icon: IconWild, wild: true },
  { id: "scatter", label: "SCATTER", Icon: IconScatter, scatter: true },
];

const WEIGHTS = { rj45:0.18, router:0.14, dish:0.12, starlink:0.12, cable:0.11, repeater:0.11, wild:0.12, scatter:0.10 };

const PAYLINES = [
  [1,1,1,1,1],
  [0,0,0,0,0],
  [2,2,2,2,2],
  [0,1,2,1,0],
  [2,1,0,1,2],
  [0,0,1,2,2],
  [2,2,1,0,0],
  [1,0,1,2,1],
  [1,2,1,0,1],
  [0,1,1,1,0],
];

function weightedPull() {
  const r = Math.random();
  let acc = 0;
  for (const s of SYMBOLS) {
    const w = WEIGHTS[s.id] ?? 0;
    acc += w;
    if (r <= acc) return s;
  }
  return SYMBOLS[0];
}

function generateSpin() {
  const grid = Array.from({ length: ROWS }, () => []);
  for (let col = 0; col < REELS; col++) {
    for (let row = 0; row < ROWS; row++) {
      grid[row][col] = weightedPull();
    }
  }
  return grid;
}

function bestBaseSymbolId() {
  const sorted = SYMBOLS
    .filter((s) => !s.wild && !s.scatter)
    .sort((a, b) => ((b.payout && b.payout[5]) || 0) - ((a.payout && a.payout[5]) || 0));
  return sorted[0].id;
}

function evaluateAll(grid, lineBet, activeLinesCount) {
  let totalWin = 0;
  const lineWins = [];
  const active = PAYLINES.slice(0, activeLinesCount);
  active.forEach((pattern, idx) => {
    const seq = pattern.map((rowIndex, col) => grid[rowIndex][col]);
    let base = seq.find((cell) => !cell.wild && !cell.scatter);
    if (!base) base = SYMBOLS.find((s) => s.id === bestBaseSymbolId());
    let match = 0;
    for (let i = 0; i < seq.length; i++) {
      const cell = seq[i];
      if (cell.scatter) break;
      if (cell.id === base.id || cell.wild) match++;
      else break;
    }
    if (match >= 3) {
      const mult = (base.payout && base.payout[Math.min(match, 5)]) || 0;
      const amount = mult * lineBet;
      totalWin += amount;
      lineWins.push({ index: idx, amount, matchLen: match });
    }
  });
  let scatterCount = 0;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < REELS; c++) if (grid[r][c].scatter) scatterCount++;
  const bonus = scatterCount >= 3;
  return { totalWin, lineWins, bonus, scatterCount };
}

const BOX_W = 1000, BOX_H = 600;
function cellCenter(col, row) {
  const colW = BOX_W / REELS;
  const rowH = BOX_H / ROWS;
  return { x: col * colW + colW / 2, y: row * rowH + rowH / 2 };
}
function polyPoints(pattern) {
  const pts = [];
  for (let c = 0; c < REELS; c++) {
    const { x, y } = cellCenter(c, pattern[c]);
    pts.push(`${x},${y}`);
  }
  return pts.join(" ");
}

export default function App() {
  const [grid, setGrid] = useState(() => generateSpin());
  const [spinning, setSpinning] = useState(false);
  const [coins, setCoins] = useState(1000);
  const [lines, setLines] = useState(10);
  const [lineBet, setLineBet] = useState(2);
  const totalBet = useMemo(() => lines * lineBet, [lines, lineBet]);

  const [lastPhrase, setLastPhrase] = useState(null);
  const [lastWin, setLastWin] = useState(0);
  const [lineWins, setLineWins] = useState([]);
  const [showBonus, setShowBonus] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [message, setMessage] = useState(null);

  const finalGridRef = useRef(null);
  const frozenColsRef = useRef(Array(REELS).fill(false));
  const rafRef = useRef(0);
  const lastRndUpdateRef = useRef(0);

  const tick = (t) => {
    if (!lastRndUpdateRef.current || t - lastRndUpdateRef.current > RANDOMIZE_INTERVAL_MS) {
      setGrid((prev) => {
        const next = prev.map((row) => row.slice());
        for (let c = 0; c < REELS; c++) {
          if (frozenColsRef.current[c]) {
            for (let r = 0; r < ROWS; r++) next[r][c] = finalGridRef.current[r][c];
          } else {
            for (let r = 0; r < ROWS; r++) next[r][c] = weightedPull();
          }
        }
        return next;
      });
      lastRndUpdateRef.current = t;
    }
    if (frozenColsRef.current.every(Boolean)) return;
    rafRef.current = requestAnimationFrame(tick);
  };

  const spin = async () => {
    if (spinning) return;
    if (coins < totalBet) { setMessage("Недостаточно монеток для спина"); return; }
    setMessage(null);
    setSpinning(true);
    setLastWin(0);
    setLineWins([]);
    setShowBonus(false);
    setShowCongrats(false);
    setLastPhrase(null);
    setCoins((b) => b - totalBet);
    finalGridRef.current = generateSpin();
    frozenColsRef.current = Array(REELS).fill(false);
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    for (let c = 0; c < REELS; c++) {
      await new Promise((res) => setTimeout(res, c * REEL_STAGGER_MS + SPIN_TIME_MS));
      frozenColsRef.current[c] = true;
      setGrid((prev) => {
        const next = prev.map((row) => row.slice());
        for (let r = 0; r < ROWS; r++) next[r][c] = finalGridRef.current[r][c];
        return next;
      });
      if (c === REELS - 1) {
        setTimeout(() => {
          cancelAnimationFrame(rafRef.current);
          const res = evaluateAll(finalGridRef.current, lineBet, lines);
          setLineWins(res.lineWins);
          setLastWin(res.totalWin);
          if (res.totalWin > 0) {
            setCoins((b) => b + res.totalWin);
            setLastPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
          }
          if (res.bonus) setShowBonus(true);
          setSpinning(false);
        }, 60);
      }
    }
  };

  const handleBonusPick = () => {
    const prizes = [
      { id: "mikrotik", label: "Новый MikroTik", value: 200 },
      { id: "antenna", label: "Антенна 5 ГГц", value: 180 },
      { id: "cable", label: "Бухта кабеля", value: 150 },
    ];
    const prize = prizes[Math.floor(Math.random() * prizes.length)];
    setCoins((b) => b + prize.value);
    setShowBonus(false);
    setShowCongrats(true);
  };

  const addFunds = () => setCoins((b) => b + 500);

  return (
    <div
      className="min-h-screen w-full text-neutral-100 flex items-start justify-center p-4 md:p-8"
      style={{ background: 'radial-gradient(ellipse at top, #171717 0%, #0b0b0b 60%, #000 100%)' }}
    >
      <div className="w-full max-w-5xl">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl md:text-3xl font-black tracking-tight">Взвод связи — слот (демо)</h1>
          <div className="flex items-center gap-3 text-sm md:text-base">
            <div className="px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700">Монеток: <span className="font-bold">{coins}</span></div>
            <div className="px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700">Линий: <span className="font-bold">{lines}</span></div>
            <div className="px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700">Ставка/линия: <span className="font-bold">{lineBet}</span></div>
            <PixelButton onClick={addFunds}>ПОПОЛНИТЬ</PixelButton>
          </div>
        </header>

        <div className="relative rounded-3xl p-3 md:p-4 border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 shadow-[0_0_80px_rgba(255,255,255,0.05)_inset] overflow-hidden">
          <div className="grid grid-cols-5 gap-2 md:gap-3 relative z-0">
            {Array.from({ length: REELS }).map((_, c) => (
              <div key={c} className="flex flex-col gap-2 md:gap-3">
                {Array.from({ length: ROWS }).map((__, r) => (
                  <motion.div
                    key={`${r}-${c}`}
                    initial={{ y: -10, opacity: 0 }}
                    animate={(!frozenColsRef.current[c] && spinning) ? { y: [-8, 8, -8] } : { y: 0, opacity: 1 }}
                    transition={(!frozenColsRef.current[c] && spinning) ? { duration: 0.35, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
                  >
                    <SymbolCell s={grid[r][c]} />
                  </motion.div>
                ))}
              </div>
            ))}
          </div>

          <SVGWins lineWins={lineWins} />
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm opacity-80">Выигрыш: <span className="font-bold text-yellow-300">{lastWin}</span> монеток</div>
            <div className="flex items-center gap-2 md:gap-3">
              <SelectSmall label="Линии" value={lines} setValue={(v)=>setLines(Math.min(10,Math.max(1,v)))} min={1} max={10} step={1} />
              <SelectSmall label="Ставка/л." value={lineBet} setValue={(v)=>setLineBet(Math.min(20,Math.max(1,v)))} min={1} max={20} step={1} />
              <button onClick={spin} disabled={spinning} className={`px-6 py-2 rounded-2xl font-black tracking-wide border ${spinning ? "bg-neutral-800 border-neutral-700 opacity-60" : "bg-yellow-400 text-black border-yellow-300 shadow-[0_8px_30px_rgba(255,238,88,0.35)] hover:brightness-105 active:brightness-95"}`}>
                {spinning ? "КРУТИМСЯ..." : `СТАРТ (${totalBet})`}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 h-10 flex items-center">
          <AnimatePresence mode="wait">
            {message && (
              <motion.div key={"msg"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="text-sm px-3 py-1 rounded-xl border border-neutral-700 bg-neutral-800">{message}</motion.div>
            )}
            {!message && lastPhrase && (
              <motion.div key={lastPhrase} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="text-xs md:text-sm px-3 py-1 rounded-xl border border-yellow-600 bg-yellow-400/10 text-yellow-200" style={{ imageRendering: "pixelated" }}>{lastPhrase}</motion.div>
            )}
          </AnimatePresence>
        </div>

        <BonusModals showBonus={showBonus} onPick={handleBonusPick} showCongrats={showCongrats} setShowCongrats={setShowCongrats} />
        
        <footer className="mt-6 text-xs opacity-60 space-y-1">
          <div>WILD заменяет любой символ на линии. Бонус запускается, если SCATTER выпал 3 раза или больше — в любых местах.</div>
          <div>Линии выплат слева направо. Нужно 3+ совпадения (WILD помогает). Выигрыши автоматически зачисляются на баланс.</div>
        </footer>
      </div>
    </div>
  );
}

function SVGWins({ lineWins }) {
  const BOX_W = 1000, BOX_H = 600;
  const PAYLINES = [
    [1,1,1,1,1],[0,0,0,0,0],[2,2,2,2,2],[0,1,2,1,0],[2,1,0,1,2],
    [0,0,1,2,2],[2,2,1,0,0],[1,0,1,2,1],[1,2,1,0,1],[0,1,1,1,0],
  ];
  function cellCenter(col, row) {
    const colW = BOX_W / 5; const rowH = BOX_H / 3;
    return { x: col * colW + colW / 2, y: row * rowH + rowH / 2 };
  }
  function polyPoints(pattern) {
    const pts = [];
    for (let c = 0; c < 5; c++) { const {x,y} = cellCenter(c, pattern[c]); pts.push(`${x},${y}`); }
    return pts.join(" ");
  }
  return (
    <svg className="absolute inset-3 md:inset-4 pointer-events-none z-10" viewBox={`0 0 ${BOX_W} ${BOX_H}`}>
      {lineWins.map((w, i) => (
        <g key={w.index + "-" + i}>
          <motion.polyline
            fill="none" stroke="rgba(250, 204, 21, 0.9)" strokeWidth={8} strokeLinejoin="round" strokeLinecap="round"
            strokeDasharray="18 14" initial={{ opacity: 0, strokeDashoffset: 120 }}
            animate={{ opacity: [0.2, 1, 0.6, 1], strokeDashoffset: [120, 0, 120, 0] }}
            transition={{ duration: 1.2, repeat: 2, ease: "easeInOut" }}
            points={polyPoints(PAYLINES[w.index])}
          />
          {(() => {
            const pattern = PAYLINES[w.index];
            const endCol = Math.min(w.matchLen - 1, 5 - 1);
            const endRow = pattern[endCol];
            const { x, y } = cellCenter(endCol, endRow);
            return (
              <motion.text x={x} y={y - 22} textAnchor="middle" fontSize="22"
                fill="rgb(250,204,21)" stroke="rgba(0,0,0,0.5)" strokeWidth="2"
                initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: [0.6, 1.15, 1], opacity: 1 }}
                transition={{ duration: 0.8 }}
              >+{w.amount}</motion.text>
            );
          })()}
        </g>
      ))}
    </svg>
  );
}

function SymbolCell({ s }) {
  if (!s) return <div className="flex items-center justify-center h-20 w-20 md:h-24 md:w-24 rounded-2xl border border-neutral-700 bg-neutral-800 text-neutral-400">?</div>;
  const isWild = s.wild; const isScatter = s.scatter; const Icon = s.Icon;
  return (
    <div className={`flex flex-col items-center justify-center h-20 w-20 md:h-24 md:w-24 rounded-2xl border border-neutral-700 bg-gradient-to-b from-neutral-900 to-neutral-800 shadow-inner ${isWild ? "ring-2 ring-yellow-400" : isScatter ? "ring-2 ring-pink-400" : ""}`}>
      <div className="opacity-90">{Icon ? <Icon /> : null}</div>
      <div className="text-[10px] md:text-xs mt-1 tracking-wide opacity-80">{s.label}</div>
      {isWild && <div className="text-[10px] md:text-[11px] font-black text-yellow-300">WILD</div>}
      {isScatter && <div className="text-[10px] md:text-[11px] font-black text-pink-300">SCATTER</div>}
    </div>
  );
}

function PixelButton({ children, onClick }) {
  return (
    <button onClick={onClick} className="relative select-none active:translate-y-[1px] px-4 py-2 text-black font-extrabold text-xs md:text-sm" style={{ imageRendering: "pixelated" }}>
      <span className="absolute inset-0 bg-yellow-400 rounded-none" />
      <span className="absolute inset-x-0 bottom-0 h-1 bg-yellow-500" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}

function BonusCard({ children, label, onPick }) {
  return (
    <button onClick={onPick} className="group relative overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-800 p-4 hover:bg-neutral-700 transition-colors">
      <div className="flex flex-col items-center gap-2">
        <div className="opacity-90">{children}</div>
        <div className="text-xs font-bold opacity-90">{label}</div>
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute -inset-16 rounded-full bg-yellow-400/10" animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
      </div>
    </button>
  );
}

function SelectSmall({ label, value, setValue, min, max, step }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs opacity-70">{label}</span>
      <div className="flex items-center">
        <button onClick={() => setValue(Math.max(min, value - step))} className="px-2 py-1 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700">−</button>
        <div className="w-10 text-center text-sm font-bold">{value}</div>
        <button onClick={() => setValue(Math.min(max, value + step))} className="px-2 py-1 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700">+</button>
      </div>
    </div>
  );
}

function BonusModals({ showBonus, onPick, showCongrats, setShowCongrats }) {
  return (<>
    <AnimatePresence>
      {showBonus && (
        <motion.div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="w-full max-w-lg rounded-3xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}>
            <h2 className="text-lg md:text-2xl font-black mb-4">Бонус! Выбери оборудование</h2>
            <div className="grid grid-cols-3 gap-3">
              <BonusCard label="Мікротик" onPick={onPick}><IconRouter /></BonusCard>
              <BonusCard label="Антенна" onPick={onPick}><IconDish /></BonusCard>
              <BonusCard label="Бухта кабеля" onPick={onPick}><IconCoil /></BonusCard>
            </div>
            <div className="mt-4 text-xs opacity-70">3+ SCATTER на поле — и приз ваш 🎁</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    <AnimatePresence>
      {showCongrats && (
        <motion.div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="w-full max-w-xl rounded-3xl border border-yellow-500/60 bg-neutral-900 p-8 shadow-[0_0_60px_rgba(250,204,21,0.2)] text-center" initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }}>
            <div className="text-2xl md:text-3xl font-black text-yellow-300 mb-3">Поздравляем! 🎉</div>
            <div className="text-base md:text-lg opacity-90 mb-6">Начальник связи все оплатит, ожидайте приз</div>
            <button onClick={() => setShowCongrats(false)} className="mx-auto px-6 py-3 rounded-2xl font-black bg-yellow-400 text-black border border-yellow-300 hover:brightness-105 active:brightness-95">Ок</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </>);
}

