"use client";

import { useState, useEffect } from 'react';
import useSaveShoppingList from '../hooks/useSaveShoppingList';

export default function ShoppingList() {
  const STORAGE_KEY = 'shopaholic.items';
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const { saveList, isSaving, error, successMessage } = useSaveShoppingList();
  const [infoMsg, setInfoMsg] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

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

  function clearList() {
    setItems([]);
    setShowClearConfirm(false);
    setInfoMsg('Shopping list cleared');
    setTimeout(() => setInfoMsg(''), 5000);
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
        {items.length > 0 && (
          <button 
            className="btn btn-danger"
            onClick={() => setShowClearConfirm(true)}
            aria-label="Clear list"
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Clear Confirmation Dialog */}
      {showClearConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              maxWidth: '400px',
              width: '90%',
            }}
          >
            <h4 style={{ marginTop: 0 }}>Clear Shopping List?</h4>
            <p style={{ color: '#666' }}>Are you sure you want to clear all items from your shopping list? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setShowClearConfirm(false)}
                style={{ padding: '8px 16px' }}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={clearList}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                Clear List
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        {items.length === 0 && <p className="muted">No items yet  add one above.</p>}

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

      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <button
          className={`btn btn-primary ${isSaving ? 'opacity-75' : ''}`}
          onClick={async () => {
            try {
              const result = await saveList(items.map(it => it.text));
              if (result) {
                setInfoMsg('Shopping list saved successfully! ✓');
                setTimeout(() => {
                  setInfoMsg('');
                }, 5000);
              }
            } catch (err) {
              setInfoMsg('Error saving list: ' + err.message);
              setTimeout(() => {
                setInfoMsg('');
              }, 5000);
            }
          }}
          disabled={isSaving || items.length === 0}
          style={{
            position: 'relative',
            minWidth: '150px',
            backgroundColor: '#4CAF50',
            color: 'white',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          {isSaving ? (
            <>
              <span className="opacity-0">SAVE</span>
              <span className="absolute inset-0 flex items-center justify-center">
                Saving...
              </span>
            </>
          ) : (
            'SAVE'
          )}
        </button>
        
        {infoMsg && (
          <div
            style={{
              marginTop: 8,
              padding: '8px 12px',
              borderRadius: '4px',
              backgroundColor: infoMsg.includes('successfully') ? '#4CAF50' : infoMsg.includes('Error') ? '#f44336' : '#2196F3',
              color: 'white',
              opacity: 1,
              transition: 'opacity 0.3s ease-in-out',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            {infoMsg}
          </div>
        )}
      </div>
    </div>
  );
}
