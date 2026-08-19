import { useState, useMemo } from 'react';
import { X } from 'lucide-react';

const SESSIONS_KEY = 'chishiki-reading-dates';
const WEEK_LABELS = ['日', '月', '火', '水', '木', '金', '土'];
const MONTH_NAMES = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

function getReadingSessions() {
  try {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
  } catch {
    return [];
  }
}

function toDateStr(isoStr) {
  return isoStr ? isoStr.slice(0, 10) : '';
}

export default function CalendarModal({ readBooks, onClose }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const readingDates = useMemo(() => new Set(getReadingSessions()), []);
  const bookDates = useMemo(() => {
    const m = {};
    readBooks.forEach((b) => {
      const d = toDateStr(b.createdAt);
      if (!m[d]) m[d] = [];
      m[d].push(b);
    });
    return m;
  }, [readBooks]);

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const days = useMemo(() => {
    const first = new Date(year, month, 1).getDay(); // 0=Sun
    const total = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < first; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(d);
    return cells;
  }, [year, month]);

  const todayStr = toDateStr(today.toISOString());

  // Aggregate stats for this month
  const monthReadDays = useMemo(() => {
    let count = 0;
    for (let d = 1; d <= new Date(year, month + 1, 0).getDate(); d++) {
      const str = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      if (readingDates.has(str)) count++;
    }
    return count;
  }, [year, month, readingDates]);

  const monthRegistered = useMemo(() => {
    return readBooks.filter((b) => {
      const d = new Date(b.createdAt);
      return d.getFullYear() === year && d.getMonth() === month;
    }).length;
  }, [year, month, readBooks]);

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div
        className="w-full rounded-t-3xl bg-white"
        style={{ maxHeight: '88vh', overflowY: 'auto', paddingBottom: 'env(safe-area-inset-bottom)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full bg-gray-200" /></div>

        {/* Header */}
        <div className="px-5 pb-2 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">📅 読書カレンダー</h2>
            <p className="text-xs text-gray-400">読んだ日 · 登録した日</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400"><X size={20} /></button>
        </div>

        {/* Month navigator */}
        <div className="flex items-center justify-between px-5 pb-3">
          <button onClick={prevMonth} className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 active:bg-gray-100 text-lg">‹</button>
          <p className="font-bold text-gray-800 text-base">{year}年 {MONTH_NAMES[month]}</p>
          <button onClick={nextMonth} className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 active:bg-gray-100 text-lg">›</button>
        </div>

        {/* Month stats */}
        <div className="flex gap-2 px-5 pb-4">
          <div className="flex-1 rounded-xl py-2.5 text-center" style={{ background: '#f0fdf4' }}>
            <p className="text-xl font-bold text-green-600">{monthReadDays}</p>
            <p className="text-xs text-green-700 mt-0.5">📖 読書した日</p>
          </div>
          <div className="flex-1 rounded-xl py-2.5 text-center" style={{ background: '#fef3c7' }}>
            <p className="text-xl font-bold text-amber-600">{monthRegistered}</p>
            <p className="text-xs text-amber-700 mt-0.5">📚 登録した本</p>
          </div>
        </div>

        {/* Weekday labels */}
        <div className="grid grid-cols-7 px-4 pb-1">
          {WEEK_LABELS.map((d, i) => (
            <div key={d} className="text-center text-xs font-semibold py-1" style={{ color: i === 0 ? '#ef4444' : i === 6 ? '#3b82f6' : '#9ca3af' }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 px-4 pb-6 gap-y-1">
          {days.map((d, i) => {
            if (!d) return <div key={`e-${i}`} />;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isToday = dateStr === todayStr;
            const isRead = readingDates.has(dateStr);
            const booksOnDay = bookDates[dateStr] || [];
            const hasBook = booksOnDay.length > 0;
            const isSun = new Date(year, month, d).getDay() === 0;
            const isSat = new Date(year, month, d).getDay() === 6;

            return (
              <div key={dateStr} className="flex flex-col items-center py-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold relative"
                  style={{
                    background: isToday ? '#22c55e' : 'transparent',
                    color: isToday ? 'white' : isSun ? '#ef4444' : isSat ? '#3b82f6' : '#374151',
                  }}
                >
                  {d}
                </div>
                {/* Dots */}
                <div className="flex gap-0.5 mt-0.5" style={{ minHeight: 6 }}>
                  {isRead && <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#22c55e' }} />}
                  {hasBook && <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#f59e0b' }} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-4 px-5 pb-6 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#22c55e' }} />
            <span className="text-xs text-gray-500">読書した日（10分タイマー）</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#f59e0b' }} />
            <span className="text-xs text-gray-500">本を登録した日</span>
          </div>
        </div>
      </div>
    </div>
  );
}
