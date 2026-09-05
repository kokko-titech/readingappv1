import { useState, useEffect, useRef } from 'react';
import { useBooks } from './hooks/useBooks';
import ForestScene from './components/ForestScene';
import AddBookModal from './components/AddBookModal';
import TimerModal from './components/TimerModal';
import CalendarModal from './components/CalendarModal';
import Bookshelf from './components/Bookshelf';
import StatsModal from './components/StatsModal';
import TreeSignModal from './components/TreeSignModal';
import EditBookModal from './components/EditBookModal';
import { GENRES } from './data/genres';

const NAV_ITEMS = [
  { id: 'forest',   emoji: '🌳', label: '森' },
  { id: 'timer',    emoji: '⏱', label: '読書タイム' },
  { id: 'unread',   emoji: '📦', label: '積読' },
  { id: 'calendar', emoji: '📅', label: 'カレンダー' },
  { id: 'shelf',    emoji: '🪵', label: '本棚' },
];

const SPARKLE_EMOJIS = ['✨', '🍃', '⭐', '✨', '🌟', '💚', '✨', '🍃', '🌿', '⭐'];

function SparkleOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50" style={{ overflow: 'hidden' }}>
      {SPARKLE_EMOJIS.map((emoji, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${8 + (i * 9) % 84}%`,
          top: `${15 + (i * 13) % 65}%`,
          fontSize: 20 + (i % 3) * 10,
          animation: `sparkle-float ${0.9 + i * 0.1}s ease-out forwards`,
          animationDelay: `${i * 0.07}s`,
          opacity: 0,
        }}>{emoji}</div>
      ))}
    </div>
  );
}

function StatsBar({ readBooks, onClick }) {
  const total = readBooks.length;
  const favorites = readBooks.filter(b => b.isFavorite).length;
  const reviewed = readBooks.filter(b => b.review && b.review.length > 0).length;
  return (
    <div
      className="flex gap-3 px-4 py-2 cursor-pointer active:opacity-70 transition-opacity"
      style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClick}
    >
      {[
        { label: '読了', value: total, emoji: '📚' },
        { label: 'お気に入り', value: favorites, emoji: '⭐' },
        { label: '感想あり', value: reviewed, emoji: '📝' },
      ].map(({ label, value, emoji }) => (
        <div key={label} className="flex-1 text-center">
          <p className="text-xs text-gray-400">{emoji} {label}</p>
          <p className="text-lg font-bold text-gray-800 leading-tight">{value}</p>
        </div>
      ))}
      <div className="flex items-center pl-1">
        <span className="text-xs text-gray-300">📊</span>
      </div>
    </div>
  );
}

function GenreLegend({ readBooks }) {
  const counts = {};
  readBooks.forEach(b => { counts[b.genre] = (counts[b.genre] || 0) + 1; });
  const active = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
  if (active.length === 0) return null;
  return (
    <div className="flex gap-2 flex-wrap px-4 pb-1">
      {active.map(([genre, cnt]) => {
        const g = GENRES[genre];
        return (
          <span key={genre} className="px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: g.color + '33', color: g.darkColor }}>
            {g.emoji} {g.label} {cnt}
          </span>
        );
      })}
    </div>
  );
}

function LeafBookDetail({ book, onClose, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const g = GENRES[book.genre] || GENRES.other;

  if (editing) {
    return (
      <EditBookModal
        book={book}
        onSave={onUpdate}
        onClose={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 flex items-end z-50" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div
        className="w-full max-w-md mx-auto rounded-t-3xl p-5 space-y-3"
        style={{ background: 'white', maxHeight: '75vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          {book.coverUrl
            ? <img src={book.coverUrl} alt={book.title} className="w-14 h-20 object-cover rounded-lg flex-shrink-0 shadow" />
            : <div className="w-14 h-20 rounded-lg flex-shrink-0 shadow flex items-center justify-center text-2xl" style={{ background: `linear-gradient(135deg, ${g.color}, ${g.darkColor})` }}>{g.emoji}</div>
          }
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 leading-snug">{book.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{book.author || '著者不明'}</p>
            {book.publishedDate && <p className="text-xs text-gray-400 mt-0.5">📅 {book.publishedDate}</p>}
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: g.color + '33', color: g.darkColor }}>
              {g.emoji} {g.label}
            </span>
          </div>
          {book.isFavorite && <span className="text-xl flex-shrink-0">⭐</span>}
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
          <button onClick={() => setEditing(true)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: '#3b82f6' }}>✏️ 編集</button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold">閉じる</button>
          <button onClick={() => { if (window.confirm('この本を削除しますか？')) { onDelete(book.id); onClose(); } }} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: '#ef4444' }}>🗑</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { readBooks, unreadBooks, addBook, updateBook, deleteBook } = useBooks();
  const [modal, setModal] = useState(null);
  const [sparkle, setSparkle] = useState(false);
  const [leafBook, setLeafBook] = useState(null);
  const prevCountRef = useRef(readBooks.length);

  useEffect(() => {
    if (readBooks.length > prevCountRef.current) {
      setSparkle(true);
      if (navigator.vibrate) navigator.vibrate([40, 20, 40, 20, 80]);
      setTimeout(() => setSparkle(false), 2000);
    }
    prevCountRef.current = readBooks.length;
  }, [readBooks.length]);

  const markRead = id => updateBook(id, { isUnread: false });

  const handleNav = id => {
    if (id === 'forest') { setModal(null); return; }
    setModal(id);
  };

  return (
    <div
      className="flex flex-col h-dvh max-w-md mx-auto relative overflow-hidden"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif' }}
    >
      {sparkle && <SparkleOverlay />}

      {/* Header */}
      <div
        className="flex items-center justify-between px-4"
        style={{
          paddingTop: 'max(env(safe-area-inset-top), 12px)',
          paddingBottom: 8,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          zIndex: 10,
        }}
      >
        <div>
          <h1 className="text-2xl font-black text-gray-800">🌲 ちし樹森森</h1>
          <p className="text-xs text-gray-500 font-medium">Knowledge Grove</p>
        </div>
        <button
          onClick={() => setModal('add')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
        >
          + 本を登録
        </button>
      </div>

      <StatsBar readBooks={readBooks} onClick={() => setModal('stats')} />
      <GenreLegend readBooks={readBooks} />

      {/* Forest scene */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <ForestScene
          readBooks={readBooks}
          onTreeTap={() => setModal('shelf')}
          onSignTap={() => setModal('sign')}
          onShelfTap={() => setModal('shelf')}
          onBookTap={book => setLeafBook(book)}
        />
      </div>

      {/* Bottom navigation */}
      <div
        className="flex items-center justify-around py-2"
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid #e5e7eb',
          zIndex: 10,
        }}
      >
        {NAV_ITEMS.map(({ id, emoji, label }) => {
          const isActive = (id === 'forest' && !modal) || modal === id;
          return (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all active:scale-90"
              style={{ color: isActive ? '#16a34a' : '#9ca3af' }}
            >
              <span className="text-xl">{emoji}</span>
              <span className="text-xs font-semibold">{label}</span>
              {isActive && <div className="w-1 h-1 rounded-full" style={{ background: '#16a34a' }} />}
            </button>
          );
        })}
      </div>

      {/* Unread badge */}
      {unreadBooks.length > 0 && (
        <div
          className="absolute right-16 bottom-14 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
          style={{ background: '#a78bfa', zIndex: 15 }}
        >
          {unreadBooks.length}
        </div>
      )}

      {/* Modals */}
      {modal === 'add' && <AddBookModal onAdd={addBook} onClose={() => setModal(null)} />}
      {modal === 'timer' && <TimerModal onClose={() => setModal(null)} />}
      {modal === 'unread' && (
        <Bookshelf
          readBooks={readBooks}
          unreadBooks={unreadBooks}
          onClose={() => setModal(null)}
          onUpdate={updateBook}
          onDelete={deleteBook}
          initialTab="unread"
        />
      )}
      {modal === 'calendar' && <CalendarModal readBooks={readBooks} onClose={() => setModal(null)} />}
      {modal === 'shelf' && (
        <Bookshelf
          readBooks={readBooks}
          unreadBooks={unreadBooks}
          onClose={() => setModal(null)}
          onUpdate={updateBook}
          onDelete={deleteBook}
        />
      )}
      {modal === 'stats' && <StatsModal readBooks={readBooks} onClose={() => setModal(null)} />}
      {modal === 'sign' && <TreeSignModal readBooks={readBooks} onClose={() => setModal(null)} />}

      {/* Leaf tap → book detail */}
      {leafBook && (
        <LeafBookDetail
          book={leafBook}
          onClose={() => setLeafBook(null)}
          onUpdate={updateBook}
          onDelete={id => { deleteBook(id); setLeafBook(null); }}
        />
      )}
    </div>
  );
}
