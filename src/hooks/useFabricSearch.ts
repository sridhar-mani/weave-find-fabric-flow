
import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAnalytics } from './useAnalytics';

interface Fabric {
  id: string;
  code: string;
  name: string;
  construction: string;
  gsm: number;
  width_cm: number;
  min_order_m: number;
  base_price: number;
  finishes: string[];
}

export function useFabricSearch() {
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { trackEvent } = useAnalytics();

  const searchFabrics = async (
    query?: string,
    construction?: string,
    minGsm: number = 0,
    maxGsm: number = 2000
  ) => {
    if (!isSupabaseConfigured) {
      console.log('Search request (Supabase not configured):', { query, construction, minGsm, maxGsm })
      setError('Supabase not configured. Please set up your environment variables.')
      return
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.rpc('search_fabrics', {
        p_query: query || null,
        p_construction: construction || null,
        p_min_gsm: minGsm,
        p_max_gsm: maxGsm
      });

      if (error) throw error;
      
      setFabrics(data || []);
      
      // Track search event
      await trackEvent('fabric_search', {
        query,
        construction,
        minGsm,
        maxGsm,
        results_count: data?.length || 0
      });
    } catch (err: any) {
      setError(err.message);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFabricByCode = async (code: string) => {
    if (!isSupabaseConfigured) {
      console.log('Fabric fetch request (Supabase not configured):', code)
      setError('Supabase not configured. Please set up your environment variables.')
      return null
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('fabric')
        .select(`
          *,
          variants:variant(*),
          fabric_trims:fabric_trim(
            recommended,
            trim:trim(*)
          ),
          fabric_certs:fabric_cert(
            cert:cert(*)
          ),
          price_breaks:price_break(*)
        `)
        .eq('code', code)
        .single();

      if (error) throw error;
      
      // Track fabric view
      await trackEvent('fabric_view', { code });
      
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Fabric fetch error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fabrics,
    loading,
    error,
    searchFabrics,
    getFabricByCode
  };
}
