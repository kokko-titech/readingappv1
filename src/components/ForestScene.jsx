import { useMemo } from 'react';
import { GENRES } from '../data/genres';

function seededRand(seed) {
  let s = Math.abs(seed % 2147483647) || 1;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function bezierPoint(t, p0, p1, p2) {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  };
}

function getTreeScale(count) {
  if (count === 0) return 0.32;
  if (count < 3)  return 0.44;
  if (count < 7)  return 0.58;
  if (count < 15) return 0.73;
  if (count < 30) return 0.87;
  return 1.0;
}

function Cloud({ x, y, s = 30 }) {
  return (
    <g>
      <ellipse cx={x + 5} cy={y + 5} rx={s * 1.2} ry={s * 0.44} fill="rgba(140,180,220,0.22)" />
      <ellipse cx={x} cy={y} rx={s} ry={s * 0.56} fill="white" />
      <ellipse cx={x - s * 0.52} cy={y + s * 0.12} rx={s * 0.52} ry={s * 0.38} fill="white" />
      <ellipse cx={x + s * 0.52} cy={y + s * 0.12} rx={s * 0.52} ry={s * 0.38} fill="white" />
      <ellipse cx={x - s * 0.18} cy={y - s * 0.24} rx={s * 0.36} ry={s * 0.3} fill="white" />
      <ellipse cx={x + s * 0.18} cy={y - s * 0.24} rx={s * 0.36} ry={s * 0.3} fill="white" />
    </g>
  );
}

function BackTree({ x, y, h }) {
  const tw = h * 0.1;
  const top = y - h;
  const cr = h * 0.38;
  return (
    <g opacity="0.55">
      <rect x={x - tw / 2} y={top} width={tw} height={h} rx={tw / 2} fill="#78350f" />
      <ellipse cx={x} cy={top} rx={cr} ry={cr * 0.88} fill="#166534" />
    </g>
  );
}

function Flower({ x, y, color }) {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((a, i) => (
        <circle key={i}
          cx={x + Math.cos((a * Math.PI) / 180) * 5}
          cy={y + Math.sin((a * Math.PI) / 180) * 5}
          r={3.5} fill={color} />
      ))}
      <circle cx={x} cy={y} r={2.8} fill="#fef9c3" />
    </g>
  );
}

const GENRE_KEYS = Object.keys(GENRES);

const BRANCH_SLOTS = [
  { h: 0.38, angle: 148, len: 80, thick: 5.5 },
  { h: 0.44, angle: 35,  len: 76, thick: 5.0 },
  { h: 0.56, angle: 136, len: 86, thick: 4.4 },
  { h: 0.62, angle: 44,  len: 82, thick: 4.0 },
  { h: 0.72, angle: 128, len: 90, thick: 3.4 },
  { h: 0.78, angle: 52,  len: 86, thick: 3.0 },
  { h: 0.88, angle: 118, len: 78, thick: 2.4 },
];

const SLOT_GENRE_MAP = [6, 5, 4, 3, 2, 1, 0];

function GenreBranch({ slot, books, cx, trunkTop, trunkH, scale, onBookTap }) {
  const genreKey = slot.genreKey;
  const genre = GENRES[genreKey];
  const leafColor = genre.color;
  const darkLeafColor = genre.darkColor;

  const len = slot.len * scale;
  const thick = Math.max(0.7, slot.thick * scale);

  const rootY = trunkTop + trunkH * (1 - slot.h);
  const rootX = cx;

  const rad = (slot.angle * Math.PI) / 180;
  const tipX = rootX + Math.cos(rad) * len;
  const tipY = rootY - Math.sin(rad) * len * 0.72;

  const ctrlX = rootX + Math.cos(rad) * len * 0.42;
  const ctrlY = rootY - Math.sin(rad) * len * 0.18 - 18 * scale;

  const p1 = bezierPoint(0.55, { x: rootX, y: rootY }, { x: ctrlX, y: ctrlY }, { x: tipX, y: tipY });
  const p2 = bezierPoint(0.78, { x: rootX, y: rootY }, { x: ctrlX, y: ctrlY }, { x: tipX, y: tipY });

  const isLeft = slot.angle > 90;
  const fork1Angle = rad + (isLeft ? 0.4 : -0.4);
  const fork2Angle = rad + (isLeft ? -0.35 : 0.35);
  const subLen1 = len * 0.44;
  const subLen2 = len * 0.38;

  const s1tip = { x: p1.x + Math.cos(fork1Angle) * subLen1, y: p1.y - Math.sin(fork1Angle) * subLen1 * 0.7 };
  const s2tip = { x: p2.x + Math.cos(fork2Angle) * subLen2, y: p2.y - Math.sin(fork2Angle) * subLen2 * 0.7 };

  const leaves = useMemo(() => {
    return books.map((book, i) => {
      const r = seededRand(GENRE_KEYS.indexOf(genreKey) * 9999 + i * 137 + 7);
      const which = r();
      const t = 0.3 + r() * 0.66;
      let bp;
      if (which < 0.5) {
        bp = bezierPoint(t, { x: rootX, y: rootY }, { x: ctrlX, y: ctrlY }, { x: tipX, y: tipY });
      } else if (which < 0.75) {
        bp = { x: p1.x + Math.cos(fork1Angle) * subLen1 * t, y: p1.y - Math.sin(fork1Angle) * subLen1 * t * 0.7 };
      } else {
        bp = { x: p2.x + Math.cos(fork2Angle) * subLen2 * t, y: p2.y - Math.sin(fork2Angle) * subLen2 * t * 0.7 };
      }
      const spread = (4 + r() * 7) * scale;
      return {
        x: bp.x + (r() - 0.5) * spread,
        y: bp.y + (r() - 0.5) * spread * 0.6 - 3 * scale,
        rot: r() * 360,
        rx: (3 + r() * 3) * scale,
        ry: (4.5 + r() * 4.5) * scale,
        dark: r() < 0.35,
        book,
      };
    });
  }, [books, genreKey, rootX, rootY, ctrlX, ctrlY, tipX, tipY, p1.x, p1.y, p2.x, p2.y, fork1Angle, fork2Angle, subLen1, subLen2, scale]);

  const branchColor = '#6b3a1f';
  const branchStroke = '#3d1f0a';
  const bookCount = books.length;

  return (
    <g>
      <path d={`M ${rootX} ${rootY} Q ${ctrlX} ${ctrlY} ${tipX} ${tipY}`}
        fill="none" stroke={branchStroke} strokeWidth={thick + 1} strokeLinecap="round" />
      <path d={`M ${rootX} ${rootY} Q ${ctrlX} ${ctrlY} ${tipX} ${tipY}`}
        fill="none" stroke={branchColor} strokeWidth={thick} strokeLinecap="round" />

      <path d={`M ${p1.x} ${p1.y} L ${s1tip.x} ${s1tip.y}`}
        fill="none" stroke={branchStroke} strokeWidth={thick * 0.48 + 0.5} strokeLinecap="round" />
      <path d={`M ${p1.x} ${p1.y} L ${s1tip.x} ${s1tip.y}`}
        fill="none" stroke={branchColor} strokeWidth={thick * 0.45} strokeLinecap="round" />

      <path d={`M ${p2.x} ${p2.y} L ${s2tip.x} ${s2tip.y}`}
        fill="none" stroke={branchStroke} strokeWidth={thick * 0.4 + 0.4} strokeLinecap="round" />
      <path d={`M ${p2.x} ${p2.y} L ${s2tip.x} ${s2tip.y}`}
        fill="none" stroke={branchColor} strokeWidth={thick * 0.38} strokeLinecap="round" />

      {leaves.map((leaf, i) => (
        <ellipse key={i}
          cx={leaf.x} cy={leaf.y}
          rx={Math.max(2, leaf.rx)} ry={Math.max(3, leaf.ry)}
          fill={leaf.dark ? darkLeafColor : leafColor}
          opacity={0.88}
          transform={`rotate(${leaf.rot}, ${leaf.x}, ${leaf.y})`}
          style={{ cursor: 'pointer' }}
          onClick={e => { e.stopPropagation(); onBookTap?.(leaf.book); }}
        />
      ))}

      {bookCount > 0 && scale >= 0.55 && (
        <text
          x={tipX + (isLeft ? -8 : 8)} y={tipY - 4}
          textAnchor={isLeft ? 'end' : 'start'}
          fontSize={Math.max(6, 7.5 * scale)} fontWeight="bold" fill={darkLeafColor}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {genre.emoji} {bookCount}
        </text>
      )}
    </g>
  );
}

export default function ForestScene({ readBooks, onTreeTap, onSignTap, onShelfTap, onBookTap }) {
  const count = readBooks.length;
  const scale = getTreeScale(count);

  const booksByGenre = useMemo(() => {
    const groups = {};
    GENRE_KEYS.forEach(k => { groups[k] = []; });
    readBooks.forEach(b => {
      if (groups[b.genre]) groups[b.genre].push(b);
      else groups['other'].push(b);
    });
    return groups;
  }, [readBooks]);

  const cx = 180;
  const groundY = 340;
  const trunkH = Math.round(230 * scale);
  const trunkTop = groundY - trunkH;
  const baseW = Math.max(6, Math.round(28 * scale));
  const topW = Math.max(3, Math.round(8 * scale));

  const trunkPath = [
    `M ${cx - baseW} ${groundY}`,
    `C ${cx - baseW} ${groundY - trunkH * 0.3} ${cx - topW * 1.1} ${trunkTop + Math.max(8, 40 * scale)} ${cx - topW} ${trunkTop}`,
    `L ${cx + topW} ${trunkTop}`,
    `C ${cx + topW * 1.1} ${trunkTop + Math.max(8, 40 * scale)} ${cx + baseW} ${groundY - trunkH * 0.3} ${cx + baseW} ${groundY}`,
    'Z',
  ].join(' ');

  const signY = trunkTop + trunkH * 0.45;
  const shelfY = groundY - 3;

  return (
    <div
      className="relative w-full flex-1 overflow-hidden"
      style={{ minHeight: 360, cursor: 'pointer' }}
      onClick={onTreeTap}
    >
      <svg
        viewBox="0 0 360 380"
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
        </defs>

        <rect x="0" y="0" width="360" height="345" fill="url(#sky-grad)" />
        <circle cx="316" cy="52" r="34" fill="#fef08a" opacity="0.88" />
        <circle cx="316" cy="52" r="27" fill="#fde047" />
        <ellipse cx="306" cy="44" rx="9" ry="6" fill="rgba(255,255,255,0.45)" />
        <Cloud x={72} y={66} s={30} />
        <Cloud x={252} y={44} s={22} />
        <Cloud x={168} y={88} s={17} />
        <ellipse cx="54" cy="344" rx="118" ry="38" fill="#86efac" opacity="0.5" />
        <ellipse cx="310" cy="348" rx="100" ry="34" fill="#86efac" opacity="0.42" />
        <BackTree x={38} y={340} h={90} />
        <BackTree x={322} y={340} h={76} />
        <BackTree x={16} y={340} h={58} />
        <BackTree x={344} y={340} h={54} />
        <rect x="0" y="338" width="360" height="42" fill="url(#ground-grad)" />
        <path d="M0,338 Q45,330 90,338 Q135,346 180,338 Q225,330 270,338 Q315,346 360,338 L360,346 Q315,354 270,346 Q225,338 180,346 Q135,354 90,346 Q45,338 0,346 Z" fill="#4ade80" opacity="0.7" />
        <Flower x={26} y={348} color="#fda4af" />
        <Flower x={56} y={354} color="#fde68a" />
        <Flower x={98} y={350} color="#c4b5fd" />
        <Flower x={268} y={352} color="#a5f3fc" />
        <Flower x={300} y={348} color="#fda4af" />
        <Flower x={334} y={354} color="#fde68a" />

        <ellipse cx={cx + 12} cy={groundY + 6} rx={baseW * 2.6} ry={10} fill="rgba(0,0,0,0.18)" />
        <path d={trunkPath} fill="url(#trunk-grad)" stroke="#3d1f0a" strokeWidth="1.5" />
        {trunkH > 40 && (
          <path
            d={`M ${cx - baseW * 0.55} ${groundY - 18} C ${cx - baseW * 0.5} ${groundY - trunkH * 0.4} ${cx - topW * 0.8} ${trunkTop + 30} ${cx - topW * 0.6} ${trunkTop + 6}`}
            fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={Math.max(1.5, baseW * 0.18)} strokeLinecap="round"
          />
        )}

        {BRANCH_SLOTS.map((slot, i) => {
          const genreKey = GENRE_KEYS[SLOT_GENRE_MAP[i]];
          const books = booksByGenre[genreKey] || [];
          return (
            <GenreBranch
              key={genreKey}
              slot={{ ...slot, genreKey }}
              books={books}
              cx={cx}
              trunkTop={trunkTop}
              trunkH={trunkH}
              scale={scale}
              onBookTap={onBookTap}
            />
          );
        })}

        <g onClick={e => { e.stopPropagation(); onSignTap?.(); }} style={{ cursor: 'pointer' }}>
          <line x1={cx - 12} y1={signY - 2} x2={cx - 12} y2={signY + 14} stroke="#92400e" strokeWidth="1.8" />
          <line x1={cx + 12} y1={signY - 2} x2={cx + 12} y2={signY + 14} stroke="#92400e" strokeWidth="1.8" />
          <rect x={cx - 34} y={signY + 14} width={68} height={26} rx={4} fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
          <rect x={cx - 32} y={signY + 16} width={64} height={22} rx={3} fill="#fef3c7" opacity={0.88} />
          <text x={cx} y={signY + 30} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#78350f">🌲 わたしの森</text>
        </g>

        {readBooks.length > 0 && (
          <g onClick={e => { e.stopPropagation(); onShelfTap?.(); }} style={{ cursor: 'pointer' }}>
            <rect x={cx - 52} y={shelfY} width={104} height={5} rx={2.5} fill="#b45309" stroke="#92400e" strokeWidth="1" />
            <rect x={cx - 50} y={shelfY + 5} width={4} height={14} rx={2} fill="#92400e" />
            <rect x={cx + 46} y={shelfY + 5} width={4} height={14} rx={2} fill="#92400e" />
            {readBooks.slice(0, 16).map((b, i) => {
              const bx = cx - 48 + i * 6;
              const bh = 13 + (i % 3) * 5;
              const col = GENRES[b.genre]?.color || '#6b7280';
              return (
                <g key={b.id}>
                  <rect x={bx} y={shelfY - bh} width={5.5} height={bh} rx={0.8} fill={col} opacity={0.9} />
                  <rect x={bx + 0.8} y={shelfY - bh + 1} width={1.5} height={bh - 2} rx={0.5} fill="rgba(255,255,255,0.3)" />
                </g>
              );
            })}
            <text x={cx} y={shelfY + 26} textAnchor="middle" fontSize="8" fontWeight="bold" fill="#92400e">📚 本棚を開く</text>
          </g>
        )}

        <rect x={136} y={358} width={88} height={20} rx="10" fill="rgba(0,0,0,0.18)" />
        <rect x={134} y={356} width={88} height={20} rx="10" fill="white" />
        <text x={178} y={369} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#15803d">
          {count === 0 ? '📖 本を登録しよう' : `🌿 ${count}冊読了`}
        </text>
      </svg>
    </div>
  );
}
