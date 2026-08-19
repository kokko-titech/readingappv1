import { useState, useEffect } from 'react';

const STORAGE_KEY = 'chishiki-forest-books';

export function useBooks() {
  const [books, setBooks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }, [books]);

  const addBook = (book) => {
    const newBook = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      watered: false,
      wateredAt: null,
      ...book,
    };
    setBooks((prev) => [newBook, ...prev]);
    return newBook;
  };

  const updateBook = (id, updates) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBook = (id) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  const waterBook = (id) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, watered: true, wateredAt: new Date().toISOString() } : b
      )
    );
  };

  const readBooks = books.filter((b) => !b.isUnread);
  const unreadBooks = books.filter((b) => b.isUnread);

  return { books, readBooks, unreadBooks, addBook, updateBook, deleteBook, waterBook };
}
