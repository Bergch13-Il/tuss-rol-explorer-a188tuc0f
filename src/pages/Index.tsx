import { useState } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { ResultCard } from '@/components/ResultCard'
import useDataStore from '@/stores/useDataStore'
import { FileCheck, PlayCircle, FileText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DualFileUploader } from '@/components/FileUploader'
import { cn } from '@/lib/utils'

export default function Index() {
  const {
    isDataLoaded,
    tussData,
    cbhpmData,
    searchResults,
    activeTab,
    setActiveTab,
    tabs,
    removeTab,
    isTabMode,
    processForChat,
    isChatProcessed,
    loadData,
  } = useDataStore()

  const [showUploader, setShowUploader] = useState(false)

  const handleLoadDefault = () => {
    loadData('both')
  }

  return (
    <div className="container py-8 px-4 animate-fade-in max-w-5xl mx-auto space-y-6">
      {/* 1. Status Cards Section */}
      <div className="grid grid-cols-1 gap-4">
        {/* Card: Carregamento Automático */}
        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                Carregamento automático
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Bases prontas para pesquisa por código ou procedimento.
              </p>
            </div>

            <div className="flex gap-2">
              {isDataLoaded ? (
                <>
                  <Badge
                    variant="secondary"
                    className="px-3 py-1 bg-muted/50 text-foreground border-muted-foreground/20"
                  >
                    TUSS/ROL:{' '}
                    <span className="font-bold ml-1">{tussData.length}</span>
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="px-3 py-1 bg-muted/50 text-foreground border-muted-foreground/20"
                  >
                    CBHPM:{' '}
                    <span className="font-bold ml-1">{cbhpmData.length}</span>
                  </Badge>
                </>
              ) : (
                <Button size="sm" onClick={handleLoadDefault} variant="outline">
                  Carregar Dados Demo
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card: Processar para Chat */}
        <Card className="border-l-4 border-l-accent shadow-sm">
          <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                Processar para Chat
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Converta os dados em Markdown e JSON estruturado para melhorar a
                precisão do chat.
              </p>
            </div>

            <Button
              onClick={processForChat}
              disabled={!isDataLoaded || isChatProcessed}
              className={cn(
                'bg-[#1d4e75] text-white hover:bg-[#153a57]',
                isChatProcessed && 'bg-green-600 hover:bg-green-700',
              )}
            >
              {isChatProcessed ? (
                <>
                  <FileCheck className="mr-2 h-4 w-4" />
                  Processado
                </>
              ) : (
                <>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Processar Dados
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 2. Search Section */}
      <div className="space-y-4">
        <SearchBar />

        {isTabMode ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4 w-full justify-start overflow-x-auto bg-transparent border-b rounded-none h-auto p-0 gap-2">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-t-md rounded-b-none border border-b-0 data-[state=active]:bg-background data-[state=active]:border-border relative group px-4 py-2"
                >
                  {tab}
                  {tab !== 'Geral' && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation()
                        removeTab(tab)
                      }}
                      className="ml-2 hover:bg-destructive/10 rounded-full p-0.5 cursor-pointer"
                    >
                      &times;
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={activeTab} className="space-y-4">
              <ResultsList results={searchResults} />
            </TabsContent>
          </Tabs>
        ) : (
          <ResultsList results={searchResults} />
        )}
      </div>

      <DualFileUploader
        isOpen={showUploader}
        onClose={() => setShowUploader(false)}
      />
    </div>
  )
}

function ResultsList({ results }: { results: any[] }) {
  if (results.length > 0) {
    return (
      <div className="grid gap-4">
        {results.map((result) => (
          <ResultCard key={result.id} result={result} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <div className="bg-muted p-6 rounded-full">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-primary">
          Pronto para pesquisar!
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Digite pelo menos 2 caracteres no campo de busca para encontrar
          procedimentos por terminologia, código ou nome do procedimento.
        </p>
      </div>
      <div className="pt-4">
        <Badge
          variant="outline"
          className="bg-accent/20 text-accent-foreground border-accent/20 px-4 py-1"
        >
          TUSS/ROL: 6740 • CBHPM: 7871
        </Badge>
      </div>
    </div>
  )
}
