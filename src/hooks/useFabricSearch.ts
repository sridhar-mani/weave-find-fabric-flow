
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface SearchFilters {
  query?: string;
  category?: string;
  construction?: string[];
  gsmRange?: [number, number];
  finishes?: string[];
  certifications?: string[];
  priceRange?: [number, number];
}

interface FabricSearchResult {
  id: string;
  name: string;
  category: string;
  construction: string;
  gsm: number;
  width: string;
  composition: string;
  finish: string;
  price: number;
  supplier: string;
  image?: string;
  certifications: string[];
  sustainability: string[];
}

export const useFabricSearch = (filters: SearchFilters) => {
  const [debouncedQuery, setDebouncedQuery] = useState(filters.query || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(filters.query || '');
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.query]);

  const searchFabrics = async (): Promise<FabricSearchResult[]> => {
    if (!isSupabaseConfigured) {
      // Return mock data when Supabase is not configured
      const mockFabrics: FabricSearchResult[] = [
        {
          id: 'f1',
          name: 'Organic Cotton Twill',
          category: 'Cotton',
          construction: 'Twill',
          gsm: 280,
          width: '150cm',
          composition: '100% Organic Cotton',
          finish: 'Enzyme Washed',
          price: 12.50,
          supplier: 'EcoTextiles Ltd',
          certifications: ['GOTS', 'OEKO-TEX'],
          sustainability: ['Organic', 'Fair Trade']
        },
        {
          id: 'f2',
          name: 'Linen Canvas',
          category: 'Linen',
          construction: 'Plain',
          gsm: 320,
          width: '140cm',
          composition: '100% Linen',
          finish: 'Stone Washed',
          price: 18.75,
          supplier: 'Natural Fibers Co',
          certifications: ['OEKO-TEX'],
          sustainability: ['Biodegradable']
        }
      ];

      // Apply filters to mock data
      return mockFabrics.filter(fabric => {
        if (debouncedQuery && !fabric.name.toLowerCase().includes(debouncedQuery.toLowerCase())) {
          return false;
        }
        if (filters.category && fabric.category !== filters.category) {
          return false;
        }
        if (filters.gsmRange && (fabric.gsm < filters.gsmRange[0] || fabric.gsm > filters.gsmRange[1])) {
          return false;
        }
        return true;
      });
    }

    const { data, error } = await supabase.rpc('search_fabrics', {
      search_query: debouncedQuery,
      filter_category: filters.category,
      filter_construction: filters.construction,
      gsm_min: filters.gsmRange?.[0],
      gsm_max: filters.gsmRange?.[1],
      filter_finishes: filters.finishes,
      filter_certifications: filters.certifications,
      price_min: filters.priceRange?.[0],
      price_max: filters.priceRange?.[1]
    });

    if (error) throw error;
    return data || [];
  };

  return useQuery({
    queryKey: ['fabrics', debouncedQuery, filters],
    queryFn: searchFabrics,
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
