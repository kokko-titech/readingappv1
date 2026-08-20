import { useMemo } from 'react';
import { GENRES } from '../data/genres';

function Cloud({ x, y, s = 30 }) {
  return (
    <g>
      <ellipse cx={x + 5} cy={y + 5} rx={s * 1.2} ry={s * 0.44} fill="rgba(140,180,220,0.22)" />
      <ellipse cx={x} cy={y} rx={s} ry={s * 0.56} fill="white" />
      <ellipse cx={x - s * 0.52} cy={y + s * 0.12} rx={s * 0.52} ry={s * 0.38} fill="white" />
      <ellipse cx={x + s * 0.52} cy={y + s * 0.12} rx={s * 0.52} ry={s * 0.38} fill="white" />
      <ellipse cx={x - s * 0.18} cy={y - s * 0.24} rx={s * 0.36} ry={s * 0.3} fill="white" />
      <ellipse cx={x + s * 0.18} cy={y - s * 0.24} rx={s * 0.36} ry={s * 0.3} fill="white" />
      <ellipse cx={x - s * 0.32} cy={y - s * 0.1} rx={s * 0.2} ry={s * 0.13} fill="rgba(255,255,255,0.75)" />
    </g>
  );
}

function BackTree({ x, y, h }) {
  const tw = h * 0.1;
  const top = y - h;
  const cr = h * 0.38;
  return (
    <g opacity="0.62">
      <ellipse cx={x + 4} cy={y + 4} rx={tw * 2.2} ry={5} fill="rgba(0,0,0,0.14)" />
      <rect x={x - tw / 2} y={top} width={tw} height={h} rx={tw / 2} fill="#78350f" />
      <ellipse cx={x + 3} cy={top + 8} rx={cr * 0.88} ry={cr * 0.78} fill="#14532d" />
      <ellipse cx={x} cy={top} rx={cr} ry={cr * 0.88} fill="#166534" />
      <ellipse cx={x - cr * 0.28} cy={top - cr * 0.22} rx={cr * 0.22} ry={cr * 0.15} fill="rgba(255,255,255,0.22)" />
    </g>
  );
}

function Flower({ x, y, color }) {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((a, i) => (
        <circle
          key={i}
          cx={x + Math.cos((a * Math.PI) / 180) * 5}
          cy={y + Math.sin((a * Math.PI) / 180) * 5}
          r={3.5}
          fill={color}
        />
      ))}
      <circle cx={x} cy={y} r={2.8} fill="#fef9c3" />
    </g>
  );
}

function MainTree({ stage, readBooks, cx, groundY }) {
  const sizes = [
    { trunkH: 0, trunkW: 0, cr: 0 },
    { trunkH: 68, trunkW: 17, cr: 54 },
    { trunkH: 108, trunkW: 23, cr: 76 },
    { trunkH: 148, trunkW: 30, cr: 98 },
    { trunkH: 188, trunkW: 36, cr: 122 },
  ];
  const { trunkH, trunkW, cr } = sizes[stage];
  const trunkTop = groundY - trunkH;
  const canopyY = trunkTop + 10;

  const favoriteCount = useMemo(() => readBooks.filter((b) => b.isFavorite).length, [readBooks]);
  const reviewCount = useMemo(() => readBooks.filter((b) => b.review?.length > 0).length, [readBooks]);

  if (stage === 0) {
    return (
      <g>
        <line x1={cx} y1={groundY} x2={cx} y2={groundY - 40} stroke="#16a34a" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx={cx - 13} cy={groundY - 38} rx={13} ry={9}
          fill="#4ade80" stroke="#16a34a" strokeWidth="1.5"
          transform={`rotate(-28,${cx - 13},${groundY - 38})`} />
        <ellipse cx={cx + 13} cy={groundY - 38} rx={13} ry={9}
          fill="#4ade80" stroke="#16a34a" strokeWidth="1.5"
          transform={`rotate(28,${cx + 13},${groundY - 38})`} />
        <ellipse cx={cx} cy={groundY - 52} rx={11} ry={13} fill="#22c55e" stroke="#16a34a" strokeWidth="1.5" />
      </g>
    );
  }

  return (
    <g>
      <ellipse cx={cx + 10} cy={groundY + 5} rx={trunkW * 2.4} ry={9} fill="rgba(0,0,0,0.2)" />

      <rect x={cx - trunkW / 2} y={trunkTop} width={trunkW} height={trunkH + 5} rx={trunkW / 2}
        fill="url(#trunk-grad)" stroke="#451a03" strokeWidth="1.5" />
      <rect x={cx - trunkW / 2 + 3} y={trunkTop + 14}
        width={Math.max(3, trunkW * 0.22)} height={trunkH * 0.52} rx={2}
        fill="rgba(255,255,255,0.26)" />

      <ellipse cx={cx + 12} cy={canopyY + 16} rx={cr * 0.9} ry={cr * 0.76} fill="#064e3b" opacity="0.52" />

      <ellipse cx={cx - cr * 0.6} cy={canopyY + cr * 0.2} rx={cr * 0.68} ry={cr * 0.6}
        fill="#059669" stroke="#047857" strokeWidth="2" />
      <ellipse cx={cx + cr * 0.62} cy={canopyY + cr * 0.24} rx={cr * 0.64} ry={cr * 0.56}
        fill="#047857" stroke="#065f46" strokeWidth="2" />

      <ellipse cx={cx} cy={canopyY} rx={cr} ry={cr * 0.9}
        fill="url(#canopy-grad)" stroke="#059669" strokeWidth="2.5" />

      <ellipse cx={cx - cr * 0.3} cy={canopyY - cr * 0.36} rx={cr * 0.28} ry={cr * 0.2}
        fill="rgba(255,255,255,0.34)" />

      {Array.from({ length: Math.min(favoriteCount, 10) }).map((_, fi) => {
        const a = (fi / Math.max(favoriteCount, 1)) * Math.PI * 2 - 0.4;
        const r = cr * (0.48 + (fi % 3) * 0.12);
        return (
          <g key={fi}>
            <circle cx={cx + Math.cos(a) * r} cy={canopyY + Math.sin(a) * r * 0.72} r={7}
              fill="#fda4af" stroke="#fb7185" strokeWidth="1.2" />
            <circle cx={cx + Math.cos(a) * r} cy={canopyY + Math.sin(a) * r * 0.72} r={2.8}
              fill="#fef3c7" />
          </g>
        );
      })}

      {Array.from({ length: Math.min(reviewCount, 8) }).map((_, ri) => {
        const a = (ri / Math.max(reviewCount, 1)) * Math.PI * 2 + 1.1;
        const r = cr * (0.44 + (ri % 3) * 0.1);
        return (
          <g key={ri}>
            <ellipse cx={cx + Math.cos(a) * r} cy={canopyY + cr * 0.1 + Math.sin(a) * r * 0.68}
              rx={6} ry={8} fill="#f87171" stroke="#ef4444" strokeWidth="1.2" />
            <ellipse cx={cx + Math.cos(a) * r - 1.5} cy={canopyY + cr * 0.1 + Math.sin(a) * r * 0.68 - 2}
              rx={2.2} ry={2} fill="rgba(255,255,255,0.42)" />
          </g>
        );
      })}
    </g>
  );
}

export default function ForestScene({ readBooks, onTreeTap }) {
  const count = readBooks.length;
  const stage = count >= 50 ? 4 : count >= 20 ? 3 : count >= 5 ? 2 : count >= 1 ? 1 : 0;
  const stageLabel = ['🌱 芽生え', '🌿 小木', '🌳 中木', '🌲 大樹', '🌲 大樹'][stage];

  return (
    <div
      className="relative w-full flex-1 overflow-hidden"
      style={{ minHeight: 290, cursor: 'pointer' }}
      onClick={onTreeTap}
    >
      <svg
        viewBox="0 0 360 290"
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#52bae8" />
            <stop offset="60%" stopColor="#aeddf6" />
            <stop offset="100%" stopColor="#c8f5d0" />
          </linearGradient>
          <linearGradient id="ground-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <linearGradient id="trunk-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7c2d12" />
            <stop offset="35%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <radialGradient id="canopy-grad" cx="35%" cy="28%" r="68%">
            <stop offset="0%" stopColor="#a7f3d0" />
            <stop offset="38%" stopColor="#34d399" />
            <stop offset="72%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064e3b" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="360" height="225" fill="url(#sky-grad)" />

        <circle cx="320" cy="50" r="36" fill="#fef08a" opacity="0.88" />
        <circle cx="320" cy="50" r="29" fill="#fde047" />
        <ellipse cx="310" cy="42" rx="10" ry="7" fill="rgba(255,255,255,0.45)" />

        <Cloud x={78} y={62} s={32} />
        <Cloud x={255} y={40} s={24} />
        <Cloud x={172} y={80} s={18} />

        <ellipse cx="58" cy="228" rx="115" ry="40" fill="#86efac" opacity="0.52" />
        <ellipse cx="312" cy="232" rx="98" ry="35" fill="#86efac" opacity="0.44" />

        <BackTree x={40} y={218} h={88} />
        <BackTree x={320} y={218} h={74} />
        <BackTree x={18} y={218} h={56} />
        <BackTree x={342} y={218} h={52} />

        <rect x="0" y="216" width="360" height="74" fill="url(#ground-grad)" />
        <path d="M0,216 Q45,208 90,216 Q135,224 180,216 Q225,208 270,216 Q315,224 360,216 L360,224 Q315,232 270,224 Q225,216 180,224 Q135,232 90,224 Q45,216 0,224 Z" fill="#4ade80" opacity="0.72" />

        <Flower x={28} y={228} color="#fda4af" />
        <Flower x={58} y={234} color="#fde68a" />
        <Flower x={100} y={230} color="#c4b5fd" />
        <Flower x={270} y={232} color="#a5f3fc" />
        <Flower x={302} y={228} color="#fda4af" />
        <Flower x={334} y={234} color="#fde68a" />

        <MainTree stage={stage} readBooks={readBooks} cx={180} groundY={216} />

        <rect x={128} y={254} width={104} height={28} rx="14" fill="rgba(0,0,0,0.22)" />
        <rect x={126} y={252} width={104} height={28} rx="14" fill="white" />
        <text x={178} y={270} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#15803d">
          {stageLabel}
        </text>
        <text x={178} y={284} textAnchor="middle" fontSize="11" fill="#6b7280">
          {count}冊読了
        </text>
      </svg>
    </div>
  );
}
