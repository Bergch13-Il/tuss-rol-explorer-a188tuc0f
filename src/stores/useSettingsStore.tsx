import React, { createContext, useContext, useState, useEffect } from 'react'
import { AIProvider } from '@/lib/types'
import { settingsService } from '@/services/settingsService'
import { toast } from 'sonner'

interface SettingsContextType {
  apiKey: string
  setApiKey: (key: string) => void
  selectedProvider: AIProvider['id']
  setProvider: (provider: AIProvider['id']) => void
  selectedModel: string
  setModel: (model: string) => void
  isLoading: boolean
  saveSettings: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
)

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [apiKey, setApiKey] = useState('')
  const [selectedProvider, setProvider] = useState<AIProvider['id']>('openai')
  const [selectedModel, setModel] = useState('gpt-4o-mini')
  const [isLoading, setIsLoading] = useState(true)

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const config = await settingsService.getAIConfig()
        if (config) {
          setApiKey(config.apiKey || '')
          setProvider(config.provider || 'openai')
          setModel(config.model || 'gpt-4o-mini')
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [])

  const saveSettings = async () => {
    try {
      await settingsService.saveAIConfig({
        apiKey,
        provider: selectedProvider,
        model: selectedModel,
      })
      toast.success('Configurações Salvas', {
        description: 'As configurações de IA foram atualizadas globalmente.',
      })
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast.error('Erro ao salvar configurações.')
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        apiKey,
        setApiKey,
        selectedProvider,
        setProvider,
        selectedModel,
        setModel,
        isLoading,
        saveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

const useSettingsStore = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettingsStore must be used within a SettingsProvider')
  }
  return context
}

export default useSettingsStore
