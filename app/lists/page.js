'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '../lib/supabaseClient';

export default function Lists() {
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLists = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('shopping_lists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLists(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (listId) => {
    setIsDeleting(true);
    try {
      const { error } = await supabaseClient
        .from('shopping_lists')
        .delete()
        .eq('id', listId);

      if (error) throw error;
      
      // Refresh the lists after deletion
      await fetchLists();
      setDeleteConfirm(null);
    } catch (err) {
      setError('Error deleting list: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  if (isLoading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <p>Loading shopping lists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ 
        textAlign: 'center', 
        padding: '40px',
        backgroundColor: '#ffebee',
        color: '#c62828'
      }}>
        <p>Error loading lists: {error}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Your Shopping Lists</h2>
      <p className="muted">All your saved shopping lists in one place.</p>

      {lists.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p className="muted">No shopping lists saved yet.</p>
        </div>
      ) : (
        <div className="lists-grid">
          {lists.map((list) => (
            <div key={list.id} className="list-card">
              <div className="list-header">
                <div>
                  <h3>{list.title}</h3>
                  <span 
                    style={{ 
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      backgroundColor: 'var(--surface)',
                      color: 'var(--muted)',
                      marginTop: '4px'
                    }}
                  >
                    {list.category ? list.category.charAt(0).toUpperCase() + list.category.slice(1) : 'Other'}
                  </span>
                </div>
                <button
                  className="btn btn-danger btn-small"
                  onClick={() => setDeleteConfirm(list.id)}
                  disabled={isDeleting}
                  title="Delete list"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <div className="list-metadata">
                <span>Created: {new Date(list.created_at).toLocaleDateString()} at {new Date(list.created_at).toLocaleTimeString()}</span>
              </div>
              <ul className="bullet-list">
                {list.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              {deleteConfirm === list.id && (
                <div className="delete-confirm">
                  <p>Are you sure you want to delete this list?</p>
                  <div className="delete-actions">
                    <button 
                      className="btn btn-secondary btn-small"
                      onClick={() => setDeleteConfirm(null)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn btn-danger btn-small"
                      onClick={() => handleDelete(list.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
