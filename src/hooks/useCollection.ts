
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface CollectionItem {
  id: string;
  name: string;
  type: 'fabric' | 'trim';
  image?: string;
  supplier: string;
  price: number;
  addedAt: string;
}

export const useCollection = () => {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const STORAGE_KEY = 'collection';

  // Load collection on mount
  useEffect(() => {
    loadCollection();
  }, [user]);

  const loadCollection = async () => {
    setIsLoading(true);
    try {
      // Always load from localStorage first
      const localItems = localStorage.getItem(STORAGE_KEY);
      if (localItems) {
        setItems(JSON.parse(localItems));
      }

      // If user is logged in and Supabase is configured, sync with server
      if (user && isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('collection')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading collection from server:', error);
        } else if (data) {
          const serverItems = data.map(item => ({
            id: item.fabric_id,
            name: item.fabric_name,
            type: item.fabric_type,
            image: item.fabric_image,
            supplier: item.supplier_name,
            price: item.price,
            addedAt: item.created_at
          }));
          setItems(serverItems);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serverItems));
        }
      }
    } catch (error) {
      console.error('Error loading collection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (item: Omit<CollectionItem, 'addedAt'>) => {
    const newItem: CollectionItem = {
      ...item,
      addedAt: new Date().toISOString()
    };

    const updatedItems = [newItem, ...items.filter(i => i.id !== item.id)];
    setItems(updatedItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));

    // Sync to server if logged in
    if (user && isSupabaseConfigured) {
      try {
        await supabase.from('collection').upsert({
          user_id: user.id,
          fabric_id: item.id,
          fabric_name: item.name,
          fabric_type: item.type,
          fabric_image: item.image,
          supplier_name: item.supplier,
          price: item.price
        });
      } catch (error) {
        console.error('Error syncing to server:', error);
      }
    }

    toast({
      title: 'Added to Collection',
      description: `${item.name} has been added to your collection.`
    });
  };

  const removeItem = async (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));

    // Remove from server if logged in
    if (user && isSupabaseConfigured) {
      try {
        await supabase
          .from('collection')
          .delete()
          .eq('user_id', user.id)
          .eq('fabric_id', itemId);
      } catch (error) {
        console.error('Error removing from server:', error);
      }
    }

    toast({
      title: 'Removed from Collection',
      description: 'Item has been removed from your collection.'
    });
  };

  const clearCollection = async () => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);

    if (user && isSupabaseConfigured) {
      try {
        await supabase
          .from('collection')
          .delete()
          .eq('user_id', user.id);
      } catch (error) {
        console.error('Error clearing server collection:', error);
      }
    }

    toast({
      title: 'Collection Cleared',
      description: 'All items have been removed from your collection.'
    });
  };

  return {
    items,
    isLoading,
    addItem,
    removeItem,
    clearCollection,
    refreshCollection: loadCollection
  };
};
