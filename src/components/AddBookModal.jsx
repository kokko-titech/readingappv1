import { useState, useRef } from 'react';
import { GENRES } from '../data/genres';
import { X } from 'lucide-react';

const INITIAL = {
  title: '',
  author: '',
  genre: 'literature',
  review: '',
  quote: '',
  isFavorite: false,
  isUnread: false,
  coverUrl: '',
};

async function searchBooks(query) {
  if (!query || query.length < 2) return [];
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=6&langRestrict=ja`
    );
    const data = await res.json();
    if (!data.items) return [];
    return data.items.map((item) => ({
      title: item.volumeInfo.title || '',
      author: (item.volumeInfo.authors || []).join(', '),
      coverUrl: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || '',
    }));
  } catch {
    return [];
  }
}

export default function AddBookModal({ onAdd, onClose }) {
  const [form, setForm] = useState(INITIAL);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleTitleChange = (v) => {
    set('title', v);
    clearTimeout(debounceRef.current);
    if (v.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const results = await searchBooks(v);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setLoading(false);
    }, 400);
  };

  const selectSuggestion = (s) => {
    setForm((f) => ({ ...f, title: s.title, author: s.author, coverUrl: s.coverUrl }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onAdd(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div
        className="w-full rounded-t-3xl"
        style={{ background: 'white', maxHeight: '92vh', overflowY: 'auto', paddingBottom: 'env(safe-area-inset-bottom)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full bg-gray-200" /></div>
        <div className="px-5 pb-2 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">📚 本を登録</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 pb-6 space-y-4">
          {/* Cover preview */}
          {form.coverUrl && (
            <div className="flex justify-center">
              <img src={form.coverUrl} alt="cover" className="h-28 rounded-lg shadow-md object-cover" />
            </div>
          )}

          {/* Title with autocomplete */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-600 mb-1">タイトル *</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="タイトルを入力すると候補が出ます"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              required
            />
            {loading && <p className="text-xs text-gray-400 mt-1 pl-1">🔍 検索中...</p>}
            {showSuggestions && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-xl mt-1 overflow-hidden" style={{ maxHeight: 260, overflowY: 'auto' }}>
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-left active:bg-green-50"
                    style={{ borderBottom: i < suggestions.length - 1 ? '1px solid #f3f4f6' : 'none' }}
                    onMouseDown={() => selectSuggestion(s)}
                  >
                    {s.coverUrl
                      ? <img src={s.coverUrl} alt="" className="w-8 h-11 object-cover rounded flex-shrink-0" />
                      : <div className="w-8 h-11 bg-green-100 rounded flex-shrink-0 flex items-center justify-center">📖</div>
                    }
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800 leading-tight" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{s.title}</p>
                      {s.author && <p className="text-xs text-gray-400 mt-0.5 truncate">{s.author}</p>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Author */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">著者</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="著者名"
              value={form.author}
              onChange={(e) => set('author', e.target.value)}
            />
          </div>

          {/* Cover URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              カバー画像 <span className="font-normal text-gray-400">（自動取得 or URLを貼り付け）</span>
            </label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="https://..."
              value={form.coverUrl}
              onChange={(e) => set('coverUrl', e.target.value)}
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">ジャンル</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(GENRES).map(([key, g]) => (
                <button key={key} type="button" onClick={() => set('genre', key)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
                  style={{ borderColor: form.genre === key ? g.color : '#e5e7eb', background: form.genre === key ? g.color + '22' : 'white', color: form.genre === key ? g.darkColor : '#6b7280' }}
                >{g.emoji} {g.label}</button>
              ))}
            </div>
          </div>

          {/* Review */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">感想</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
              rows={3}
              placeholder="この本を読んだ感想を書くと、枝に実がなります"
              value={form.review}
              onChange={(e) => set('review', e.target.value)}
            />
          </div>

          {/* Quote */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">心に残った言葉</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
              rows={2}
              placeholder="印象的なフレーズを記録"
              value={form.quote}
              onChange={(e) => set('quote', e.target.value)}
            />
          </div>

          {/* Options */}
          <div className="flex gap-3">
            <button type="button" onClick={() => set('isFavorite', !form.isFavorite)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border-2 transition-all"
              style={{ borderColor: form.isFavorite ? '#fbbf24' : '#e5e7eb', background: form.isFavorite ? '#fef3c7' : 'white', color: form.isFavorite ? '#92400e' : '#6b7280' }}
            >⭐ お気に入り</button>
            <button type="button" onClick={() => set('isUnread', !form.isUnread)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border-2 transition-all"
              style={{ borderColor: form.isUnread ? '#a78bfa' : '#e5e7eb', background: form.isUnread ? '#ede9fe' : 'white', color: form.isUnread ? '#5b21b6' : '#6b7280' }}
            >📦 積読</button>
          </div>

          <button type="submit" className="w-full py-3 rounded-2xl text-white font-bold text-base" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
            🌱 根として植える
          </button>
        </form>
      </div>
    </div>
  );
}
