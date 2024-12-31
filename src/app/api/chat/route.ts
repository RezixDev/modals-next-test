 
  // api/chat/route.ts
  import { NextResponse } from 'next/server';
  import OpenAI from 'openai';
  import { Message, ChatResponse } from '@/types';
  
  const token = process.env.GITHUB_TOKEN;
  const endpoint = 'https://models.inference.ai.azure.com';
  const modelName = 'gpt-4o';
  
  const client = new OpenAI({ 
    baseURL: endpoint, 
    apiKey: token 
  });
  
  export async function POST(request: Request) {
    try {
      const { messages } = await request.json() as { messages: Message[] };
      
      const openAIMessages = messages.map(({ role, content }) => ({
        role,
        content
      }));
  
      const response = await client.chat.completions.create({
        messages: openAIMessages,
        model: modelName,
        temperature: 0.7,
        max_tokens: 1000,
      });
  
      return NextResponse.json({ 
        response: response.choices[0].message.content 
      } as ChatResponse);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return NextResponse.json(
        { error: errorMessage } as ChatResponse, 
        { status: 500 }
      );
    }
  }