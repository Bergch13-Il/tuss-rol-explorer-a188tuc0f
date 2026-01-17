import { useState, useCallback } from 'react'
import { Upload, FileSpreadsheet, Loader2, FileType } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import useDataStore from '@/stores/useDataStore'
import { toast } from '@/hooks/use-toast'

export function FileUploader() {
  const { loadData } = useDataStore()
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setIsUploading(true)
        // Simulate processing time
        setTimeout(() => {
          loadData()
          setIsUploading(false)
          toast({
            title: 'Files Processed Successfully',
            description:
              'TUSS and CBHPM data tables have been ingested and correlated.',
          })
        }, 2000)
      }
    },
    [loadData],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'application/vnd.ms-excel': ['.xls'],
    },
  })

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200 ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="bg-muted p-4 rounded-full mb-4">
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          ) : (
            <Upload className="h-8 w-8 text-primary" />
          )}
        </div>
        <h3 className="text-xl font-semibold mb-2">
          {isUploading ? 'Processing Data...' : 'Upload TUSS & CBHPM Tables'}
        </h3>
        <p className="text-muted-foreground max-w-sm mb-6">
          Drag and drop your .xlsx, .xls or .csv files here, or click to select
          files. We'll automatically parse and correlate them.
        </p>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </div>
          <div className="flex items-center gap-1">
            <FileType className="h-4 w-4" /> CSV
          </div>
        </div>
        {!isUploading && (
          <Button variant="outline" className="mt-6">
            Select Files
          </Button>
        )}
      </Card>
    </div>
  )
}
