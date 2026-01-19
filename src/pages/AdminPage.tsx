import { Users, Settings } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserManagement } from '@/components/admin/UserManagement'
import { ConnectionSettings } from '@/components/admin/ConnectionSettings'

export default function AdminPage() {
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

        <TabsContent value="users" className="space-y-4 mt-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="connection" className="mt-6">
          <ConnectionSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
