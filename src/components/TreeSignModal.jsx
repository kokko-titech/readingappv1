import { useState } from 'react';
import { X } from 'lucide-react';

function getReadingStreak() {
  try {
    const dates = JSON.parse(localStorage.getItem('chishiki-reading-dates') || '[]');
    if (!dates.length) return 0;
    const unique = [...new Set(dates)].sort();
    const today = new Date().toISOString().slice(0, 10);
    let streak = 0;
    let check = today;
    for (let i = unique.length - 1; i >= 0; i--) {
      if (unique[i] === check) {
        streak++;
        const d = new Date(check);
        d.setDate(d.getDate() - 1);
        check = d.toISOString().slice(0, 10);
      } else if (unique[i] < check) {
        break;
      }
    }
    return streak;
  } catch { return 0; }
}

export default function TreeSignModal({ readBooks, onClose }) {
  const [treeName, setTreeName] = useState(() => localStorage.getItem('tree-name') || '');
  const [editing, setEditing] = useState(false);
  const streak = getReadingStreak();

  const saveName = () => {
    localStorage.setItem('tree-name', treeName);
    setEditing(false);
  };

  const displayName = treeName || '名もなき大樹';
  const badge =
    streak >= 30 ? '🏆 30日連続達成！' :
    streak >= 14 ? '🌟 2週間連続！' :
    streak >= 7  ? '⭐ 1週間連続！' : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
         style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="w-full rounded-3xl p-6 space-y-4" style={{ background: 'white', maxWidth: 340 }}
           onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">🪧 樹の看板</h2>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>

        {editing ? (
          <div className="space-y-2">
            <input
              autoFocus
              className="w-full border-2 border-green-400 rounded-xl px-3 py-2 text-sm focus:outline-none"
              value={treeName}
              onChange={e => setTreeName(e.target.value)}
              placeholder="樹の名前を入力（最大20文字）"
              maxLength={20}
            />
            <div className="flex gap-2">
              <button onClick={saveName}
                className="flex-1 py-2 rounded-xl text-white font-bold text-sm"
                style={{ background: '#16a34a' }}>保存</button>
              <button onClick={() => setEditing(false)}
                className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold">キャンセル</button>
            </div>
          </div>
        ) : (
          <div className="text-center py-1">
            <p className="text-2xl font-black text-gray-800">{displayName}</p>
            <button onClick={() => setEditing(true)}
              className="text-xs text-green-600 mt-1 underline">✏️ 名前を変える</button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-4 text-center" style={{ background: '#dcfce7' }}>
            <p className="text-3xl font-black text-green-700">{streak}</p>
            <p className="text-xs text-green-600 mt-1">🔥 連続読書日数</p>
          </div>
          <div className="rounded-2xl p-4 text-center" style={{ background: '#fef3c7' }}>
            <p className="text-3xl font-black text-amber-700">{readBooks.length}</p>
            <p className="text-xs text-amber-600 mt-1">📚 読了冊数</p>
          </div>
        </div>

        {badge && (
          <div className="rounded-2xl p-3 text-center" style={{ background: '#fef9c3' }}>
            <p className="text-sm font-bold text-amber-700">{badge}</p>
          </div>
        )}

        <p className="text-xs text-gray-400 text-center">毎日10分読書するとストリークが増えます</p>
      </div>
    </div>
  );
}
