import { useMemo } from 'react';
import { X } from 'lucide-react';
import { GENRES } from '../data/genres';

function MonthlyChart({ books }) {
  const months = useMemo(() => {
    const result = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      result.push({ label: `${d.getMonth() + 1}月`, year: d.getFullYear(), month: d.getMonth(), count: 0 });
    }
    books.forEach((b) => {
      const d = new Date(b.createdAt);
      const m = result.find((m) => m.year === d.getFullYear() && m.month === d.getMonth());
      if (m) m.count++;
    });
    return result;
  }, [books]);

  const max = Math.max(...months.map((m) => m.count), 1);
  const barW = 36, gap = 10, chartH = 100;

  return (
    <svg viewBox={`0 0 ${months.length * (barW + gap) + 10} ${chartH + 30}`} className="w-full" style={{ minHeight: 100 }}>
      {months.map((m, i) => {
        const barH = Math.max((m.count / max) * chartH, m.count > 0 ? 6 : 0);
        const x = 5 + i * (barW + gap);
        const y = chartH - barH;
        return (
          <g key={i}>
            {m.count === 0
              ? <rect x={x} y={chartH - 2} width={barW} height={2} rx={1} fill="#e5e7eb" />
              : <rect x={x} y={y} width={barW} height={barH} rx={4} fill="#22c55e" opacity="0.85" />
            }
            <text x={x + barW / 2} y={chartH + 16} textAnchor="middle" fontSize="10" fill="#9ca3af">{m.label}</text>
            {m.count > 0 && (
              <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize="11" fill="#16a34a" fontWeight="bold">{m.count}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function StatsModal({ readBooks, onClose }) {
  const genreCounts = useMemo(() => {
    const c = {};
    readBooks.forEach((b) => { c[b.genre] = (c[b.genre] || 0) + 1; });
    return Object.entries(c).sort((a, b) => b[1] - a[1]);
  }, [readBooks]);

  const thisMonth = useMemo(() => {
    const now = new Date();
    return readBooks.filter((b) => {
      const d = new Date(b.createdAt);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;
  }, [readBooks]);

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div
        className="w-full rounded-t-3xl bg-white"
        style={{ maxHeight: '85vh', overflowY: 'auto', paddingBottom: 'env(safe-area-inset-bottom)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full bg-gray-200" /></div>
        <div className="px-5 pb-2 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">📊 読書統計</h2>
            <p className="text-xs text-gray-400">今月 {thisMonth}冊 · 合計 {readBooks.length}冊</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400"><X size={20} /></button>
        </div>

        <div className="px-5 pb-8 space-y-6">
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-3">📅 月別読書数（過去6ヶ月）</p>
            <div className="bg-green-50 rounded-2xl p-4">
              {readBooks.length === 0
                ? <p className="text-xs text-gray-400 text-center py-6">まだ本がありません</p>
                : <MonthlyChart books={readBooks} />
              }
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-3">📚 ジャンル別内訳</p>
            <div className="space-y-2">
              {genreCounts.length === 0
                ? <p className="text-xs text-gray-400 text-center py-4">まだ本がありません</p>
                : genreCounts.map(([genre, count]) => {
                  const g = GENRES[genre];
                  const pct = Math.round((count / readBooks.length) * 100);
                  return (
                    <div key={genre}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">{g.emoji} {g.label}</span>
                        <span className="text-xs font-bold" style={{ color: g.darkColor }}>{count}冊 ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: g.color }} />
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl p-4 text-center" style={{ background: '#fef3c7' }}>
              <p className="text-2xl font-bold text-amber-600">{readBooks.filter((b) => b.isFavorite).length}</p>
              <p className="text-xs text-amber-700 mt-1">⭐ お気に入り</p>
            </div>
            <div className="rounded-2xl p-4 text-center" style={{ background: '#f0fdf4' }}>
              <p className="text-2xl font-bold text-green-600">{readBooks.filter((b) => b.review && b.review.length > 0).length}</p>
              <p className="text-xs text-green-700 mt-1">📝 感想あり</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
