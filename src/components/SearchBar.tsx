import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import useDataStore from '@/stores/useDataStore'

export function SearchBar() {
  const { searchQuery, setSearchQuery, isDataLoaded } = useDataStore()

  if (!isDataLoaded) return null

  return (
    <div className="relative w-full max-w-3xl mx-auto mb-8">
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for codes (e.g., 31001017) or terminology..."
          className="pl-10 pr-4 h-12 text-lg shadow-sm rounded-full border-muted-foreground/20 focus-visible:ring-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-2 text-muted-foreground hover:text-foreground"
            onClick={() => setSearchQuery('')}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
