
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export function useAnalytics() {
  const { user } = useAuth()

  const trackEvent = async (name: string, props?: Record<string, any>) => {
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
