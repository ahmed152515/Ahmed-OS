'use client';

import { useState, useRef, useEffect } from 'react';
import { Settings } from 'lucide-react';
import NodeGraph from '@/components/NodeGraph';

interface Message {
  role: 'visitor' | 'ahmedos';
  content: string;
  timestamp: string;
}

interface Event {
  type: string;
  timestamp: string;
  message: string;
}

const SUGGESTED_QUESTIONS = [
  "What has he built at Risiar?",
  "Does he know Python and Flask?",
  "What is DukaanX and how does it use AI?",
  "Has he worked with payment gateway integrations?",
  "What CRM systems has he built?",
  "Does he have experience with Docker and SQL databases?",
  "What did he work on at Google's Privacy Sandbox?"
];

export default function Home() {
  const [sessionId] = useState(() => 
    Math.random().toString(36).substring(2, 8).toUpperCase()
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const eventsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    eventsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [events]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const question = input.trim();
    setInput('');
    setIsLoading(true);

    setMessages(prev => [...prev, {
      role: 'visitor',
      content: question,
      timestamp: new Date().toISOString()
    }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No response body');

      let finalAnswer = '';
      let finalCost = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event = JSON.parse(line.slice(6));
              
              if (event.type === 'ERROR') {
                throw new Error(event.message);
              }

              if (event.type === 'ANSWER') {
                finalAnswer = event.answer;
                finalCost = event.cost;
              } else {
                setEvents(prev => [...prev, event]);
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }

      if (finalAnswer) {
        setMessages(prev => [...prev, {
          role: 'ahmedos',
          content: finalAnswer,
          timestamp: new Date().toISOString()
        }]);
      }

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'ahmedos',
        content: 'Sorry, there was an error processing your request.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen grid-bg">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-line)' }}>
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-white font-display">AhmedOS</span>
          <span className="text-xs tracking-[0.2em]" style={{ color: 'var(--color-mute)' }}>AGENT RUNTIME</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <button className="px-3 py-1 border rounded transition-colors hover:border-[var(--color-accent)]" style={{ borderColor: 'var(--color-line)', color: 'var(--color-fog)' }}>
            How I built this?
          </button>
          <span style={{ color: 'var(--color-mute)' }}>SESSION {sessionId}</span>
          <button className="px-3 py-1 border rounded transition-colors hover:border-[var(--color-accent)]" style={{ borderColor: 'var(--color-line)', color: 'var(--color-fog)' }}>
            MCP /mcp
          </button>
          <Settings className="w-4 h-4 cursor-pointer transition-colors hover:text-[var(--color-accent)]" style={{ color: 'var(--color-mute)' }} />
          <div className="flex items-center gap-2 px-3 py-1 border rounded" style={{ background: 'rgba(125, 211, 192, 0.1)', borderColor: 'rgba(125, 211, 192, 0.3)' }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-accent)' }} />
            <span className="font-bold" style={{ color: 'var(--color-accent)' }}>LIVE</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT - 3 COLUMN LAYOUT */}
      <div className="flex gap-4 p-4 h-[calc(100vh-180px)] flex-col lg:flex-row">
        {/* LEFT PANEL - OPERATOR */}
        <div className="w-full lg:w-80 flex flex-col panel">
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-line)' }}>
            <span className="text-xs tracking-[0.2em]" style={{ color: 'var(--color-mute)' }}>OPERATOR</span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto scrollbar-thin">
            <h2 className="text-3xl font-bold text-white mb-1 font-display">Ahmed</h2>
            <p className="text-sm mb-4" style={{ color: 'var(--color-fog)' }}>Ahmed Sayyed</p>
            <p className="font-bold mb-4" style={{ color: 'var(--color-accent)' }}>SOFTWARE DEVELOPER</p>
            <p className="text-xs mb-6" style={{ color: 'var(--color-mute)' }}>Pune, India · Immediate joiner</p>
            
            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--color-fog)' }}>
              Software Developer with expertise in building privacy-focused web applications and scalable CRM systems. Proficient in React, Python, Flask, and database optimization to enhance user experience and ensure robust frontend-backend integration. Experienced in CRM systems, along with tools like Jira and Postman for project management and API testing. Adept at handling multiple tasks in fast-paced environments, with strong problem-solving abilities, quick learning, and effective communication skills. Currently building DukaanX, a full-stack SaaS product for store and inventory management with AI-generated storefront imagery powered by the Cloudflare AI API.
            </p>

            <div className="border-t pt-4 mb-6" style={{ borderColor: 'var(--color-line)' }}>
              <div className="text-xs space-y-1">
                <a href="mailto:sayyedwp@gmail.com" className="hover:underline" style={{ color: 'var(--color-fog)' }}>sayyedwp@gmail.com</a>
                <p style={{ color: 'var(--color-fog)' }}>+91 8530070721</p>
                <a href="https://github.com/ahmed152515" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'var(--color-fog)' }}>github.com/ahmed152515</a>
              </div>
            </div>

            <div>
              <span className="text-xs tracking-[0.2em] block mb-3" style={{ color: 'var(--color-mute)' }}>CAPABILITIES</span>
              <span className="text-xs block mb-2" style={{ color: 'var(--color-mute)' }}>Languages</span>
              <div className="flex flex-wrap gap-2">
                {['C', 'C++', 'JavaScript', 'React', 'PHP', 'Python', 'SQL'].map((skill) => (
                  <span key={skill} className="px-2 py-1 text-xs border rounded" style={{ borderColor: 'var(--color-line)', color: 'var(--color-fog)' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CENTER PANEL - SPECIALIST */}
        <div className="flex-1 flex flex-col panel min-h-[300px] lg:min-h-0">
          <div className="px-4 py-3 border-b flex justify-between items-center" style={{ borderColor: 'var(--color-line)' }}>
            <span className="text-xs tracking-[0.2em]" style={{ color: 'var(--color-mute)' }}>SPECIALIST</span>
            <span className="text-xs" style={{ color: 'var(--color-line-2)' }}>LLM will choose tools and answer from their results.</span>
          </div>
          <div className="flex-1 p-4 overflow-hidden">
            <NodeGraph />
          </div>
        </div>

        {/* RIGHT PANEL - CHAT */}
        <div className="w-full lg:w-96 flex flex-col panel">
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-line)' }}>
            <span className="text-sm text-white">Ask anything about Ahmed.</span>
          </div>
          <div className="flex-1 p-4 overflow-y-auto scrollbar-thin">
            <div className="space-y-2 mb-4">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(q); }}
                  className="w-full text-left px-3 py-2 text-xs border rounded transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                  style={{ borderColor: 'var(--color-line)', color: 'var(--color-fog)' }}
                >
                  {q}
                </button>
              ))}
            </div>
            
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`p-3 border rounded ${msg.role === 'visitor' ? '' : ''}`} style={{ 
                  borderColor: msg.role === 'visitor' ? 'rgba(125, 211, 192, 0.3)' : 'var(--color-line)',
                  background: msg.role === 'visitor' ? 'rgba(125, 211, 192, 0.05)' : 'var(--color-panel-2)'
                }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold ${msg.role === 'visitor' ? '' : ''}`} style={{ 
                      color: msg.role === 'visitor' ? 'var(--color-accent)' : 'var(--color-mute)'
                    }}>
                      {msg.role === 'visitor' ? 'VISITOR' : 'AHMEDOS'}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--color-line-2)' }}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--color-fog)' }}>{msg.content}</p>
                </div>
              ))}
              {isLoading && (
                <div className="p-3 border rounded" style={{ borderColor: 'var(--color-line)', background: 'var(--color-panel-2)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: 'var(--color-mute)' }}>AHMEDOS</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--color-accent)', animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--color-accent)', animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--color-accent)', animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 border-t" style={{ borderColor: 'var(--color-line)' }}>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask the runtime…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1 rounded px-3 py-2 text-sm placeholder-[var(--color-mute)] focus:outline-none disabled:opacity-50"
                style={{ 
                  background: 'var(--color-panel-2)', 
                  borderColor: 'var(--color-line)',
                  color: 'var(--color-fog)'
                }}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 font-bold text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  background: input.trim() ? 'var(--color-accent)' : 'var(--color-line-2)',
                  color: input.trim() ? '#000' : 'var(--color-mute)'
                }}
              >
                SEND
              </button>
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--color-mute)' }}>Enter to send</p>
          </div>
        </div>
      </div>

      {/* BOTTOM PANEL - EVENT STREAM */}
      <div className="mx-4 mb-4 panel h-32">
        <div className="px-4 py-2 border-b flex justify-between items-center" style={{ borderColor: 'var(--color-line)' }}>
          <span className="text-xs tracking-[0.2em]" style={{ color: 'var(--color-mute)' }}>EVENT STREAM</span>
          <span className="text-xs" style={{ color: 'var(--color-line-2)' }}>actual runtime events only</span>
        </div>
        <div className="p-4 text-xs overflow-y-auto h-[calc(100%-40px)] scrollbar-thin" style={{ fontFamily: 'var(--font-mono)' }}>
          {events.length === 0 ? (
            <p style={{ color: 'var(--color-line-2)' }}>Waiting for events...</p>
          ) : (
            events.map((event, i) => (
              <div key={i} className="mb-1">
                <span style={{ color: 'var(--color-line-2)' }}>{new Date(event.timestamp).toLocaleTimeString()}</span>
                <span className="ml-2" style={{
                  color: event.type === 'TOOL_RESULT' || event.type === 'TOOL_CALLED' ? 'var(--color-accent)' :
                         event.type === 'WORKFLOW_COMPLETED' ? '#4ade80' :
                         'var(--color-fog)'
                }}>
                  {event.type.padEnd(20)}
                </span>
                <span style={{ color: 'var(--color-fog)' }}>{event.message}</span>
              </div>
            ))
          )}
          <div ref={eventsEndRef} />
        </div>
      </div>
    </div>
  );
}
