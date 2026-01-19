import { useState } from 'react'
import { SearchResult, TussItem, CbhpmItem } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, Split } from 'lucide-react'
import { TussCbhpmComparison } from './TussCbhpmComparison'
import useDataStore from '@/stores/useDataStore'

interface ResultCardProps {
  result: SearchResult
}

export function ResultCard({ result }: ResultCardProps) {
  const { viewMode } = useDataStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [localCompareMode, setLocalCompareMode] = useState(false)

  const tussItem =
    result.type === 'TUSS' ? (result.data as TussItem) : undefined
  const cbhpmMatch =
    result.correlations.length > 0
      ? (result.correlations[0] as CbhpmItem)
      : undefined

  // Use global view mode or local override
  const isCompare = viewMode === 'compare' || localCompareMode
  const shouldExpand = isExpanded || viewMode === 'compare'

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow duration-200 border-l-4 border-l-primary overflow-hidden">
      <CardHeader className="pb-3 pt-4 px-4 bg-card">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge
                variant="outline"
                className="font-mono bg-muted/50 text-foreground"
              >
                {result.data.code}
              </Badge>
              <Badge
                className={
                  result.type === 'TUSS'
                    ? 'bg-primary hover:bg-primary/90'
                    : 'bg-accent text-accent-foreground hover:bg-accent/90'
                }
              >
                {result.type}
              </Badge>
              {tussItem?.dut === 'Sim' && (
                <Badge
                  variant="secondary"
                  className="text-green-700 bg-green-50 border-green-200"
                >
                  DUT
                </Badge>
              )}
            </div>
            <CardTitle className="text-base md:text-lg font-medium leading-snug text-foreground">
              {result.data.term}
            </CardTitle>
          </div>
          <div className="flex gap-1 shrink-0">
            {tussItem && viewMode !== 'compare' && (
              <Button
                variant={localCompareMode ? 'default' : 'ghost'}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setLocalCompareMode(!localCompareMode)
                  if (!localCompareMode) setIsExpanded(true)
                }}
                className="h-8 px-2"
                title="Alternar modo comparação"
              >
                <Split className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {shouldExpand ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {shouldExpand && (
        <CardContent className="pt-0 px-4 pb-4 animate-accordion-down">
          {isCompare && tussItem ? (
            <TussCbhpmComparison tuss={tussItem} cbhpm={cbhpmMatch} />
          ) : (
            <div className="space-y-4 pt-2 border-t mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Detalhes do Procedimento
                  </h4>
                  {result.type === 'TUSS' && tussItem && (
                    <div className="text-sm space-y-2">
                      <div className="grid grid-cols-[100px_1fr] gap-2">
                        <span className="text-muted-foreground">Grupo:</span>
                        <span className="font-medium">{tussItem.group}</span>
                      </div>
                      <div className="grid grid-cols-[100px_1fr] gap-2">
                        <span className="text-muted-foreground">
                          Sub-grupo:
                        </span>
                        <span className="font-medium">{tussItem.subGroup}</span>
                      </div>
                      <div className="grid grid-cols-[100px_1fr] gap-2">
                        <span className="text-muted-foreground">
                          Status Rol:
                        </span>
                        <span className="font-medium">
                          {tussItem.rollStatus}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-muted-foreground text-xs block mb-1">
                          Segmentação:
                        </span>
                        <div className="flex gap-1 flex-wrap">
                          {tussItem.segmentation.map((seg) => (
                            <Badge
                              key={seg}
                              variant="secondary"
                              className="text-xs border"
                            >
                              {seg}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Correlações Sugeridas ({result.correlations.length})
                  </h4>
                  {result.correlations.length > 0 ? (
                    <ul className="space-y-2">
                      {result.correlations.map((corr, idx) => (
                        <li
                          key={idx}
                          className="text-sm p-3 bg-muted/40 rounded-md border flex justify-between items-start gap-2"
                        >
                          <div className="flex-1">
                            <span className="font-mono font-bold text-xs text-primary block mb-0.5">
                              {corr.code}
                            </span>
                            <span className="text-sm leading-tight block">
                              {corr.term}
                            </span>
                          </div>
                          {'porte' in corr && (
                            <Badge
                              variant="outline"
                              className="ml-2 shrink-0 bg-background"
                            >
                              {(corr as CbhpmItem).porte}
                            </Badge>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 border border-dashed rounded-md text-center">
                      <p className="text-sm text-muted-foreground italic">
                        Nenhuma correlação direta encontrada.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
