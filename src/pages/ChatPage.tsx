import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import useDataStore from '@/stores/useDataStore'
import useSettingsStore from '@/stores/useSettingsStore'
import { generateAIResponse } from '@/lib/ai-service'
import { toast } from 'sonner'
import { DualFileUploader } from '@/components/FileUploader'

export default function ChatPage() {
  const {
    chatHistory,
    addChatMessage,
    tussData,
    cbhpmData,
    isDataLoaded,
    isChatProcessed,
  } = useDataStore()
  const { apiKey, selectedProvider, selectedModel } = useSettingsStore()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showUploader, setShowUploader] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatHistory, isLoading])

  const handleSend = async () => {
    if (!input.trim()) return
    if (!isDataLoaded) {
      toast.error('Dados não carregados', {
        description: 'Por favor, importe as tabelas TUSS/CBHPM primeiro.',
      })
      return
    }

    const userMsg = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input,
      timestamp: Date.now(),
    }

    addChatMessage(userMsg)
    setInput('')
    setIsLoading(true)

    const contextSummary = `
      System contains ${tussData.length} TUSS codes and ${cbhpmData.length} CBHPM codes.
      Processed: ${isChatProcessed ? 'Yes (Optimized)' : 'No (Raw)'}.
      Sample TUSS: ${tussData
        .slice(0, 3)
        .map((t) => `${t.code}-${t.term}`)
        .join('; ')}...
    `

    try {
      const responseContent = await generateAIResponse({
        messages: [...chatHistory, userMsg],
        provider: selectedProvider,
        apiKey: apiKey,
        model: selectedModel,
        contextData: contextSummary,
      })

      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: Date.now(),
      })
    } catch (error) {
      toast.error('Erro ao gerar resposta', {
        description: 'Falha ao comunicar com o provedor de IA.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container h-[calc(100vh-4rem)] py-6 flex flex-col max-w-5xl mx-auto animate-fade-in">
      <Card className="flex-1 flex flex-col overflow-hidden shadow-sm border-0 bg-card">
        <div className="bg-primary/5 p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border bg-white">
              <AvatarImage src="/bot-avatar.png" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-sm text-primary">
                TUSS ROL Assistant
              </h2>
              <p className="text-[10px] text-muted-foreground">
                Powered by {selectedProvider} • {selectedModel}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUploader(true)}
            className="bg-background"
          >
            <UploadCloud className="h-4 w-4 mr-2" />
            Importar Tabelas
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4 bg-background/50" ref={scrollRef}>
          <div className="space-y-6 max-w-3xl mx-auto">
            {chatHistory.length === 0 && (
              <div className="text-center text-muted-foreground py-10 flex flex-col items-center">
                <div className="bg-muted p-4 rounded-full mb-4">
                  <Bot className="h-8 w-8 opacity-50" />
                </div>
                <h3 className="text-lg font-medium text-foreground">
                  Como posso ajudar?
                </h3>
                <p className="max-w-md mt-2 text-sm">
                  Faça perguntas sobre códigos TUSS, correlações com CBHPM,
                  cobertura DUT ou detalhes técnicos dos procedimentos.
                </p>
              </div>
            )}

            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <Avatar className="h-8 w-8 shrink-0 border">
                  <AvatarFallback
                    className={
                      msg.role === 'user'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-primary text-primary-foreground'
                    }
                  >
                    {msg.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-2xl p-4 max-w-[85%] text-sm shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-accent/10 text-foreground border border-accent/20 rounded-tr-none'
                      : 'bg-card text-foreground border rounded-tl-none'
                  }`}
                >
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap leading-relaxed m-0">
                      {msg.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 shrink-0 border">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-card border rounded-2xl rounded-tl-none p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-xs">Analisando base de dados...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 bg-background border-t">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua pergunta sobre códigos, coberturas ou correlações..."
                className="resize-none min-h-[60px] pr-12 shadow-sm border-muted-foreground/20 focus-visible:ring-primary"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />
              <Button
                onClick={handleSend}
                size="icon"
                className="absolute right-2 bottom-2 h-8 w-8"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] text-center text-muted-foreground mt-2">
              A IA pode cometer erros. Verifique sempre as informações oficiais
              da ANS e CBHPM.
            </p>
          </div>
        </div>
      </Card>

      <DualFileUploader
        isOpen={showUploader}
        onClose={() => setShowUploader(false)}
      />
    </div>
  )
}
