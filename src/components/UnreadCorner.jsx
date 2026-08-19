import { GENRES } from '../data/genres';
import { X } from 'lucide-react';

function Seed({ book, onMarkRead }) {
  const genreData = GENRES[book.genre] || GENRES.other;
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-2xl"
      style={{ background: '#fafafa', border: '1.5px solid #e5e7eb' }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: genreData.color + '33' }}
      >
        {genreData.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{book.title}</p>
        <p className="text-xs text-gray-400">{book.author || '著者不明'} · {genreData.label}</p>
      </div>
      <button
        onClick={() => onMarkRead(book.id)}
        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white flex-shrink-0"
        style={{ background: '#22c55e' }}
      >
        読了 🌱
      </button>
    </div>
  );
}

export default function UnreadCorner({ unreadBooks, onMarkRead, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-3xl bg-white"
        style={{ maxHeight: '80vh', overflowY: 'auto', paddingBottom: 'env(safe-area-inset-bottom)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>
        <div className="px-5 pb-2 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">📦 積読コーナー</h2>
            <p className="text-xs text-gray-400">根になる前の種たち · {unreadBooks.length}冊</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="px-5 pb-8 space-y-2">
          {unreadBooks.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <span className="text-4xl block mb-2">🌟</span>
              <p className="text-sm">積読本はありません！</p>
            </div>
          ) : (
            unreadBooks.map((book) => (
              <Seed key={book.id} book={book} onMarkRead={onMarkRead} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
