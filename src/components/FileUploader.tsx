import { useState, useCallback } from 'react'
import { Upload, FileSpreadsheet, Loader2, CheckCircle2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import useDataStore from '@/stores/useDataStore'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface DualFileUploaderProps {
  isOpen: boolean
  onClose: () => void
}

export function DualFileUploader({ isOpen, onClose }: DualFileUploaderProps) {
  const { loadData } = useDataStore()
  const [isUploading, setIsUploading] = useState(false)
  const [tussFile, setTussFile] = useState<File | null>(null)
  const [cbhpmFile, setCbhpmFile] = useState<File | null>(null)

  const handleUpload = () => {
    if (!tussFile && !cbhpmFile) {
      toast.error('Selecione pelo menos um arquivo para importar.')
      return
    }

    setIsUploading(true)

    // Simulate processing
    setTimeout(() => {
      loadData('both', tussFile || undefined)
      setIsUploading(false)
      toast.success('Arquivos processados com sucesso!', {
        description:
          'As tabelas TUSS e CBHPM foram carregadas e correlacionadas.',
      })
      onClose()
    }, 1500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar Tabelas</DialogTitle>
          <DialogDescription>
            Carregue os arquivos das tabelas TUSS/ROL e CBHPM para análise.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <FileDropZone
            label="Tabela TUSS / Rol ANS"
            file={tussFile}
            setFile={setTussFile}
            accept=".csv, .xlsx, .xls"
          />
          <FileDropZone
            label="Tabela CBHPM"
            file={cbhpmFile}
            setFile={setCbhpmFile}
            accept=".csv, .xlsx, .xls"
          />
        </div>

        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={handleUpload}
            disabled={isUploading || (!tussFile && !cbhpmFile)}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              'Importar Arquivos'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function FileDropZone({
  label,
  file,
  setFile,
  accept,
}: {
  label: string
  file: File | null
  setFile: (f: File | null) => void
  accept: string
}) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0])
      }
    },
    [setFile],
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
    maxFiles: 1,
  })

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/20 hover:border-primary/50'
        } ${file ? 'bg-green-50 border-green-200' : ''}`}
      >
        <input {...getInputProps()} />

        {file ? (
          <div className="flex items-center justify-center gap-2 text-green-700">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium truncate max-w-[200px]">
              {file.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-green-700 ml-2"
              onClick={(e) => {
                e.stopPropagation()
                setFile(null)
              }}
            >
              x
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <Upload className="h-5 w-5 mb-1" />
            <span className="text-xs">Arraste ou clique para selecionar</span>
            <span className="text-[10px] opacity-70">(.xlsx, .xls, .csv)</span>
          </div>
        )}
      </div>
    </div>
  )
}
