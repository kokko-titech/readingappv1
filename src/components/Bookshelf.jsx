import { useState } from 'react';
import { GENRES } from '../data/genres';
import { X } from 'lucide-react';

function BookSpine({ book, onTap }) {
  const genreData = GENRES[book.genre] || GENRES.other;
  return (
    <button
      onClick={() => onTap(book)}
      className="flex flex-col items-center justify-between rounded-md px-1 py-2 text-center shadow-md active:scale-95 transition-transform"
      style={{
        width: 36,
        height: 120,
        background: `linear-gradient(180deg, ${genreData.color}cc, ${genreData.darkColor})`,
        borderLeft: `3px solid ${genreData.darkColor}`,
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
      }}
    >
      <span className="text-white text-xs font-bold leading-tight overflow-hidden" style={{ maxHeight: 80, WebkitLineClamp: 3 }}>
        {book.title}
      </span>
      {book.isFavorite && <span style={{ writingMode: 'horizontal-tb' }}>⭐</span>}
    </button>
  );
}

function BookDetail({ book, onClose }) {
  const genreData = GENRES[book.genre] || GENRES.other;
  return (
    <div className="fixed inset-0 z-60 flex items-end" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 60 }} onClick={onClose}>
      <div
        className="w-full rounded-t-3xl p-5 space-y-3"
        style={{ background: 'white', maxHeight: '70vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-12 h-16 rounded-lg flex-shrink-0 shadow"
            style={{ background: `linear-gradient(180deg, ${genreData.color}, ${genreData.darkColor})` }}
          />
          <div className="flex-1">
            <h3 className="font-bold text-gray-800">{book.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{book.author || '著者不明'}</p>
            <span
              className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: genreData.color + '33', color: genreData.darkColor }}
            >
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
        <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold">
          閉じる
        </button>
      </div>
    </div>
  );
}

export default function Bookshelf({ readBooks, onClose }) {
  const [selected, setSelected] = useState(null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-3xl bg-white"
        style={{ maxHeight: '85vh', overflowY: 'auto', paddingBottom: 'env(safe-area-inset-bottom)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>
        <div className="px-5 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">🪵 知識の本棚</h2>
            <p className="text-xs text-gray-400">{readBooks.length}冊の本</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400"><X size={20} /></button>
        </div>

        {/* Shelf */}
        <div className="px-4 pb-8">
          {readBooks.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <span className="text-4xl block mb-2">📚</span>
              <p className="text-sm">本を登録すると本棚に並びます</p>
            </div>
          ) : (
            <div
              className="rounded-2xl p-4 overflow-x-auto"
              style={{
                background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)',
                border: '3px solid #d97706',
                minHeight: 160,
              }}
            >
              {/* Shelf plank line */}
              <div className="flex flex-wrap gap-2 items-end" style={{ minHeight: 130 }}>
                {readBooks.map((book) => (
                  <BookSpine key={book.id} book={book} onTap={setSelected} />
                ))}
              </div>
              <div
                className="w-full h-3 rounded-sm mt-1"
                style={{ background: 'linear-gradient(180deg, #b45309, #92400e)' }}
              />
            </div>
          )}
        </div>
      </div>
      {selected && <BookDetail book={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
