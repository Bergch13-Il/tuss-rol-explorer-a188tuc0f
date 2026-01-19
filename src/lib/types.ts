export interface TussItem {
  code: string
  term: string
  startDate: string
  endDate: string
  dut: string
  subGroup: string
  group: string
  chapter: string
  rollStatus: string
  segmentation: string[] // OD, AMB, HCO, HSO, PAC
}

export interface CbhpmItem {
  code: string
  term: string
  porte: string
  uco: string
  aux: string
  anest: string
  filme: string
}

export interface SearchResult {
  id: string
  type: 'TUSS' | 'CBHPM'
  data: TussItem | CbhpmItem
  correlations: (TussItem | CbhpmItem)[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface AIProvider {
  id: 'openai' | 'groq' | 'openrouter' | 'gemini'
  name: string
  model: string
}

export type ViewMode = 'list' | 'compare'
export type SearchFilter = 'all' | 'correlated' | 'uncorrelated'

export type UserRole = 'admin' | 'user'

export interface User {
  id: string
  username: string
  password?: string
  role: UserRole
  createdAt: number
}
