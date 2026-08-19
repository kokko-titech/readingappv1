import { useState } from 'react';
import { GENRES } from '../data/genres';

function Root({ book, depth, index, totalRoots, onTap, isWatered }) {
  const genreData = GENRES[book.genre] || GENRES.other;
  const x = 10 + (index % 7) * 52 + (Math.floor(index / 7) % 2 === 0 ? 0 : 26);
  const rootH = 60 + Math.min(depth * 4, 80);

  return (
    <g
      transform={`translate(${x}, 0)`}
      onClick={() => onTap(book)}
      style={{ cursor: 'pointer' }}
    >
      {/* Shimmer for watered */}
      {isWatered && (
        <ellipse cx="14" cy={rootH * 0.6} rx="16" ry="8" fill={genreData.color} opacity="0.2">
          <animate attributeName="opacity" values="0.1;0.35;0.1" dur="2s" repeatCount="indefinite" />
        </ellipse>
      )}
      {/* Root body — book spine shape */}
      <rect
        x="4"
        y="0"
        width="20"
        height={rootH}
        rx="3"
        fill={genreData.color}
        opacity="0.85"
      />
      {/* Spine stripes */}
      <rect x="4" y="8" width="20" height="2" rx="1" fill={genreData.darkColor} opacity="0.4" />
      <rect x="4" y={rootH - 10} width="20" height="2" rx="1" fill={genreData.darkColor} opacity="0.4" />
      {/* Tiny root tendrils */}
      <line x1="8" y1={rootH} x2="4" y2={rootH + 12} stroke={genreData.darkColor} strokeWidth="1.5" opacity="0.5" />
      <line x1="14" y1={rootH} x2="14" y2={rootH + 16} stroke={genreData.darkColor} strokeWidth="1.5" opacity="0.5" />
      <line x1="20" y1={rootH} x2="24" y2={rootH + 12} stroke={genreData.darkColor} strokeWidth="1.5" opacity="0.5" />
      {/* Watered sparkle */}
      {isWatered && (
        <>
          <text x="14" y="-4" textAnchor="middle" fontSize="8">✨</text>
        </>
      )}
      {/* Favorite indicator */}
      {book.isFavorite && (
        <text x="14" y={rootH * 0.45} textAnchor="middle" fontSize="9">⭐</text>
      )}
    </g>
  );
}

function BookDetail({ book, onClose, onWater }) {
  const genreData = GENRES[book.genre] || GENRES.other;
  return (
    <div
      className="absolute inset-0 flex items-end z-20"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-3xl p-5 space-y-3"
        style={{ background: '#fefce8', maxHeight: '70vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">{genreData.emoji}</span>
          <div>
            <h3 className="font-bold text-gray-800 text-base leading-tight">{book.title}</h3>
            <p className="text-xs text-gray-500">{book.author || '著者不明'} · {genreData.label}</p>
          </div>
          {book.isFavorite && <span className="ml-auto text-xl">⭐</span>}
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
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => { onWater(book.id); onClose(); }}
            className="flex-1 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: '#22c55e' }}
          >
            💧 水をあげる
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-gray-500 bg-gray-100"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UndergroundScene({ readBooks, onWater }) {
  const [selectedBook, setSelectedBook] = useState(null);

  const sortedBooks = [...readBooks].reverse();

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: 200, background: 'linear-gradient(to bottom, #92400e 0%, #78350f 30%, #451a03 100%)' }}>
      {/* Soil texture dots */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-900"
            style={{
              width: 3 + (i % 4),
              height: 3 + (i % 3),
              left: `${(i * 37) % 100}%`,
              top: `${(i * 23 + 10) % 100}%`,
            }}
          />
        ))}
      </div>

      {/* Underground label */}
      <div className="absolute top-2 left-3">
        <span className="text-xs text-amber-300 font-semibold opacity-70">🌍 地下 — 知識の根</span>
      </div>

      {readBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-amber-300 opacity-60">
          <span className="text-3xl mb-2">🌱</span>
          <p className="text-xs">本を登録すると根が育ちます</p>
        </div>
      ) : (
        <div className="pt-8 pb-4 px-2 overflow-x-auto">
          <svg
            viewBox={`0 0 380 ${Math.max(140, Math.ceil(sortedBooks.length / 7) * 100 + 40)}`}
            className="w-full"
            style={{ minHeight: 180 }}
          >
            {sortedBooks.map((book, i) => (
              <Root
                key={book.id}
                book={book}
                depth={i}
                index={i}
                totalRoots={sortedBooks.length}
                onTap={setSelectedBook}
                isWatered={book.watered}
              />
            ))}
          </svg>
        </div>
      )}

      {selectedBook && (
        <BookDetail
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onWater={onWater}
        />
      )}
    </div>
  );
}
