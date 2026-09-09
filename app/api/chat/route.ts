import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { tools, toolDefinitions } from '@/lib/data/tools';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Simple in-memory cache
const cache = new Map<string, { answer: string; cost: number; timestamp: number }>();

export async function POST(req: NextRequest) {
  const { question } = await req.json();

  if (!question) {
    return new Response(JSON.stringify({ error: 'Question is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const normalizedQuestion = question.toLowerCase().trim();

  // Check cache
  if (cache.has(normalizedQuestion)) {
    const cached = cache.get(normalizedQuestion)!;
    return new Response(JSON.stringify({
      answer: cached.answer,
      cost: cached.cost,
      cached: true,
      events: [
        { type: 'CACHE_HIT', timestamp: new Date().toISOString(), message: 'Cache hit for question' }
      ]
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Create a readable stream for SSE
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      try {
        sendEvent({ type: 'QUESTION_RECEIVED', timestamp: new Date().toISOString(), message: `Question: "${question}"` });
        sendEvent({ type: 'WORKFLOW_STARTED', timestamp: new Date().toISOString(), message: 'Starting orchestrator workflow' });

        // Convert tool definitions to Anthropic format
        const anthropicTools = toolDefinitions.map(tool => ({
          name: tool.name,
          description: tool.description,
          input_schema: tool.input_schema
        }));

        // Call Claude with tool definitions
        const response = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          system: `You are AhmedOS, an AI assistant that answers questions about Ahmed Sayyed based ONLY on the tool results provided to you. 

Available tools:
- get_summary: Get Ahmed's professional summary
- get_experience: Get work experience, optionally filtered by company name
- get_technical_skills: Get technical skills, optionally filtered by category
- search_projects: Search or list projects, optionally filtered by query
- get_education: Get education history
- get_dukaanx_project: Get detailed information about the DukaanX SaaS product
- get_links: Get contact information and project links

IMPORTANT RULES:
1. Only use information from the tool results. Do not invent or hallucinate facts.
2. If the tool results don't contain the answer, honestly say you don't have that information.
3. Be concise and direct in your answers.
4. When answering about experience, mention the company, role, and key responsibilities.
5. When answering about skills, list the relevant skills from the tool results.`,
          messages: [
            {
              role: 'user',
              content: question
            }
          ],
          tools: anthropicTools
        });

        // Execute tools if Claude requested them
        let finalAnswer = '';
        let toolResults: any[] = [];
        let totalInputTokens = response.usage.input_tokens;
        let totalOutputTokens = response.usage.output_tokens;

        const stopReason = response.stop_reason;
        const lastMessage = response.content[response.content.length - 1];

        if (stopReason === 'tool_use' && lastMessage.type === 'tool_use') {
          // Execute tools
          for (const block of response.content) {
            if (block.type === 'tool_use') {
              const toolName = block.name;
              const toolInput = block.input;
              
              sendEvent({ type: 'TOOL_CALLED', timestamp: new Date().toISOString(), message: `Called tool: ${toolName}` });
              
              // Execute the tool
              const toolFn = tools[toolName as keyof typeof tools] as (params?: any) => any;
              const toolResult = toolFn(Object.keys(toolInput || {}).length > 0 ? toolInput : undefined);
              toolResults.push({
                tool: toolName,
                result: toolResult,
                id: block.id
              });
              
              sendEvent({ type: 'TOOL_RESULT', timestamp: new Date().toISOString(), message: `Tool ${toolName} returned data` });
            }
          }

          // Send tool results back to Claude
          const toolResultMessages = toolResults.map(tr => ({
            role: 'user' as const,
            content: [{
              type: 'tool_result' as const,
              tool_use_id: tr.id,
              content: JSON.stringify(tr.result)
            }]
          }));

          const finalResponse = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            system: `You are AhmedOS, an AI assistant that answers questions about Ahmed Sayyed based ONLY on the tool results provided to you.
            
IMPORTANT RULES:
1. Only use information from the tool results. Do not invent or hallucinate facts.
2. If the tool results don't contain the answer, honestly say you don't have that information.
3. Be concise and direct in your answers.`,
            messages: [
              {
                role: 'user',
                content: question
              },
              {
                role: 'assistant',
                content: response.content
              },
              ...toolResultMessages
            ]
          });

          finalAnswer = finalResponse.content[0].type === 'text' ? finalResponse.content[0].text : '';
          totalInputTokens += finalResponse.usage.input_tokens;
          totalOutputTokens += finalResponse.usage.output_tokens;
        } else if (lastMessage.type === 'text') {
          finalAnswer = lastMessage.text;
        }

        // Calculate cost
        const cost = (totalInputTokens * 3 / 1000000) + (totalOutputTokens * 15 / 1000000);

        sendEvent({ type: 'LLM_USAGE', timestamp: new Date().toISOString(), message: `Input: ${totalInputTokens}, Output: ${totalOutputTokens}, Cost: $${cost.toFixed(4)}` });
        sendEvent({ type: 'WORKFLOW_COMPLETED', timestamp: new Date().toISOString(), message: 'Workflow completed successfully' });
        sendEvent({ type: 'ANSWER', timestamp: new Date().toISOString(), answer: finalAnswer, cost });

        // Cache the result
        cache.set(normalizedQuestion, {
          answer: finalAnswer,
          cost,
          timestamp: Date.now()
        });

        controller.close();
      } catch (error: any) {
        console.error('Error in chat route:', error);
        sendEvent({ type: 'ERROR', timestamp: new Date().toISOString(), message: error.message || 'Failed to process request' });
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  });
}
