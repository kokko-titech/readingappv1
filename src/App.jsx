import { useState } from 'react';
import { useBooks } from './hooks/useBooks';
import ForestScene from './components/ForestScene';
import UndergroundScene from './components/UndergroundScene';
import AddBookModal from './components/AddBookModal';
import TimerModal from './components/TimerModal';
import UnreadCorner from './components/UnreadCorner';
import ForestMap from './components/ForestMap';
import Bookshelf from './components/Bookshelf';
import StatsModal from './components/StatsModal';
import { GENRES } from './data/genres';

const NAV_ITEMS = [
  { id: 'forest', emoji: '🌳', label: '森' },
  { id: 'timer',  emoji: '⏱', label: 'タイマー' },
  { id: 'unread', emoji: '📦', label: '積読' },
  { id: 'map',    emoji: '🗺', label: 'みんな' },
  { id: 'shelf',  emoji: '🪵', label: '本棚' },
];

function StatsBar({ readBooks, onClick }) {
  const total = readBooks.length;
  const favorites = readBooks.filter((b) => b.isFavorite).length;
  const reviewed = readBooks.filter((b) => b.review && b.review.length > 0).length;

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
  readBooks.forEach((b) => { counts[b.genre] = (counts[b.genre] || 0) + 1; });
  const active = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
  if (active.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap px-4 pb-1">
      {active.map(([genre, cnt]) => {
        const g = GENRES[genre];
        return (
          <span key={genre} className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: g.color + '33', color: g.darkColor }}>
            {g.emoji} {g.label} {cnt}
          </span>
        );
      })}
    </div>
  );
}

export default function App() {
  const { books, readBooks, unreadBooks, addBook, updateBook, deleteBook, waterBook } = useBooks();
  const [modal, setModal] = useState(null);

  const markRead = (id) => updateBook(id, { isUnread: false });

  const handleNav = (id) => {
    if (id === 'forest') { setModal(null); return; }
    setModal(id);
  };

  return (
    <div
      className="flex flex-col h-dvh max-w-md mx-auto relative overflow-hidden"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif' }}
    >
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
          <h1 className="text-lg font-bold text-gray-800">🌲 知識の森</h1>
          <p className="text-xs text-gray-400">Chishiki Forest</p>
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

      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="flex flex-col" style={{ minHeight: 260 }}>
          <ForestScene readBooks={readBooks} onTreeTap={() => setModal('shelf')} />
        </div>

        <div className="flex items-center gap-2 px-4 py-1 text-xs font-semibold" style={{ background: '#86efac', color: '#15803d' }}>
          <span>🌿 地表</span>
          <div className="flex-1 h-px bg-green-400 opacity-40" />
          <span>根 {readBooks.length}本</span>
        </div>

        <UndergroundScene
          readBooks={readBooks}
          onWater={waterBook}
          onUpdate={updateBook}
          onDelete={deleteBook}
        />
      </div>

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

      {unreadBooks.length > 0 && (
        <div
          className="absolute right-16 bottom-14 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
          style={{ background: '#a78bfa', zIndex: 15 }}
        >
          {unreadBooks.length}
        </div>
      )}

      {modal === 'add' && <AddBookModal onAdd={addBook} onClose={() => setModal(null)} />}
      {modal === 'timer' && <TimerModal onClose={() => setModal(null)} />}
      {modal === 'unread' && <UnreadCorner unreadBooks={unreadBooks} onMarkRead={markRead} onClose={() => setModal(null)} />}
      {modal === 'map' && <ForestMap onClose={() => setModal(null)} myCount={readBooks.length} />}
      {modal === 'shelf' && (
        <Bookshelf
          readBooks={readBooks}
          onClose={() => setModal(null)}
          onUpdate={updateBook}
          onDelete={deleteBook}
        />
      )}
      {modal === 'stats' && <StatsModal readBooks={readBooks} onClose={() => setModal(null)} />}
    </div>
  );
}
