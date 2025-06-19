
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from './useAuth';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  user_id?: string;
  session_id?: string;
  timestamp?: string;
}

export const useAnalytics = () => {
  const { user } = useAuth();

  const trackEvent = async (name: string, properties?: Record<string, any>) => {
    const event: AnalyticsEvent = {
      name,
      properties: {
        ...properties,
        url: window.location.href,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      },
      user_id: user?.id,
      session_id: sessionStorage.getItem('session_id') || crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };

    // Store session ID if not exists
    if (!sessionStorage.getItem('session_id')) {
      sessionStorage.setItem('session_id', event.session_id!);
    }

    // Console log for development
    console.log('Analytics Event:', event);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('analytics_events').insert(event);
      } catch (error) {
        console.error('Analytics error:', error);
      }
    }

    // Also send to any third-party analytics services
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', name, properties);
    }
  };

  const logFabricView = (fabricId: string, fabricName?: string) => {
    trackEvent('view_fabric', { 
      fabric_id: fabricId,
      fabric_name: fabricName
    });
  };

  const logAddToCollection = (fabricId: string, fabricName?: string) => {
    trackEvent('add_to_collection', { 
      fabric_id: fabricId,
      fabric_name: fabricName
    });
  };

  const logCompareOpen = (fabricIds: string[]) => {
    trackEvent('compare_open', { fabric_ids: fabricIds });
  };

  const logRequestSwatch = (fabricId: string, supplierName?: string) => {
    trackEvent('request_swatch', { 
      fabric_id: fabricId,
      supplier_name: supplierName
    });
  };

  const logReserveYardage = (fabricId: string, yards: number, supplierName?: string) => {
    trackEvent('reserve_yardage', { 
      fabric_id: fabricId, 
      yards,
      supplier_name: supplierName
    });
  };

  const logSearch = (query: string, resultsCount: number, filters?: any) => {
    trackEvent('search', {
      query,
      results_count: resultsCount,
      filters
    });
  };

  const logSupplierContact = (supplierId: string, supplierName?: string, method?: string) => {
    trackEvent('contact_supplier', {
      supplier_id: supplierId,
      supplier_name: supplierName,
      contact_method: method
    });
  };

  const logPageView = (page: string) => {
    trackEvent('page_view', { page });
  };

  return { 
    trackEvent,
    logFabricView,
    logAddToCollection,
    logCompareOpen,
    logRequestSwatch,
    logReserveYardage,
    logSearch,
    logSupplierContact,
    logPageView
  };
};
