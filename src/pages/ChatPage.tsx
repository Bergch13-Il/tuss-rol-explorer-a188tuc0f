import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import useDataStore from '@/stores/useDataStore'
import useSettingsStore from '@/stores/useSettingsStore'
import { generateAIResponse } from '@/lib/ai-service'
import { toast } from '@/hooks/use-toast'

export default function ChatPage() {
  const { chatHistory, addChatMessage, tussData, cbhpmData, isDataLoaded } =
    useDataStore()
  const { apiKey, selectedProvider, selectedModel } = useSettingsStore()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatHistory, isLoading])

  const handleSend = async () => {
    if (!input.trim()) return
    if (!isDataLoaded) {
      toast({
        title: 'No Data Loaded',
        description: 'Please upload TUSS/CBHPM data in the Dashboard first.',
        variant: 'destructive',
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

    // Prepare context (summary of data)
    // In a real app, we would use RAG (Vector DB). Here we just pass a very small sample or description.
    const contextSummary = `
      System contains ${tussData.length} TUSS codes and ${cbhpmData.length} CBHPM codes.
      Sample TUSS: ${tussData
        .slice(0, 3)
        .map((t) => `${t.code}-${t.term}`)
        .join('; ')}...
      Sample CBHPM: ${cbhpmData
        .slice(0, 3)
        .map((c) => `${c.code}-${c.term}`)
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
      toast({
        title: 'Error generating response',
        description: 'Failed to get answer from AI provider.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container h-[calc(100vh-4rem)] py-6 flex flex-col">
      <Card className="flex-1 flex flex-col overflow-hidden shadow-sm">
        <div className="bg-muted/40 p-4 border-b flex items-center gap-3">
          <Avatar className="h-8 w-8 bg-primary/10">
            <AvatarImage src="/bot-avatar.png" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-sm">TUSS ROL Assistant</h2>
            <p className="text-xs text-muted-foreground">
              Powered by {selectedProvider}
            </p>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4 max-w-3xl mx-auto">
            {chatHistory.length === 0 && (
              <div className="text-center text-muted-foreground py-10">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>
                  Hello! I'm your coding assistant. Ask me about medical
                  procedures, correlations, or DUT coverage.
                </p>
              </div>
            )}

            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <Avatar className="h-8 w-8 shrink-0">
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
                  className={`rounded-lg p-3 max-w-[80%] text-sm ${
                    msg.role === 'user'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 bg-background border-t">
          <div className="max-w-3xl mx-auto flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question about codes, coverage..."
              className="resize-none min-h-[50px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
            <Button
              onClick={handleSend}
              className="h-auto px-4"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-2">
            AI can make mistakes. Please verify important billing information.
          </p>
        </div>
      </Card>
    </div>
  )
}
