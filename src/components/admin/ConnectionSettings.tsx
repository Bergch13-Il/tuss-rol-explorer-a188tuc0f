import { useState, useEffect } from 'react'
import { Server, Key, Save, Check, Cpu, Loader2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
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
import useSettingsStore from '@/stores/useSettingsStore'
import { AIProvider } from '@/lib/types'

export function ConnectionSettings() {
  const {
    apiKey,
    setApiKey,
    selectedProvider,
    setProvider,
    selectedModel,
    setModel,
    isLoading,
    saveSettings,
  } = useSettingsStore()

  const [tempKey, setTempKey] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Sync tempKey when apiKey changes (after loading)
  useEffect(() => {
    setTempKey(apiKey)
  }, [apiKey])

  const handleSaveSettings = async () => {
    setIsSaving(true)
    setApiKey(tempKey)
    await saveSettings()
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            Provedor de IA Global (Supabase)
          </CardTitle>
          <CardDescription>
            Selecione o provedor de inteligência artificial que será utilizado
            por todos os usuários do sistema. As configurações são salvas no
            banco de dados.
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
                <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
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
            globalmente e persistida no Supabase.
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
              A chave é armazenada com segurança no banco de dados e usada para
              todas as requisições.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSaveSettings}
            className="ml-auto"
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
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
    </div>
  )
}
