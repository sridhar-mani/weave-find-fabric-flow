
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

  return { trackEvent }
}
