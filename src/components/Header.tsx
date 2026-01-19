import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Trash2, MessageSquare, Database, LogOut, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useDataStore from '@/stores/useDataStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function Header() {
  const { clearData, isDataLoaded } = useDataStore()
  const { currentUser, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    clearData()
    navigate('/login')
  }

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
                Consulta TUSS - Rol ANS
              </span>
              <span className="text-[10px] md:text-xs text-primary-foreground/70 font-light hidden sm:inline-block">
                Sistema Inteligente de Correlação TUSS/CBHPM
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {currentUser && (
            <>
              {isDataLoaded && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={clearData}
                  className="hidden md:flex bg-red-500 hover:bg-red-600 border-none shadow-sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar
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
                  <span className="hidden sm:inline">Chat IA</span>
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full ml-2 border border-white/20"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary-foreground text-primary font-bold">
                        {currentUser.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser.username}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.role === 'admin'
                          ? 'Administrador'
                          : 'Usuário Padrão'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {currentUser.role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Painel Admin</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
