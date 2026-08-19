import { useState } from 'react';
import { GENRES } from '../data/genres';
import { X } from 'lucide-react';
import EditBookModal from './EditBookModal';

function BookSpine({ book, onTap }) {
  const genreData = GENRES[book.genre] || GENRES.other;
  return (
    <button
      onClick={() => onTap(book)}
      className="flex flex-col items-center justify-between rounded-md px-1 py-2 text-center shadow-md active:scale-95 transition-transform overflow-hidden"
      style={{
        width: 36, height: 120,
        background: book.coverUrl
          ? 'transparent'
          : `linear-gradient(180deg, ${genreData.color}cc, ${genreData.darkColor})`,
        borderLeft: `3px solid ${genreData.darkColor}`,
        writingMode: book.coverUrl ? 'horizontal-tb' : 'vertical-rl',
        textOrientation: 'mixed',
        position: 'relative',
      }}
    >
      {book.coverUrl
        ? <img src={book.coverUrl} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
        : <>
          <span className="text-white text-xs font-bold leading-tight overflow-hidden" style={{ maxHeight: 80, WebkitLineClamp: 3 }}>{book.title}</span>
          {book.isFavorite && <span style={{ writingMode: 'horizontal-tb' }}>⭐</span>}
        </>
      }
    </button>
  );
}

function BookDetail({ book, onClose, onEdit, onDelete }) {
  const genreData = GENRES[book.genre] || GENRES.other;
  return (
    <div className="fixed inset-0 flex items-end" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 60 }} onClick={onClose}>
      <div className="w-full rounded-t-3xl p-5 space-y-3" style={{ background: 'white', maxHeight: '75vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          {book.coverUrl
            ? <img src={book.coverUrl} alt={book.title} className="w-14 h-20 object-cover rounded-lg flex-shrink-0 shadow" />
            : <div className="w-14 h-20 rounded-lg flex-shrink-0 shadow" style={{ background: `linear-gradient(180deg, ${genreData.color}, ${genreData.darkColor})` }} />
          }
          <div className="flex-1">
            <h3 className="font-bold text-gray-800">{book.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{book.author || '著者不明'}</p>
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
        <div className="flex gap-2 pt-1">
          <button onClick={() => onEdit(book)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: '#3b82f6' }}>✏️ 編集</button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold">閉じる</button>
          <button onClick={() => { if (window.confirm('この本を削除しますか？')) { onDelete(book.id); onClose(); } }} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: '#ef4444' }}>🗑</button>
        </div>
      </div>
    </div>
  );
}

export default function Bookshelf({ readBooks, onClose, onUpdate, onDelete }) {
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [filterGenre, setFilterGenre] = useState(null);

  const filtered = readBooks.filter((b) => {
    const q = search.toLowerCase();
    const matchText = !q || b.title.toLowerCase().includes(q) || (b.author || '').toLowerCase().includes(q);
    const matchGenre = !filterGenre || b.genre === filterGenre;
    return matchText && matchGenre;
  });

  const usedGenres = [...new Set(readBooks.map((b) => b.genre))];

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div
        className="w-full rounded-t-3xl bg-white"
        style={{ maxHeight: '90vh', overflowY: 'auto', paddingBottom: 'env(safe-area-inset-bottom)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full bg-gray-200" /></div>
        <div className="px-5 pb-2 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">🪵 知識の本棚</h2>
            <p className="text-xs text-gray-400">{readBooks.length}冊の本</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400"><X size={20} /></button>
        </div>

        <div className="px-5 pb-2">
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="🔍 タイトル・著者で検索"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {usedGenres.length > 1 && (
          <div className="px-5 pb-3 flex gap-2 overflow-x-auto">
            <button
              onClick={() => setFilterGenre(null)}
              className="px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 border-2 transition-all"
              style={{ borderColor: !filterGenre ? '#22c55e' : '#e5e7eb', background: !filterGenre ? '#dcfce7' : 'white', color: !filterGenre ? '#16a34a' : '#6b7280' }}
            >すべて</button>
            {usedGenres.map((g) => {
              const genre = GENRES[g];
              return (
                <button
                  key={g}
                  onClick={() => setFilterGenre(filterGenre === g ? null : g)}
                  className="px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 border-2 transition-all"
                  style={{ borderColor: filterGenre === g ? genre.color : '#e5e7eb', background: filterGenre === g ? genre.color + '22' : 'white', color: filterGenre === g ? genre.darkColor : '#6b7280' }}
                >{genre.emoji} {genre.label}</button>
              );
            })}
          </div>
        )}

        <div className="px-4 pb-8">
          {readBooks.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <span className="text-4xl block mb-2">📚</span>
              <p className="text-sm">本を登録すると本棚に並びます</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <span className="text-4xl block mb-2">🔍</span>
              <p className="text-sm">該当する本が見つかりません</p>
            </div>
          ) : (
            <div className="rounded-2xl p-4 overflow-x-auto" style={{ background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)', border: '3px solid #d97706', minHeight: 160 }}>
              <div className="flex flex-wrap gap-2 items-end" style={{ minHeight: 130 }}>
                {filtered.map((book) => <BookSpine key={book.id} book={book} onTap={setSelected} />)}
              </div>
              <div className="w-full h-3 rounded-sm mt-1" style={{ background: 'linear-gradient(180deg, #b45309, #92400e)' }} />
            </div>
          )}
        </div>
      </div>

      {selected && (
        <BookDetail
          book={selected}
          onClose={() => setSelected(null)}
          onEdit={(book) => { setEditing(book); setSelected(null); }}
          onDelete={(id) => { onDelete(id); setSelected(null); }}
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
