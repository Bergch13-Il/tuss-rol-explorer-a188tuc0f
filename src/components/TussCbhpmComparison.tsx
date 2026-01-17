import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { TussItem, CbhpmItem } from '@/lib/types'
import { CheckCircle2, XCircle } from 'lucide-react'

interface ComparisonProps {
  tuss: TussItem
  cbhpm?: CbhpmItem
}

export function TussCbhpmComparison({ tuss, cbhpm }: ComparisonProps) {
  return (
    <div className="rounded-md border mt-4 overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[150px]">Attribute</TableHead>
            <TableHead className="text-primary font-bold">TUSS (ANS)</TableHead>
            <TableHead className="text-accent-foreground font-bold">
              CBHPM
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium text-muted-foreground">
              Code
            </TableCell>
            <TableCell className="font-mono">{tuss.code}</TableCell>
            <TableCell className="font-mono">
              {cbhpm?.code || <span className="text-muted-foreground">-</span>}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-muted-foreground">
              Terminology
            </TableCell>
            <TableCell className="max-w-xs">{tuss.term}</TableCell>
            <TableCell className="max-w-xs">
              {cbhpm?.term || <span className="text-muted-foreground">-</span>}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-muted-foreground">
              DUT / Coverage
            </TableCell>
            <TableCell>
              {tuss.dut === 'Sim' ? (
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800 hover:bg-green-200"
                >
                  DUT OK
                </Badge>
              ) : (
                <span className="text-muted-foreground text-sm">No DUT</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                {cbhpm && (
                  <>
                    <Badge variant="outline">Porte: {cbhpm.porte}</Badge>
                    <Badge variant="outline">UCO: {cbhpm.uco}</Badge>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-muted-foreground">
              Segmentation
            </TableCell>
            <TableCell>
              <div className="flex gap-1 flex-wrap">
                {tuss.segmentation.map((seg) => (
                  <Badge key={seg} variant="secondary" className="text-xs">
                    {seg}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              {cbhpm && (
                <div className="flex gap-1 text-xs text-muted-foreground">
                  <span>Aux: {cbhpm.aux}</span> |
                  <span>Anest: {cbhpm.anest}</span> |
                  <span>Filme: {cbhpm.filme}</span>
                </div>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-muted-foreground">
              Correlation Status
            </TableCell>
            <TableCell colSpan={2}>
              <div className="flex items-center gap-2">
                {cbhpm ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-green-700 font-medium">
                      Valid Correlation
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span className="text-red-700 font-medium">
                      No Correlation Found
                    </span>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
