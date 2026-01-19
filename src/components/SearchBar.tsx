import { Search, Split, Layers, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useDataStore from '@/stores/useDataStore'
import { SearchFilter } from '@/lib/types'

export function SearchBar() {
  const {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    isTabMode,
    setIsTabMode,
    searchFilter,
    setSearchFilter,
    isDataLoaded,
  } = useDataStore()

  if (!isDataLoaded) return null

  return (
    <div className="w-full bg-card border rounded-lg shadow-sm p-2 flex flex-col md:flex-row gap-2 items-center">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Digite a terminologia, código ou procedimento..."
          className="pl-9 h-10 border-0 bg-muted/30 focus-visible:ring-0 focus-visible:bg-muted/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === 'compare' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() =>
              setViewMode(viewMode === 'compare' ? 'list' : 'compare')
            }
            className="h-9 gap-2 text-muted-foreground data-[state=active]:text-primary"
            data-state={viewMode === 'compare' ? 'active' : ''}
          >
            <Split className="h-4 w-4" />
            <span className="hidden sm:inline">Comparar</span>
          </Button>

          <Button
            variant={isTabMode ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setIsTabMode(!isTabMode)}
            className="h-9 gap-2 text-muted-foreground data-[state=active]:text-primary"
            data-state={isTabMode ? 'active' : ''}
          >
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Abas</span>
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 hidden md:block" />

        <Select
          value={searchFilter}
          onValueChange={(val) => setSearchFilter(val as SearchFilter)}
        >
          <SelectTrigger className="w-[140px] h-9 border-0 bg-muted/30 focus:ring-0">
            <Filter className="h-3 w-3 mr-2 opacity-50" />
            <SelectValue placeholder="Filtros" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="correlated">Com Correlação</SelectItem>
            <SelectItem value="uncorrelated">Sem Correlação</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
