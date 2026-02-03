import { supabase } from '@/lib/supabase/client'
import { AIConfig } from '@/lib/types'

const AI_CONFIG_KEY = 'ai_config'

export const settingsService = {
  async getAIConfig(): Promise<AIConfig | null> {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', AI_CONFIG_KEY)
      .single()

    if (error) {
      // If not found, return null
      if (error.code === 'PGRST116') return null
      console.error('Error fetching settings:', error)
      return null
    }

    return data?.value as AIConfig
  },

  async saveAIConfig(config: AIConfig): Promise<void> {
    // Check if exists first to decide insert or update, or use upsert
    const { error } = await supabase.from('app_settings').upsert(
      {
        key: AI_CONFIG_KEY,
        value: config,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' },
    )

    if (error) throw error
  },
}
