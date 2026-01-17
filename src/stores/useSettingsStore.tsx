import React, { createContext, useContext, useState, useEffect } from 'react'
import { AIProvider } from '@/lib/types'

interface SettingsContextType {
  apiKey: string
  setApiKey: (key: string) => void
  selectedProvider: AIProvider['id']
  setProvider: (provider: AIProvider['id']) => void
  selectedModel: string
  setModel: (model: string) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
)

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem('tuss_ai_key') || '',
  )
  const [selectedProvider, setProvider] = useState<AIProvider['id']>(
    () =>
      (localStorage.getItem('tuss_ai_provider') as AIProvider['id']) ||
      'openai',
  )
  const [selectedModel, setModel] = useState(
    () => localStorage.getItem('tuss_ai_model') || 'gpt-4o-mini',
  )

  useEffect(() => {
    localStorage.setItem('tuss_ai_key', apiKey)
  }, [apiKey])

  useEffect(() => {
    localStorage.setItem('tuss_ai_provider', selectedProvider)
  }, [selectedProvider])

  useEffect(() => {
    localStorage.setItem('tuss_ai_model', selectedModel)
  }, [selectedModel])

  return (
    <SettingsContext.Provider
      value={{
        apiKey,
        setApiKey,
        selectedProvider,
        setProvider,
        selectedModel,
        setModel,
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
