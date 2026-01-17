import React, { createContext, useContext, useState, useEffect } from 'react'
import { TussItem, CbhpmItem, SearchResult, ChatMessage } from '@/lib/types'
import { MOCK_TUSS_DATA, MOCK_CBHPM_DATA } from '@/lib/mockData'

interface DataContextType {
  tussData: TussItem[]
  cbhpmData: CbhpmItem[]
  isDataLoaded: boolean
  loadData: () => void
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
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [tussData, setTussData] = useState<TussItem[]>([])
  const [cbhpmData, setCbhpmData] = useState<CbhpmItem[]>([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [activeTab, setActiveTab] = useState('Geral')
  const [tabs, setTabs] = useState<string[]>(['Geral'])
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])

  useEffect(() => {
    const savedLoaded = localStorage.getItem('tuss_data_loaded')
    if (savedLoaded === 'true') {
      // Restore simulated data
      setTussData(MOCK_TUSS_DATA)
      setCbhpmData(MOCK_CBHPM_DATA)
      setIsDataLoaded(true)
    }
  }, [])

  const loadData = () => {
    setTussData(MOCK_TUSS_DATA)
    setCbhpmData(MOCK_CBHPM_DATA)
    setIsDataLoaded(true)
    localStorage.setItem('tuss_data_loaded', 'true')
  }

  const clearData = () => {
    setTussData([])
    setCbhpmData([])
    setIsDataLoaded(false)
    setSearchResults([])
    setSearchQuery('')
    localStorage.removeItem('tuss_data_loaded')
  }

  const addTab = (tabName: string) => {
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

  // Basic search logic
  useEffect(() => {
    if (!searchQuery || !isDataLoaded) {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results: SearchResult[] = []

    // Search TUSS
    tussData.forEach((item) => {
      if (
        item.code.includes(query) ||
        item.term.toLowerCase().includes(query)
      ) {
        // Find correlation mock logic (simple matching by similar code)
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

    // Search CBHPM if no TUSS found or mix
    cbhpmData.forEach((item) => {
      if (
        item.code.includes(query) ||
        item.term.toLowerCase().includes(query)
      ) {
        // Avoid duplicates if already found via TUSS correlation?
        // For simplicity, we just list matches.
        // Reverse correlation
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

    setSearchResults(results)
  }, [searchQuery, isDataLoaded, tussData, cbhpmData])

  return (
    <DataContext.Provider
      value={{
        tussData,
        cbhpmData,
        isDataLoaded,
        loadData,
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
