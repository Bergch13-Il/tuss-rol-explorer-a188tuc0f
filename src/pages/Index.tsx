import { useEffect } from 'react'
import { FileUploader } from '@/components/FileUploader'
import { SearchBar } from '@/components/SearchBar'
import { ResultCard } from '@/components/ResultCard'
import useDataStore from '@/stores/useDataStore'
import { FileCheck, Activity, Layers } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function Index() {
  const {
    isDataLoaded,
    searchResults,
    tussData,
    cbhpmData,
    activeTab,
    setActiveTab,
    tabs,
    addTab,
    removeTab,
  } = useDataStore()

  if (!isDataLoaded) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
            TUSS ROL Explorer
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Intelligent correlation between ANS tables and CBHPM. Upload your
            files to begin auditing and validating procedures.
          </p>
        </div>
        <FileUploader />
      </div>
    )
  }

  return (
    <div className="container py-8 px-4 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total TUSS Codes
            </CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tussData.length}</div>
            <p className="text-xs text-muted-foreground">
              Active procedure codes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CBHPM Base</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cbhpmData.length}</div>
            <p className="text-xs text-muted-foreground">
              Reference procedures
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Correlations</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">Processing complete</p>
          </CardContent>
        </Card>
      </div>

      <SearchBar />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="Geral" className="space-y-4">
          {searchResults.length > 0 ? (
            <div className="grid gap-4">
              {searchResults.map((result) => (
                <ResultCard key={result.id} result={result} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg">
              <p>No results found. Try searching for a code or term.</p>
              <p className="text-sm mt-2">Example: "31001017" or "Parto"</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
