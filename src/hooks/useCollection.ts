
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface CollectionItem {
  id: string;
  name: string;
  image?: string;
  price?: number;
  supplier?: string;
  material?: string;
  addedAt: Date;
}

export function useCollection() {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadCollection = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Try to load from favorites table
        const { data: favorites, error } = await supabase
          .from('favorites')
          .select(`
            id,
            fabric_id,
            created_at,
            fabrics!inner (
              id,
              name,
              image_url,
              price_per_yard,
              supplier,
              material
            )
          `)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error loading collection from server:', error);
          // Load from localStorage as fallback
          const savedCollection = localStorage.getItem(`collection_${user.id}`);
          if (savedCollection) {
            const parsed = JSON.parse(savedCollection);
            setItems(parsed.map((item: any) => ({
              ...item,
              addedAt: new Date(item.addedAt)
            })));
          }
        } else if (favorites) {
          // Transform favorites data to collection items
          const collectionItems: CollectionItem[] = favorites.map(fav => ({
            id: fav.fabric_id || fav.id,
            name: fav.fabrics?.name || 'Unknown Item',
            image: fav.fabrics?.image_url,
            price: fav.fabrics?.price_per_yard,
            supplier: fav.fabrics?.supplier,
            material: fav.fabrics?.material,
            addedAt: new Date(fav.created_at)
          }));
          setItems(collectionItems);
        }
      } catch (error) {
        console.error('Error loading collection:', error);
        // Load from localStorage as fallback
        const savedCollection = localStorage.getItem(`collection_${user?.id}`);
        if (savedCollection) {
          try {
            const parsed = JSON.parse(savedCollection);
            setItems(parsed.map((item: any) => ({
              ...item,
              addedAt: new Date(item.addedAt)
            })));
          } catch (parseError) {
            console.error('Error parsing saved collection:', parseError);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadCollection();
  }, [user]);

  const addItem = async (item: Omit<CollectionItem, 'addedAt'>) => {
    const newItem: CollectionItem = {
      ...item,
      addedAt: new Date()
    };

    setItems(prev => [newItem, ...prev]);

    // Save to both database and localStorage
    if (user) {
      try {
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            fabric_id: item.id
          });
      } catch (error) {
        console.error('Error saving to database:', error);
      }

      // Always save to localStorage as backup
      const updatedItems = [newItem, ...items];
      localStorage.setItem(`collection_${user.id}`, JSON.stringify(updatedItems));
    }
  };

  const removeItem = async (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));

    if (user) {
      try {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('fabric_id', itemId);
      } catch (error) {
        console.error('Error removing from database:', error);
      }

      // Update localStorage
      const updatedItems = items.filter(item => item.id !== itemId);
      localStorage.setItem(`collection_${user.id}`, JSON.stringify(updatedItems));
    }
  };

  const isInCollection = (itemId: string) => {
    return items.some(item => item.id === itemId);
  };

  return {
    items,
    loading,
    addItem,
    removeItem,
    isInCollection,
    count: items.length
  };
}
