import { useState } from 'react';
import { GENRES } from '../data/genres';
import EditBookModal from './EditBookModal';

const COLS = 5;
const COL_W = 64;
const COV_H = 36;
const ROW_H = 148;

function seeded(n) {
  let s = Math.abs(n % 2147483647) || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function RootSVG({ book, index, onTap }) {
  const genreData = GENRES[book.genre] || GENRES.other;
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  const cx = 32 + col * COL_W + (row % 2 === 1 ? COL_W / 2 : 0);
  const groundY = row * ROW_H + COV_H;

  const seed = parseInt(book.id, 10) % 2147483647 || index * 97 + 3;
  const r = seeded(seed);

  const mainH = 52 + r() * 32;
  const lean = (r() - 0.5) * 14;
  const ex = cx + lean;
  const ey = groundY + mainH;

  const trunk = `M ${cx} ${groundY} C ${cx + lean * 0.2} ${groundY + mainH * 0.33} ${ex - lean * 0.1} ${groundY + mainH * 0.67} ${ex} ${ey}`;

  const b1t = 0.28 + r() * 0.15;
  const b1x0 = cx + lean * b1t;
  const b1y0 = groundY + mainH * b1t;
  const b1len = 18 + r() * 15;
  const b1x1 = b1x0 - b1len;
  const b1y1 = b1y0 + b1len * 0.55 + r() * 8;

  const b2t = 0.44 + r() * 0.12;
  const b2x0 = cx + lean * b2t;
  const b2y0 = groundY + mainH * b2t;
  const b2len = 16 + r() * 15;
  const b2x1 = b2x0 + b2len;
  const b2y1 = b2y0 + b2len * 0.5 + r() * 8;

  const b3t = 0.65 + r() * 0.1;
  const b3x0 = cx + lean * b3t;
  const b3y0 = groundY + mainH * b3t;
  const b3x1 = b3x0 + (r() - 0.5) * 22;
  const b3y1 = b3y0 + 10 + r() * 10;

  const sb1x = b1x1 - 8 - r() * 8;
  const sb1y = b1y1 + 10 + r() * 8;
  const sb2x = b2x1 + 7 + r() * 7;
  const sb2y = b2y1 + 9 + r() * 8;

  const c = genreData.color;
  const dk = genreData.darkColor;
  const clipId = `cl-${book.id}`;

  const cW = 24, cH = 32;
  const cX = cx - cW / 2;
  const cY = groundY - cH - 3;

  return (
    <g onClick={() => onTap(book)} style={{ cursor: 'pointer' }}>
      {book.watered && (
        <ellipse cx={cx} cy={groundY + mainH * 0.5} rx={20} ry={10} fill={c} opacity={0.12}>
          <animate attributeName="opacity" values="0.06;0.25;0.06" dur="2.8s" repeatCount="indefinite" />
        </ellipse>
      )}

      <path d={trunk} stroke={c} strokeWidth="3" fill="none" strokeLinecap="round" opacity={0.92} />
      <path d={`M ${b1x0} ${b1y0} Q ${(b1x0 + b1x1) / 2 - 5} ${(b1y0 + b1y1) / 2} ${b1x1} ${b1y1}`}
            stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity={0.82} />
      <path d={`M ${b2x0} ${b2y0} Q ${(b2x0 + b2x1) / 2 + 5} ${(b2y0 + b2y1) / 2} ${b2x1} ${b2y1}`}
            stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity={0.82} />
      <path d={`M ${b3x0} ${b3y0} Q ${b3x0} ${(b3y0 + b3y1) / 2} ${b3x1} ${b3y1}`}
            stroke={dk} strokeWidth="1.1" fill="none" strokeLinecap="round" opacity={0.55} />
      <path d={`M ${b1x1} ${b1y1} Q ${b1x1 - 4} ${(b1y1 + sb1y) / 2} ${sb1x} ${sb1y}`}
            stroke={dk} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity={0.45} />
      <path d={`M ${b2x1} ${b2y1} Q ${b2x1 + 4} ${(b2y1 + sb2y) / 2} ${sb2x} ${sb2y}`}
            stroke={dk} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity={0.45} />

      {book.coverUrl ? (
        <>
          <defs>
            <clipPath id={clipId}>
              <rect x={cX} y={cY} width={cW} height={cH} rx="3" />
            </clipPath>
          </defs>
          <image href={book.coverUrl} x={cX} y={cY} width={cW} height={cH}
                 clipPath={`url(#${clipId})`} preserveAspectRatio="xMidYMid slice" />
          <rect x={cX} y={cY} width={cW} height={cH} rx="3"
                fill="none" stroke={dk} strokeWidth="0.8" opacity={0.7} />
        </>
      ) : (
        <>
          <circle cx={cx} cy={cY + cH / 2} r="14" fill={c} opacity={0.88} />
          <text x={cx} y={cY + cH / 2} textAnchor="middle" dominantBaseline="middle" fontSize="12">
            {genreData.emoji}
          </text>
        </>
      )}

      {book.isFavorite && (
        <text x={cX + cW + 1} y={cY + 7} fontSize="8">⭐</text>
      )}
      {book.watered && (
        <text x={cx + 3} y={groundY - 2} fontSize="7">✨</text>
      )}
    </g>
  );
}

function BookDetail({ book, onClose, onWater, onEdit, onDelete }) {
  const genreData = GENRES[book.genre] || GENRES.other;
  return (
    <div className="absolute inset-0 flex items-end z-20" style={{ background: 'rgba(0,0,0,0.45)' }} onClick={onClose}>
      <div className="w-full rounded-t-3xl p-5 space-y-3" style={{ background: '#fefce8', maxHeight: '70vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          {book.coverUrl
            ? <img src={book.coverUrl} alt={book.title} className="w-12 h-16 object-cover rounded-lg flex-shrink-0 shadow" />
            : <div className="w-12 h-16 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl" style={{ background: `linear-gradient(180deg, ${genreData.color}, ${genreData.darkColor})` }}>{genreData.emoji}</div>
          }
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 text-base leading-tight">{book.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{book.author || '著者不明'}</p>
            {book.publishedDate && <p className="text-xs text-gray-400 mt-0.5">📅 {book.publishedDate}</p>}
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: genreData.color + '33', color: genreData.darkColor }}>
              {genreData.emoji} {genreData.label}
            </span>
          </div>
          {book.isFavorite && <span className="text-xl">⭐</span>}
        </div>
        {book.review && (
          <div className="bg-green-50 rounded-xl p-3">
            <p className="text-xs font-semibold text-green-700 mb-1">📝 感想</p>
            <p className="text-sm text-gray-700 leading-relaxed">{book.review}</p>
          </div>
        )}
        {book.quote && (
          <div className="bg-amber-50 rounded-xl p-3 border-l-4 border-amber-400">
            <p className="text-xs font-semibold text-amber-700 mb-1">💬 名言</p>
            <p className="text-sm italic text-gray-700">「{book.quote}」</p>
          </div>
        )}
        <div className="flex gap-2 pt-1 flex-wrap">
          <button onClick={() => { onWater(book.id); onClose(); }} className="flex-1 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: '#22c55e' }}>💧 水をあげる</button>
          <button onClick={() => onEdit(book)} className="flex-1 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: '#3b82f6' }}>✏️ 編集</button>
          <button onClick={() => { if (window.confirm('この本を削除しますか？')) { onDelete(book.id); onClose(); } }} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: '#ef4444' }}>🗑</button>
        </div>
        <button onClick={onClose} className="w-full py-2 rounded-xl text-sm text-gray-500 bg-gray-100">閉じる</button>
      </div>
    </div>
  );
}

export default function UndergroundScene({ readBooks, onWater, onUpdate, onDelete }) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const sortedBooks = [...readBooks].reverse();

  const rows = Math.ceil(sortedBooks.length / COLS);
  const svgH = Math.max(150, rows * ROW_H + 20);

  return (
    <div className="relative w-full overflow-hidden"
         style={{ background: 'linear-gradient(to bottom, #92400e 0%, #78350f 35%, #451a03 100%)' }}>
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-amber-950"
               style={{ width: 2 + (i % 4), height: 2 + (i % 3), left: `${(i * 37) % 100}%`, top: `${(i * 29 + 5) % 100}%` }} />
        ))}
      </div>

      <div className="absolute top-2 left-3 z-10">
        <span className="text-xs text-amber-300 font-semibold opacity-70">🌍 地下 — 知識の根</span>
      </div>

      {sortedBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-amber-300 opacity-60">
          <span className="text-3xl mb-2">🌱</span>
          <p className="text-xs">本を登録すると根が育ちます</p>
        </div>
      ) : (
        <div style={{ paddingTop: 28, paddingBottom: 16 }}>
          <svg viewBox={`0 0 340 ${svgH}`} className="w-full" style={{ display: 'block' }}>
            {Array.from({ length: 18 }).map((_, i) => (
              <ellipse key={i} cx={(i * 71 + 20) % 340} cy={15 + (i * 53) % (svgH - 20)}
                       rx={1 + (i % 3)} ry={0.8 + (i % 2)} fill="#92400e" opacity={0.25} />
            ))}
            {sortedBooks.map((book, i) => (
              <RootSVG key={book.id} book={book} index={i} onTap={setSelectedBook} />
            ))}
          </svg>
        </div>
      )}

      {selectedBook && (
        <BookDetail
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onWater={onWater}
          onEdit={(book) => { setEditingBook(book); setSelectedBook(null); }}
          onDelete={(id) => { onDelete(id); setSelectedBook(null); }}
        />
      )}
      {editingBook && (
        <EditBookModal
          book={editingBook}
          onSave={onUpdate}
          onClose={() => setEditingBook(null)}
        />
      )}
    </div>
  );
}
