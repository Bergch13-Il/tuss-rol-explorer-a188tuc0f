import { useState } from 'react'
import { SearchResult, TussItem, CbhpmItem } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, Split } from 'lucide-react'
import { TussCbhpmComparison } from './TussCbhpmComparison'

interface ResultCardProps {
  result: SearchResult
}

export function ResultCard({ result }: ResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [compareMode, setCompareMode] = useState(false)

  const tussItem =
    result.type === 'TUSS' ? (result.data as TussItem) : undefined
  const cbhpmMatch =
    result.correlations.length > 0
      ? (result.correlations[0] as CbhpmItem)
      : undefined

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow duration-200 border-l-4 border-l-primary">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="font-mono bg-muted/50">
                {result.data.code}
              </Badge>
              <Badge
                className={
                  result.type === 'TUSS' ? 'bg-primary' : 'bg-accent text-black'
                }
              >
                {result.type}
              </Badge>
              {tussItem?.dut === 'Sim' && (
                <Badge
                  variant="secondary"
                  className="text-green-700 bg-green-50"
                >
                  DUT
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg font-medium leading-tight">
              {result.data.term}
            </CardTitle>
          </div>
          <div className="flex gap-2">
            {tussItem && (
              <Button
                variant={compareMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setCompareMode(!compareMode)
                  if (!compareMode) setIsExpanded(true)
                }}
                className="h-8"
              >
                <Split className="h-4 w-4 mr-1" />
                Compare
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-2 animate-accordion-down">
          {compareMode && tussItem ? (
            <TussCbhpmComparison tuss={tussItem} cbhpm={cbhpmMatch} />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">
                    Details
                  </h4>
                  {result.type === 'TUSS' && tussItem && (
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">Group:</span>{' '}
                        {tussItem.group}
                      </p>
                      <p>
                        <span className="font-medium">Sub-group:</span>{' '}
                        {tussItem.subGroup}
                      </p>
                      <p>
                        <span className="font-medium">Roll Status:</span>{' '}
                        {tussItem.rollStatus}
                      </p>
                      <div className="flex gap-1 mt-2">
                        {tussItem.segmentation.map((seg) => (
                          <Badge
                            key={seg}
                            variant="secondary"
                            className="text-xs"
                          >
                            {seg}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.type === 'CBHPM' && (
                    <div className="text-sm space-y-1">
                      <p>CBHPM Details...</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">
                    Correlations ({result.correlations.length})
                  </h4>
                  {result.correlations.length > 0 ? (
                    <ul className="space-y-2">
                      {result.correlations.map((corr, idx) => (
                        <li
                          key={idx}
                          className="text-sm p-2 bg-muted/30 rounded border flex justify-between items-center"
                        >
                          <div>
                            <span className="font-mono font-bold text-xs block text-muted-foreground">
                              {corr.code}
                            </span>
                            <span className="line-clamp-1">{corr.term}</span>
                          </div>
                          {'porte' in corr && (
                            <Badge variant="outline" className="ml-2 shrink-0">
                              {(corr as CbhpmItem).porte}
                            </Badge>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No direct correlations found.
                    </p>
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
