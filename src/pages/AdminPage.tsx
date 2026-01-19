import { useState } from 'react'
import {
  Users,
  Settings,
  Trash2,
  Plus,
  Save,
  Key,
  Server,
  Cpu,
  Check,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/stores/useAuthStore'
import useSettingsStore from '@/stores/useSettingsStore'
import { AIProvider } from '@/lib/types'
import { toast } from 'sonner'

export default function AdminPage() {
  const { users, registerUser, deleteUser } = useAuthStore()

  // Connection Settings State
  const {
    apiKey,
    setApiKey,
    selectedProvider,
    setProvider,
    selectedModel,
    setModel,
  } = useSettingsStore()
  const [tempKey, setTempKey] = useState(apiKey)

  // New User State
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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

  const handleSaveSettings = () => {
    setApiKey(tempKey)
    toast.success('Configurações Salvas', {
      description: 'As configurações de IA foram atualizadas globalmente.',
    })
  }

  return (
    <div className="container py-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Painel Administrativo
        </h1>
        <p className="text-muted-foreground">
          Gerencie usuários e configurações globais do sistema.
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="connection" className="gap-2">
            <Settings className="h-4 w-4" />
            Configurações IA
          </TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-4 mt-6">
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
                    <TableHead>Função</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium flex items-center gap-2">
                      <div className="bg-primary/10 p-1.5 rounded-full">
                        <Users className="h-3 w-3 text-primary" />
                      </div>
                      Berg (Admin)
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
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.username}
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
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
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
        </TabsContent>

        {/* Connection Settings Tab */}
        <TabsContent value="connection" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                Provedor de IA Global
              </CardTitle>
              <CardDescription>
                Selecione o provedor de inteligência artificial que será
                utilizado por todos os usuários do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Provedor</Label>
                <Select
                  value={selectedProvider}
                  onValueChange={(val) => setProvider(val as AIProvider['id'])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um provedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="groq">Groq</SelectItem>
                    <SelectItem value="openrouter">OpenRouter</SelectItem>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Modelo</Label>
                <Select value={selectedModel} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="llama-3.1-70b-versatile">
                      Llama 3.1 70B (Groq)
                    </SelectItem>
                    <SelectItem value="gemini-1.5-pro">
                      Gemini 1.5 Pro
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-accent" />
                Autenticação da API
              </CardTitle>
              <CardDescription>
                Insira a chave de API segura. Esta configuração será aplicada
                globalmente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="api-key">Chave da API (API Key)</Label>
                <div className="relative">
                  <Input
                    id="api-key"
                    type="password"
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    placeholder="sk-..."
                    className="pr-10"
                  />
                  {apiKey && apiKey === tempKey && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  A chave é armazenada com segurança localmente e usada para
                  todas as requisições.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-muted/30 border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Cpu className="h-4 w-4" />
                Status do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${apiKey ? 'bg-green-500' : 'bg-red-400'}`}
                />
                {apiKey
                  ? 'Sistema pronto para processar requisições de IA.'
                  : 'Aguardando configuração de API.'}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
