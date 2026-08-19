import { X } from 'lucide-react';

const MOCK_FRIENDS = [
  { id: 1, name: 'ゆきさん', count: 42, emoji: '🌳', stage: '大木' },
  { id: 2, name: 'こうたくん', count: 18, emoji: '🌿', stage: '中木' },
  { id: 3, name: 'あやかさん', count: 7,  emoji: '🌱', stage: '小木' },
  { id: 4, name: 'けんじさん', count: 63, emoji: '🌲', stage: '大樹' },
  { id: 5, name: 'みさきさん', count: 2,  emoji: '🌿', stage: '芽生え' },
];

function FriendTree({ friend }) {
  const h = Math.min(20 + friend.count * 2, 80);
  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer">
      <div
        className="flex flex-col items-center justify-end"
        style={{ height: 80 }}
      >
        <span style={{ fontSize: 12 + Math.min(friend.count * 0.5, 24) }}>
          {friend.emoji}
        </span>
      </div>
      <p className="text-xs font-semibold text-gray-700 text-center leading-tight">{friend.name}</p>
      <p className="text-xs text-gray-400">{friend.count}冊</p>
    </div>
  );
}

export default function ForestMap({ onClose, myCount }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-3xl bg-white"
        style={{ maxHeight: '80vh', paddingBottom: 'env(safe-area-inset-bottom)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>
        <div className="px-5 pb-2 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">🗺 みんなの森マップ</h2>
            <p className="text-xs text-gray-400">フォロワーの知識の樹を探検</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400"><X size={20} /></button>
        </div>

        {/* Forest panorama */}
        <div
          className="mx-4 rounded-2xl p-4 mb-4 overflow-x-auto"
          style={{ background: 'linear-gradient(to bottom, #bfdbfe 0%, #dcfce7 60%, #86efac 100%)' }}
        >
          <div className="flex gap-6 items-end justify-around min-w-max px-2" style={{ minHeight: 120 }}>
            {/* My tree */}
            <div className="flex flex-col items-center gap-1">
              <div style={{ height: 80 }} className="flex items-end">
                <span style={{ fontSize: 18 + Math.min(myCount * 0.3, 20) }}>
                  {myCount >= 50 ? '🌲' : myCount >= 20 ? '🌳' : myCount >= 5 ? '🌿' : '🌱'}
                </span>
              </div>
              <p className="text-xs font-bold text-green-700">あなた</p>
              <p className="text-xs text-gray-500">{myCount}冊</p>
            </div>
            {MOCK_FRIENDS.map((f) => (
              <FriendTree key={f.id} friend={f} />
            ))}
          </div>
        </div>

        <div className="px-5 pb-6">
          <p className="text-xs text-gray-400 text-center">
            ※ みんなの森はデモ表示です。フォロー機能は近日公開予定 🌿
          </p>
        </div>
      </div>
    </div>
  );
}
