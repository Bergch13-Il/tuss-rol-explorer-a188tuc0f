import { Link, useLocation } from 'react-router-dom'
import { Trash2, Settings, MessageSquare, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useDataStore from '@/stores/useDataStore'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export function Header() {
  const { clearData, isDataLoaded } = useDataStore()
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-md">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight text-white">
                Consulta TUSS - Rol ANS - Carlos e Berg
              </span>
              <span className="text-[10px] md:text-xs text-primary-foreground/70 font-light">
                Sistema de correlação entre Terminologia TUSS e Rol de
                Procedimentos ANS
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {isDataLoaded && (
            <Button
              variant="destructive"
              size="sm"
              onClick={clearData}
              className="hidden md:flex bg-red-500 hover:bg-red-600 border-none shadow-sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Dados
            </Button>
          )}

          <Link to="/chat">
            <Button
              variant="secondary"
              size="sm"
              className={cn(
                'bg-[#cda45e] hover:bg-[#b89354] text-white border-none shadow-sm',
                location.pathname === '/chat' && 'ring-2 ring-white/30',
              )}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat IA
            </Button>
          </Link>

          <Link to="/connection">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Conexão
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
