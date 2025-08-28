"use client";

import { useState, useEffect } from 'react';

export default function ShoppingList() {
  const STORAGE_KEY = 'shopaholic.items';
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      // ignore
    }
  }, [items]);

  function addItem() {
    const v = (text || '').trim();
    if (!v) return;
  const next = [...items, { id: Date.now(), text: v }];
    setItems(next);
    setText('');
  }

  function onKey(e) {
    if (e.key === 'Enter') addItem();
  }

  function removeItem(id) {
    setItems(items.filter((it) => it.id !== id));
  }

  return (
    <div className="card">
      <h3>Your Shopping List</h3>
      <p className="muted">Add items and remove them with the trash button.</p>

      <div style={{ display: 'flex', gap: 10, marginTop: 12, marginBottom: 12 }}>
        <input
          aria-label="Add item"
          placeholder="e.g. Bananas, Milk, Bread"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKey}
          style={{ flex: 1 }}
        />
        <button className="btn btn-primary" onClick={addItem} aria-label="Add">
          Add
        </button>
      </div>

      <div>
        {items.length === 0 && <p className="muted">No items yet — add one above.</p>}

        <ol className="shopping-list">
          {items.map((it) => (
            <li key={it.id}>
              <div className="item-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="item-text">{it.text}</div>
                </div>
              </div>

              <div>
                <button
                  className="btn btn-danger"
                  onClick={() => removeItem(it.id)}
                  aria-label={`Remove ${it.text}`}
                  title="Remove"
                  style={{ padding: 8, borderRadius: 8 }}
                >
                  {/* trash icon */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M3 6h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 11v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M14 11v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M9 3h6l-1 3H10L9 3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
