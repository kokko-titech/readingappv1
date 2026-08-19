import { useMemo } from 'react';
import { GENRES } from '../data/genres';

function TreeSVG({ readBooks }) {
  const count = readBooks.length;
  const stage = count >= 50 ? 'large' : count >= 20 ? 'medium' : count >= 5 ? 'small' : 'seed';

  // Build genre branch data
  const genreCounts = useMemo(() => {
    const c = {};
    readBooks.forEach((b) => {
      c[b.genre] = (c[b.genre] || 0) + 1;
    });
    return c;
  }, [readBooks]);

  const favoriteCount = readBooks.filter((b) => b.isFavorite).length;
  const reviewCount = readBooks.filter((b) => b.review && b.review.length > 0).length;

  const trunkH = stage === 'large' ? 160 : stage === 'medium' ? 120 : stage === 'small' ? 80 : 40;
  const trunkW = stage === 'large' ? 22 : stage === 'medium' ? 16 : stage === 'small' ? 12 : 8;

  const branches = useMemo(() => {
    if (stage === 'seed') return [];
    return Object.entries(genreCounts).map(([genre, cnt], i) => {
      const angle = -60 + (i % 2 === 0 ? -1 : 1) * (30 + i * 15);
      const length = Math.min(20 + cnt * 8, 80);
      return { genre, cnt, angle, length };
    });
  }, [genreCounts, stage]);

  const cx = 120;
  const groundY = 220;
  const trunkX = cx;
  const trunkTop = groundY - trunkH;

  return (
    <svg viewBox="0 0 240 240" className="w-full h-full" style={{ overflow: 'visible' }}>
      {/* Canopy glow */}
      {stage !== 'seed' && (
        <ellipse
          cx={cx}
          cy={trunkTop - 20}
          rx={trunkH * 0.6 + 10}
          ry={trunkH * 0.5 + 5}
          fill="rgba(134,239,172,0.15)"
        />
      )}

      {/* Branches */}
      {branches.map(({ genre, cnt, angle, length }, i) => {
        const rad = (angle * Math.PI) / 180;
        const bx = trunkX + Math.cos(rad) * length;
        const by = trunkTop + 20 + Math.sin(rad) * length * 0.7;
        const color = GENRES[genre]?.color || '#94a3b8';
        return (
          <g key={genre}>
            <line
              x1={trunkX}
              y1={trunkTop + 20}
              x2={bx}
              y2={by}
              stroke={color}
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Flowers for favorites */}
            {Array.from({ length: Math.min(favoriteCount, 4) }).map((_, fi) => (
              <circle
                key={fi}
                cx={bx + fi * 6 - 9}
                cy={by - 6}
                r="5"
                fill="#fda4af"
                opacity="0.9"
              />
            ))}
            {/* Fruits for reviews */}
            {Array.from({ length: Math.min(reviewCount, 3) }).map((_, ri) => (
              <ellipse
                key={ri}
                cx={bx + ri * 8 - 8}
                cy={by + 6}
                rx="4"
                ry="5"
                fill="#86efac"
              />
            ))}
          </g>
        );
      })}

      {/* Trunk */}
      {stage !== 'seed' ? (
        <>
          <rect
            x={trunkX - trunkW / 2}
            y={trunkTop}
            width={trunkW}
            height={trunkH}
            rx={trunkW / 2}
            fill="#92400e"
          />
          {/* Wood grain lines */}
          {Array.from({ length: 3 }).map((_, i) => (
            <line
              key={i}
              x1={trunkX - trunkW / 2 + 3}
              y1={trunkTop + 20 + i * 30}
              x2={trunkX + trunkW / 2 - 3}
              y2={trunkTop + 25 + i * 30}
              stroke="#78350f"
              strokeWidth="1"
              opacity="0.4"
            />
          ))}
          {/* Leaves canopy */}
          <ellipse
            cx={cx}
            cy={trunkTop - 10}
            rx={trunkH * 0.5}
            ry={trunkH * 0.4}
            fill="#22c55e"
          />
          <ellipse
            cx={cx - 20}
            cy={trunkTop}
            rx={trunkH * 0.35}
            ry={trunkH * 0.3}
            fill="#16a34a"
          />
          <ellipse
            cx={cx + 20}
            cy={trunkTop + 5}
            rx={trunkH * 0.35}
            ry={trunkH * 0.3}
            fill="#15803d"
          />
        </>
      ) : (
        /* Sprout */
        <>
          <line x1={cx} y1={groundY} x2={cx} y2={groundY - 30} stroke="#16a34a" strokeWidth="3" />
          <ellipse cx={cx - 8} cy={groundY - 28} rx="7" ry="5" fill="#4ade80" transform="rotate(-30, 112, 192)" />
          <ellipse cx={cx + 8} cy={groundY - 28} rx="7" ry="5" fill="#4ade80" transform="rotate(30, 128, 192)" />
          <ellipse cx={cx} cy={groundY - 38} rx="6" ry="8" fill="#22c55e" />
        </>
      )}

      {/* Stage label */}
      <text x={cx} y={groundY + 16} textAnchor="middle" fontSize="10" fill="#6b7280">
        {stage === 'seed' && '🌱 芽生え'}
        {stage === 'small' && '🌿 小木'}
        {stage === 'medium' && '🌳 中木'}
        {stage === 'large' && '🌲 大樹'}
      </text>
      <text x={cx} y={groundY + 28} textAnchor="middle" fontSize="9" fill="#9ca3af">
        {count}冊読了
      </text>
    </svg>
  );
}

function Cloud({ x, y, size = 1 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${size})`} opacity="0.85">
      <ellipse cx="0" cy="0" rx="20" ry="12" fill="white" />
      <ellipse cx="-14" cy="3" rx="13" ry="9" fill="white" />
      <ellipse cx="14" cy="3" rx="13" ry="9" fill="white" />
    </g>
  );
}

export default function ForestScene({ readBooks, onTreeTap }) {
  return (
    <div className="relative w-full flex-1 overflow-hidden" style={{ minHeight: 220 }}>
      {/* Sky */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #bfdbfe 0%, #dbeafe 40%, #f0fdf4 100%)',
        }}
      />
      {/* Clouds */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 390 220" preserveAspectRatio="xMidYMid slice">
        <Cloud x={60} y={40} size={1.1} />
        <Cloud x={300} y={28} size={0.8} />
        <Cloud x={200} y={55} size={0.6} />
      </svg>

      {/* Ground line */}
      <div className="absolute bottom-0 left-0 right-0 h-8 rounded-t-3xl" style={{ background: '#86efac' }} />

      {/* Tree */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer"
        style={{ width: 160, height: 200 }}
        onClick={onTreeTap}
      >
        <TreeSVG readBooks={readBooks} />
      </div>
    </div>
  );
}
