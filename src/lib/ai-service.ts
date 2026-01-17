import { ChatMessage } from './types'

interface AIRequest {
  messages: ChatMessage[]
  provider: string
  apiKey: string
  model: string
  contextData: string
}

export async function generateAIResponse({
  messages,
  provider,
  apiKey,
  model,
  contextData,
}: AIRequest): Promise<string> {
  const lastUserMessage = messages[messages.length - 1]?.content

  // Prepare system prompt
  const systemPrompt = `
You are a specialized medical billing and coding assistant.
You have access to the following TUSS and CBHPM data context:
${contextData}

Your goal is to answer questions about procedure codes, terminology, coverage (DUT), and correlations.
Always validate your answer against the provided context. If a code is not in the context, mention that.
Be professional, concise, and accurate.
`

  // Mock response if no API key is present or just to simulate for this demo environment
  if (!apiKey) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          `**[DEMO MODE - No API Key]**\n\nI analyzed your request about "${lastUserMessage}".\n\nBased on the TUSS/CBHPM data loaded:\n- I found correlations for codes similar to what you asked.\n- Please configure a valid API key in the connection settings to get real AI responses.\n\nHowever, typically for this procedure, you should check the DUT guidelines and the specific segmentation coverage (AMB/HSO).`,
        )
      }, 1500)
    })
  }

  // Real implementation for OpenAI (simplified)
  if (provider === 'openai') {
    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model || 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              ...messages.map((m) => ({ role: m.role, content: m.content })),
            ],
          }),
        },
      )

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error.message)
      }
      return data.choices[0].message.content
    } catch (error: any) {
      return `Error calling OpenAI: ${error.message}`
    }
  }

  // Fallback for other providers or unimplmented
  return `Provider ${provider} is not fully implemented in this demo. Please use OpenAI or try again later.`
}
