import { useState } from 'react'
import { Save, Check, Key, Server, Cpu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import useSettingsStore from '@/stores/useSettingsStore'
import { AIProvider } from '@/lib/types'

export default function ConnectionPage() {
  const {
    apiKey,
    setApiKey,
    selectedProvider,
    setProvider,
    selectedModel,
    setModel,
  } = useSettingsStore()

  const [tempKey, setTempKey] = useState(apiKey)

  const handleSave = () => {
    setApiKey(tempKey)
    toast({
      title: 'Settings Saved',
      description: 'Your connection settings have been updated.',
    })
  }

  return (
    <div className="container max-w-2xl py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Connection Settings
          </h1>
          <p className="text-muted-foreground">
            Configure your AI provider to enable the intelligent chat assistant.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              AI Provider
            </CardTitle>
            <CardDescription>
              Select which AI service you want to use for the chat agent.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select
                value={selectedProvider}
                onValueChange={(val) => setProvider(val as AIProvider['id'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a provider" />
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
              <Label>Model</Label>
              <Select value={selectedModel} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
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
              Authentication
            </CardTitle>
            <CardDescription>
              Enter your API key securely. It will be stored in your browser's
              local storage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
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
                We do not store your keys on any server.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} className="ml-auto">
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-muted/30 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Cpu className="h-4 w-4" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <div
                className={`h-2.5 w-2.5 rounded-full ${apiKey ? 'bg-green-500' : 'bg-red-400'}`}
              />
              {apiKey
                ? 'Ready to process requests'
                : 'Waiting for API configuration'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
