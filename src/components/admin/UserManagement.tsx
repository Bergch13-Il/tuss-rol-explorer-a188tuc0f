import { useState } from 'react'
import { Users, Trash2, Plus, Eye, EyeOff } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/stores/useAuthStore'
import { toast } from 'sonner'

export function UserManagement() {
  const { users, registerUser, deleteUser } = useAuthStore()

  // New User State
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Password Visibility State
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(
    new Set(),
  )

  const handleCreateUser = () => {
    if (!newUsername || !newPassword) {
      toast.error('Preencha todos os campos')
      return
    }
    registerUser(newUsername, newPassword)
    setNewUsername('')
    setNewPassword('')
    setIsDialogOpen(false)
  }

  const togglePasswordVisibility = (userId: string) => {
    const newSet = new Set(visiblePasswords)
    if (newSet.has(userId)) {
      newSet.delete(userId)
    } else {
      newSet.add(userId)
    }
    setVisiblePasswords(newSet)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <CardDescription>
            Visualize, adicione e remova usuários do sistema.
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Cadastrar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Usuário</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-user">Nome de Usuário</Label>
                <Input
                  id="new-user"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Ex: joaosilva"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-pass">Senha</Label>
                <Input
                  id="new-pass"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleCreateUser}>Cadastrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Senha</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Admin Row (Fixed) */}
            <TableRow>
              <TableCell className="font-medium flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded-full">
                  <Users className="h-3 w-3 text-primary" />
                </div>
                Berg (Admin)
              </TableCell>
              <TableCell>
                <span className="font-mono text-xs text-muted-foreground">
                  ••••••••
                </span>
              </TableCell>
              <TableCell>
                <Badge>Admin</Badge>
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" disabled>
                  <Trash2 className="h-4 w-4 opacity-50" />
                </Button>
              </TableCell>
            </TableRow>

            {/* Registered Users Rows */}
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs w-24 truncate">
                      {visiblePasswords.has(user.id)
                        ? user.password
                        : '••••••••'}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-foreground"
                      onClick={() => togglePasswordVisibility(user.id)}
                      title={
                        visiblePasswords.has(user.id)
                          ? 'Ocultar senha'
                          : 'Mostrar senha'
                      }
                    >
                      {visiblePasswords.has(user.id) ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">User</Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteUser(user.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    title="Remover usuário"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {users.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhum usuário adicional cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
