import { useTimer } from '../hooks/useTimer';
import { X } from 'lucide-react';

const MINUTES_OPTIONS = [5, 10, 15, 20, 30];

export default function TimerModal({ onClose }) {
  const [selectedMin, setSelectedMin] = [10, () => {}];
  const { minutes, seconds, progress, isRunning, isComplete, start, pause, reset } = useTimer(10);

  const radius = 70;
  const circ = 2 * Math.PI * radius;
  const dashOffset = circ * (1 - progress);

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
          <h2 className="text-lg font-bold text-gray-800">⏱ まるまるタイマー</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="px-5 pb-8 flex flex-col items-center gap-6">
          {/* Timer ring */}
          <div className="relative" style={{ width: 180, height: 180 }}>
            <svg width="180" height="180">
              <circle cx="90" cy="90" r={radius} fill="none" stroke="#f0fdf4" strokeWidth="12" />
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={isComplete ? '#22c55e' : '#4ade80'}
                strokeWidth="12"
                strokeDasharray={circ}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform="rotate(-90 90 90)"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {isComplete ? (
                <span className="text-4xl">🌸</span>
              ) : (
                <>
                  <span className="text-4xl font-bold text-gray-800 font-mono">
                    {minutes}:{seconds}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">読書時間</span>
                </>
              )}
            </div>
          </div>

          {isComplete && (
            <div className="text-center">
              <p className="text-green-600 font-bold text-base">素晴らしい！ 🌿</p>
              <p className="text-gray-500 text-sm">今日も知識の根が育ちました</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-3">
            {!isRunning ? (
              <button
                onClick={start}
                className="px-8 py-3 rounded-2xl text-white font-bold"
                style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
              >
                {isComplete ? '🔄 もう一度' : '▶ スタート'}
              </button>
            ) : (
              <button
                onClick={pause}
                className="px-8 py-3 rounded-2xl font-bold bg-amber-100 text-amber-700"
              >
                ⏸ 一時停止
              </button>
            )}
            <button
              onClick={reset}
              className="px-5 py-3 rounded-2xl font-bold bg-gray-100 text-gray-600"
            >
              ↺ リセット
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center">
            毎日10分の読書で知識の森が育ちます 🌱
          </p>
        </div>
      </div>
    </div>
  );
}
