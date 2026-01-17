import { Link, useLocation } from 'react-router-dom'
import {
  Trash2,
  Settings,
  MessageSquare,
  LayoutDashboard,
  Database,
} from 'lucide-react'
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <Database className="h-5 w-5" />
            </div>
            <span className="text-primary hidden md:inline-block">
              TUSS ROL Explorer
            </span>
          </Link>

          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link
              to="/"
              className={cn(
                'transition-colors hover:text-foreground/80',
                location.pathname === '/'
                  ? 'text-foreground'
                  : 'text-foreground/60',
              )}
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </span>
            </Link>
            <Link
              to="/chat"
              className={cn(
                'transition-colors hover:text-foreground/80',
                location.pathname === '/chat'
                  ? 'text-foreground'
                  : 'text-foreground/60',
              )}
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                AI Chat
              </span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {isDataLoaded && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearData}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-5 w-5" />
                  <span className="sr-only">Clear Data</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Limpar Dados</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/connection">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Conexão & Configuração</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  )
}
