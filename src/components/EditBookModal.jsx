import { useState } from 'react';
import { GENRES } from '../data/genres';
import { X } from 'lucide-react';

export default function EditBookModal({ book, onSave, onClose }) {
  const [form, setForm] = useState({
    title: book.title || '',
    author: book.author || '',
    genre: book.genre || 'literature',
    review: book.review || '',
    quote: book.quote || '',
    isFavorite: book.isFavorite || false,
    isUnread: book.isUnread || false,
    coverUrl: book.coverUrl || '',
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(book.id, form);
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
          <h2 className="text-lg font-bold text-gray-800">✏️ 本を編集</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-5 pb-6 space-y-4">
          {/* Cover preview */}
          {form.coverUrl && (
            <div className="flex justify-center">
              <img src={form.coverUrl} alt="cover" className="h-28 rounded-lg shadow-md object-cover" />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">タイトル *</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" value={form.title} onChange={(e) => set('title', e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">著者</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" value={form.author} onChange={(e) => set('author', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">カバー画像URL</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="https://..." value={form.coverUrl} onChange={(e) => set('coverUrl', e.target.value)} />
          </div>
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
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">感想</label>
            <textarea className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" rows={3} value={form.review} onChange={(e) => set('review', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">心に残った言葉</label>
            <textarea className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" rows={2} value={form.quote} onChange={(e) => set('quote', e.target.value)} />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => set('isFavorite', !form.isFavorite)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border-2 transition-all"
              style={{ borderColor: form.isFavorite ? '#fbbf24' : '#e5e7eb', background: form.isFavorite ? '#fef3c7' : 'white', color: form.isFavorite ? '#92400e' : '#6b7280' }}
            >⭐ お気に入り</button>
            <button type="button" onClick={() => set('isUnread', !form.isUnread)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border-2 transition-all"
              style={{ borderColor: form.isUnread ? '#a78bfa' : '#e5e7eb', background: form.isUnread ? '#ede9fe' : 'white', color: form.isUnread ? '#5b21b6' : '#6b7280' }}
            >📦 積読に戻す</button>
          </div>
          <button type="submit" className="w-full py-3 rounded-2xl text-white font-bold text-base" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
            💾 保存する
          </button>
        </form>
      </div>
    </div>
  );
}
