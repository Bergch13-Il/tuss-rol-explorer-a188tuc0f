import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  TussItem,
  CbhpmItem,
  SearchResult,
  ChatMessage,
  ViewMode,
  SearchFilter,
} from '@/lib/types'
import { MOCK_TUSS_DATA, MOCK_CBHPM_DATA } from '@/lib/mockData'
import { toast } from 'sonner'

interface DataContextType {
  tussData: TussItem[]
  cbhpmData: CbhpmItem[]
  isDataLoaded: boolean
  isChatProcessed: boolean
  loadData: (type: 'tuss' | 'cbhpm' | 'both', file?: File) => void
  processForChat: () => void
  clearData: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResults: SearchResult[]
  activeTab: string
  setActiveTab: (tab: string) => void
  chatHistory: ChatMessage[]
  addChatMessage: (message: ChatMessage) => void
  clearChat: () => void
  tabs: string[]
  addTab: (tabName: string) => void
  removeTab: (tabName: string) => void
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  searchFilter: SearchFilter
  setSearchFilter: (filter: SearchFilter) => void
  isTabMode: boolean
  setIsTabMode: (isTabMode: boolean) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [tussData, setTussData] = useState<TussItem[]>([])
  const [cbhpmData, setCbhpmData] = useState<CbhpmItem[]>([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [isChatProcessed, setIsChatProcessed] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  const [activeTab, setActiveTab] = useState('Geral')
  const [tabs, setTabs] = useState<string[]>(['Geral'])

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])

  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [searchFilter, setSearchFilter] = useState<SearchFilter>('all')
  const [isTabMode, setIsTabMode] = useState(false)

  useEffect(() => {
    const savedLoaded = localStorage.getItem('tuss_data_loaded')
    if (savedLoaded === 'true') {
      setTussData(MOCK_TUSS_DATA)
      setCbhpmData(MOCK_CBHPM_DATA)
      setIsDataLoaded(true)
    }
  }, [])

  const loadData = (type: 'tuss' | 'cbhpm' | 'both', file?: File) => {
    // Simulate parsing logic
    if (type === 'tuss' || type === 'both') {
      setTussData(MOCK_TUSS_DATA)
    }
    if (type === 'cbhpm' || type === 'both') {
      setCbhpmData(MOCK_CBHPM_DATA)
    }

    setIsDataLoaded(true)
    localStorage.setItem('tuss_data_loaded', 'true')

    // If a file name is provided, we can simulate specific behavior,
    // but for now we just load mock data
    console.log(`Loaded ${type} data${file ? ` from ${file.name}` : ''}`)
  }

  const processForChat = () => {
    setIsChatProcessed(true)
    toast.success('Data processed for AI context', {
      description: `${tussData.length} TUSS codes and ${cbhpmData.length} CBHPM codes ready.`,
    })
  }

  const clearData = () => {
    setTussData([])
    setCbhpmData([])
    setIsDataLoaded(false)
    setIsChatProcessed(false)
    setSearchResults([])
    setSearchQuery('')
    localStorage.removeItem('tuss_data_loaded')
  }

  const addTab = (tabName: string) => {
    if (!isTabMode) return
    if (!tabs.includes(tabName)) {
      setTabs([...tabs, tabName])
    }
    setActiveTab(tabName)
  }

  const removeTab = (tabName: string) => {
    const newTabs = tabs.filter((t) => t !== tabName)
    setTabs(newTabs)
    if (activeTab === tabName) {
      setActiveTab(newTabs[0] || 'Geral')
    }
  }

  const addChatMessage = (message: ChatMessage) => {
    setChatHistory((prev) => [...prev, message])
  }

  const clearChat = () => {
    setChatHistory([])
  }

  // Search Logic
  useEffect(() => {
    if (!searchQuery || !isDataLoaded) {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    let results: SearchResult[] = []

    // Search TUSS
    tussData.forEach((item) => {
      if (
        item.code.includes(query) ||
        item.term.toLowerCase().includes(query)
      ) {
        const cleanTussCode = item.code.replace(/\D/g, '').substring(0, 6)
        const correlations = cbhpmData.filter((cb) =>
          cb.code.replace(/\D/g, '').startsWith(cleanTussCode),
        )

        results.push({
          id: `tuss-${item.code}`,
          type: 'TUSS',
          data: item,
          correlations,
        })
      }
    })

    // Search CBHPM if needed or mixed
    cbhpmData.forEach((item) => {
      if (
        item.code.includes(query) ||
        item.term.toLowerCase().includes(query)
      ) {
        const cleanCbhpmCode = item.code.replace(/\D/g, '').substring(0, 6)
        const correlations = tussData.filter((tuss) =>
          tuss.code.replace(/\D/g, '').startsWith(cleanCbhpmCode),
        )

        results.push({
          id: `cbhpm-${item.code}`,
          type: 'CBHPM',
          data: item,
          correlations,
        })
      }
    })

    // Apply Filter
    if (searchFilter === 'correlated') {
      results = results.filter((r) => r.correlations.length > 0)
    } else if (searchFilter === 'uncorrelated') {
      results = results.filter((r) => r.correlations.length === 0)
    }

    setSearchResults(results)
  }, [searchQuery, isDataLoaded, tussData, cbhpmData, searchFilter])

  return (
    <DataContext.Provider
      value={{
        tussData,
        cbhpmData,
        isDataLoaded,
        isChatProcessed,
        loadData,
        processForChat,
        clearData,
        searchQuery,
        setSearchQuery,
        searchResults,
        activeTab,
        setActiveTab,
        chatHistory,
        addChatMessage,
        clearChat,
        tabs,
        addTab,
        removeTab,
        viewMode,
        setViewMode,
        searchFilter,
        setSearchFilter,
        isTabMode,
        setIsTabMode,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

const useDataStore = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useDataStore must be used within a DataProvider')
  }
  return context
}

export default useDataStore
