import { useState } from 'react';
import { getSupabaseClient } from '../app/lib/supabaseClient';

export default function useSaveShoppingList() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const saveList = async (items, title, category) => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage('');

    try {
      // Format the items array according to the table structure
      const formattedItems = items.map(item => item.text || item);
      
      const client = getSupabaseClient();
      if (!client) {
        throw new Error('Supabase not configured');
      }

      const { data, error: saveError } = await client
        .from('shopping_lists')
        .insert([
          {
            items: formattedItems,
            title: title || `Shopping List ${new Date().toLocaleDateString()}`,
            category: category || 'other',
            metadata: { 
              created_from: 'web_app',
              created_at: new Date().toISOString()
            }
          }
        ])
        .select();

      if (saveError) throw saveError;

      setSuccessMessage('Shopping list saved successfully!');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);

      return data;
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveList,
    isSaving,
    error,
    successMessage
  };
}
