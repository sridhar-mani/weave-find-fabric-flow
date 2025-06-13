
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from './useAuth'

export function useAnalytics() {
  const { user } = useAuth()

  const trackEvent = async (name: string, props?: Record<string, any>) => {
    if (!isSupabaseConfigured) {
      console.log('Analytics event (Supabase not configured):', name, props)
      return
    }

    try {
      await supabase.from('event').insert({
        user_id: user?.id || null,
        name,
        props: props || {}
      })
    } catch (error) {
      console.error('Analytics error:', error)
    }
  }

  // Convenience methods for common events
  const logFabricView = (fabricId: string) => {
    trackEvent('view_fabric', { fabric_id: fabricId })
  }

  const logAddToMoodboard = (fabricId: string) => {
    trackEvent('add_to_moodboard', { fabric_id: fabricId })
  }

  const logCompareOpen = (fabricIds: string[]) => {
    trackEvent('compare_open', { fabric_ids: fabricIds })
  }

  const logRequestSwatch = (fabricId: string) => {
    trackEvent('request_swatch', { fabric_id: fabricId })
  }

  return { 
    trackEvent,
    logFabricView,
    logAddToMoodboard,
    logCompareOpen,
    logRequestSwatch
  }
}
