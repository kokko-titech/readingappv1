import { useEffect } from 'react';
import { useTimer } from '../hooks/useTimer';
import { X } from 'lucide-react';

const SESSIONS_KEY = 'chishiki-reading-dates';

function saveReadingSession() {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const saved = JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
    if (!saved.includes(today)) {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify([today, ...saved]));
    }
  } catch {}
}
