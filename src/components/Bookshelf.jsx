import { useState } from 'react';
import { GENRES } from '../data/genres';
import { X } from 'lucide-react';
import EditBookModal from './EditBookModal';

function BookCard({ book, onTap, action }) {
  const g = GENRES[book.genre] || GENRES.other;
  return (
    <div className="flex flex-col rounded-xl overflow-hidden shadow-sm active:scale-95 transition-transform relative">
      <button onClick={() => onTap(book)} className="w-full text-left">
        {book.coverUrl
          ? <img src={book.coverUrl} alt={book.title} className="w-full object-cover" style={{ aspectRatio: '2/3' }} />
          : <div className="w-full flex items-center justify-center text-3xl" style={{ aspectRatio: '2/3', background: `linear-gradient(135deg, ${g.color}, ${g.darkColor})` }}>
              {g.emoji}
            </div>
        }
        <div className="p-1.5 bg-white">
          <p className="text-xs font-semibold text-gray-800 leading-tight overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{book.title}</p>
          {book.author && <p className="text-xs text-gray-400 truncate mt-0.5">{book.author}</p>}
          {book.isFavorite && <span className="text-xs">⭐</span>}
        </div>
      </button>
      {action && (
        <button
          onClick={() => action.fn(book)}
          className="w-full py-1.5 text-xs font-bold text-white"
          style={{ background: action.color }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

function BookDetail({ book, onClose, onEdit, onDelete }) {
  const g = GENRES[book.genre] || GENRES.other;
  return (
    <div className="fixed inset-0 flex items-end z-[60]" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="w-full max-w-md mx-auto rounded-t-3xl p-5 space-y-3" style={{ background: 'white', maxHeight: '78vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
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
          <button onClick={() => onEdit(book)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: '#3b82f6' }}>✏️ 編集</button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold">閉じる</button>
          <button onClick={() => { if (window.confirm('この本を削除しますか？')) { onDelete(book.id); onClose(); } }} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: '#ef4444' }}>🗑</button>
        </div>
      </div>
    </div>
  );
}

const SORT_OPTIONS = [
  { key: 'date',   label: '登録日' },
  { key: 'title',  label: 'タイトル' },
  { key: 'author', label: '著者名' },
];

function sortBooks(books, sortBy) {
  return [...books].sort((a, b) => {
    if (sortBy === 'title')  return (a.title || '').localeCompare(b.title || '', 'ja');
    if (sortBy === 'author') return (a.author || '').localeCompare(b.author || '', 'ja');
    return (b.id || 0) - (a.id || 0);
  });
}

export default function Bookshelf({ readBooks, unreadBooks, onClose, onUpdate, onDelete }) {
  const [tab, setTab] = useState('read');
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const unread = unreadBooks || [];

  const filteredRead = sortBooks(
    readBooks.filter(b => {
      const q = search.toLowerCase();
      return !q || b.title.toLowerCase().includes(q) || (b.author || '').toLowerCase().includes(q);
    }),
    sortBy
  );

  const filteredUnread = sortBooks(
    unread.filter(b => {
      const q = search.toLowerCase();
      return !q || b.title.toLowerCase().includes(q) || (b.author || '').toLowerCase().includes(q);
    }),
    sortBy
  );

  const markRead = book => onUpdate(book.id, { isUnread: false });

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div
        className="w-full max-w-md mx-auto rounded-t-3xl bg-white"
        style={{ maxHeight: '92vh', display: 'flex', flexDirection: 'column', paddingBottom: 'env(safe-area-inset-bottom)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex-shrink-0">
          <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full bg-gray-200" /></div>
          <div className="px-5 pb-2 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">🪵 本棚</h2>
            <button onClick={onClose} className="p-1 text-gray-400"><X size={20} /></button>
          </div>

          <div className="flex mx-5 mb-3 rounded-xl overflow-hidden border border-gray-200">
            <button
              onClick={() => setTab('read')}
              className="flex-1 py-2 text-sm font-bold transition-colors"
              style={{ background: tab === 'read' ? '#16a34a' : 'white', color: tab === 'read' ? 'white' : '#6b7280' }}
            >
              📚 読んだ本 {readBooks.length > 0 && `(${readBooks.length})`}
            </button>
            <button
              onClick={() => setTab('unread')}
              className="flex-1 py-2 text-sm font-bold transition-colors"
              style={{ background: tab === 'unread' ? '#7c3aed' : 'white', color: tab === 'unread' ? 'white' : '#6b7280' }}
            >
              📦 積読 {unread.length > 0 && `(${unread.length})`}
            </button>
          </div>

          <div className="px-5 pb-2">
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="🔍 タイトル・著者で検索"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 px-5 pb-3">
            <span className="text-xs text-gray-400 self-center">並び替え:</span>
            {SORT_OPTIONS.map(o => (
              <button
                key={o.key}
                onClick={() => setSortBy(o.key)}
                className="px-3 py-1 rounded-full text-xs font-semibold border-2 transition-all"
                style={{
                  borderColor: sortBy === o.key ? '#16a34a' : '#e5e7eb',
                  background: sortBy === o.key ? '#dcfce7' : 'white',
                  color: sortBy === o.key ? '#16a34a' : '#6b7280',
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6">
          {tab === 'read' && (
            <>
              {readBooks.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <span className="text-5xl block mb-3">📚</span>
                  <p className="text-sm">本を登録すると本棚に並びます</p>
                </div>
              ) : filteredRead.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <span className="text-4xl block mb-2">🔍</span>
                  <p className="text-sm">該当する本が見つかりません</p>
                </div>
              ) : (
                <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {filteredRead.map(book => (
                    <BookCard key={book.id} book={book} onTap={setSelected} />
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'unread' && (
            <>
              {unread.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <span className="text-5xl block mb-3">📦</span>
                  <p className="text-sm">積読はありません</p>
                </div>
              ) : filteredUnread.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <span className="text-4xl block mb-2">🔍</span>
                  <p className="text-sm">該当する本が見つかりません</p>
                </div>
              ) : (
                <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {filteredUnread.map(book => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onTap={setSelected}
                      action={{ label: '読んだ！', color: '#16a34a', fn: markRead }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selected && (
        <BookDetail
          book={selected}
          onClose={() => setSelected(null)}
          onEdit={book => { setEditing(book); setSelected(null); }}
          onDelete={id => { onDelete(id); setSelected(null); }}
        />
      )}
      {editing && (
        <EditBookModal
          book={editing}
          onSave={onUpdate}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
