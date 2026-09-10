'use client';

import { useState, useRef, useEffect } from 'react';
import { Settings } from 'lucide-react';
import RuntimeGraph from '@/components/runtime/RuntimeGraph';
import ProjectArchitectureView from '@/components/projects/ProjectArchitectureView';
import HowBuiltModal from '@/components/how-built/HowBuiltModal';
import { projects, getProjectById } from '@/lib/data/portfolio';
import { RuntimeProvider, useRuntime, toolToNodeMap, toolToEdgeMap } from '@/lib/runtime/runtimeStore';

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

type SystemMode = 'portfolio' | 'runtime' | 'agent' | 'project';

function HomeContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [systemMode, setSystemMode] = useState<SystemMode>('portfolio');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hasWokenUp, setHasWokenUp] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showAboutPanel, setShowAboutPanel] = useState(false);
  const [mobileTab, setMobileTab] = useState<'profile' | 'runtime' | 'ask'>('ask');
  const eventsEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    setActiveNode, 
    setCompletedNode, 
    setActiveEdge, 
    setCompletedEdge, 
    setErrorNode,
    addEvent, 
    reset,
    setProcessing
  } = useRuntime();

  // Default runtime architecture for AI system
  const defaultRuntimeArchitecture = {
    nodes: [
      { id: "user", type: "client" as const, label: "USER", category: "Input" },
      { id: "orchestrator", type: "backend" as const, label: "ORCHESTRATOR", category: "Runtime" },
      { id: "skills", type: "database" as const, label: "SKILLS", category: "Data" },
      { id: "experience", type: "database" as const, label: "EXPERIENCE", category: "Data" },
      { id: "projects", type: "database" as const, label: "PROJECTS", category: "Data" },
      { id: "ai", type: "ai" as const, label: "AI / CLOUD", category: "Data" },
      { id: "llm", type: "ai" as const, label: "SYNTHESIS", category: "AI" },
      { id: "answer", type: "service" as const, label: "ANSWER", category: "Output" },
    ],
    edges: [
      { id: "e1", source: "user", target: "orchestrator", type: "request" as const },
      { id: "e2", source: "orchestrator", target: "skills", type: "request" as const },
      { id: "e3", source: "orchestrator", target: "experience", type: "request" as const },
      { id: "e4", source: "orchestrator", target: "projects", type: "request" as const },
      { id: "e5", source: "orchestrator", target: "ai", type: "request" as const },
      { id: "e6", source: "skills", target: "llm", type: "data" as const },
      { id: "e7", source: "experience", target: "llm", type: "data" as const },
      { id: "e8", source: "projects", target: "llm", type: "data" as const },
      { id: "e9", source: "ai", target: "llm", type: "data" as const },
      { id: "e10", source: "llm", target: "answer", type: "response" as const },
    ],
  };

  const scrollToBottom = () => {
    eventsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [events]);

  // System wake-up animation on initial load - only run once
  useEffect(() => {
    if (hasWokenUp) return;
    
    const wakeUpSequence = async () => {
      // Add system wake-up events only once
      setEvents([
        { type: 'SYSTEM_INIT', timestamp: new Date().toISOString(), message: 'Initializing Ahmed OS...' },
        { type: 'GRAPH_INIT', timestamp: new Date().toISOString(), message: 'Loading architecture map...' },
        { type: 'SYSTEM_READY', timestamp: new Date().toISOString(), message: 'System ready' }
      ]);
      
      // Activate default nodes briefly
      setActiveNode('user');
      await new Promise(resolve => setTimeout(resolve, 200));
      setActiveNode('orchestrator');
      await new Promise(resolve => setTimeout(resolve, 200));
      setCompletedNode('user');
      setCompletedNode('orchestrator');
      
      setHasWokenUp(true);
    };
    
    wakeUpSequence();
  }, []); // Empty dependency array - only run once

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Reset runtime state before new request
    reset();
    setProcessing(true);

    // Switch to runtime mode if not already
    if (systemMode !== 'runtime') {
      setSystemMode('runtime');
    }

    const userMessage: Message = {
      role: 'visitor',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setEvents([]);
    setInput('');
    setIsLoading(true);

    // Activate user node
    setActiveNode('user');
    setActiveEdge('e1');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      
      // Process runtime events and update graph
      if (data.events) {
        // First pass: collect all tools to simulate parallel execution
        const toolsCalled: string[] = [];
        
        for (const event of data.events) {
          addEvent(event);
          
          if (event.type === 'TOOL_CALLED' && event.tool) {
            toolsCalled.push(event.tool);
          }
        }
        
        // Second pass: activate graph with parallel visualization
        for (const event of data.events) {
          // Map events to graph nodes/edges
          if (event.type === 'ORCHESTRATOR_STARTED') {
            setActiveNode('orchestrator');
            setCompletedEdge('e1');
            
            // Activate all tool edges simultaneously for parallel effect
            toolsCalled.forEach(tool => {
              const edgeId = toolToEdgeMap[tool];
              if (edgeId) setActiveEdge(edgeId);
            });
          }
          
          if (event.type === 'TOOL_CALLED' && event.tool) {
            const nodeId = toolToNodeMap[event.tool];
            if (nodeId) setActiveNode(nodeId);
          }
          
          if (event.type === 'TOOL_RESULT' && event.tool) {
            const nodeId = toolToNodeMap[event.tool];
            const edgeId = toolToEdgeMap[event.tool];
            if (nodeId) setCompletedNode(nodeId);
            if (edgeId) setCompletedEdge(edgeId);
          }
          
          if (event.type === 'SYNTHESIS_STARTED') {
            setActiveNode('llm');
            // Activate data edges from completed tools
            setActiveEdge('e6');
            setActiveEdge('e7');
            setActiveEdge('e8');
            setActiveEdge('e9');
          }
          
          if (event.type === 'ANSWER_READY') {
            setCompletedNode('llm');
            setCompletedEdge('e6');
            setCompletedEdge('e7');
            setCompletedEdge('e8');
            setCompletedEdge('e9');
            setActiveNode('answer');
            setActiveEdge('e10');
          }
        }
      }
      
      const aiMessage: Message = {
        role: 'ahmedos',
        content: data.answer,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setCompletedNode('answer');
      setCompletedEdge('e10');
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'ahmedos',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      
      // Set error state on orchestrator
      setErrorNode('orchestrator');
    } finally {
      setIsLoading(false);
      setProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAgentClick = () => {
    setSystemMode('agent');
    chatInputRef.current?.focus();
  };

  const handleRuntimeClick = () => {
    setSystemMode('runtime');
    setSelectedProject(null);
  };

  const handleProjectClick = (projectId: string) => {
    setSelectedProject(projectId);
    setSystemMode('project');
    
    // Add project selection event to console
    const project = getProjectById(projectId);
    if (project) {
      const projectEvent: Event = {
        type: 'PROJECT_SELECTED',
        timestamp: new Date().toISOString(),
        message: `${project.name} selected`
      };
      setEvents(prev => [...prev, projectEvent]);
      
      // Generate automatic project explanation
      const projectExplanation: Message = {
        role: 'ahmedos',
        content: `${project.name} is ${project.overview}. ${project.solution}`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, projectExplanation]);
      
      // Add architecture loaded event
      setTimeout(() => {
        const archEvent: Event = {
          type: 'ARCHITECTURE_LOADED',
          timestamp: new Date().toISOString(),
          message: `${project.architectureGraph?.nodes.length || 0} nodes, ${project.architectureGraph?.edges.length || 0} edges`
        };
        setEvents(prev => [...prev, archEvent]);
      }, 300);
    }
  };

  // Get current architecture based on system mode
  const getCurrentArchitecture = () => {
    if (systemMode === 'runtime' || systemMode === 'agent' || !selectedProject) {
      return defaultRuntimeArchitecture;
    }
    const project = getProjectById(selectedProject);
    return project?.architectureGraph || defaultRuntimeArchitecture;
  };

  // Get current graph title based on system mode
  const getGraphTitle = () => {
    if (systemMode === 'runtime') {
      return { name: 'AHMED OS RUNTIME', category: 'AI Agent Runtime', status: 'ACTIVE' };
    }
    if (systemMode === 'agent') {
      return { name: 'AHMED OS AGENT', category: 'AI Agent Runtime', status: 'ACTIVE' };
    }
    if (systemMode === 'project' && selectedProject) {
      const project = getProjectById(selectedProject);
      return { 
        name: project?.name || 'PROJECT', 
        category: project?.category || '', 
        status: project?.status || 'COMPLETED' 
      };
    }
    return { name: 'AHMED OS', category: 'Portfolio', status: 'READY' };
  };

  return (
    <div className="min-h-screen bg-[#0a0e0f] text-[#e5e5e5] font-mono grid-bg">
      {/* LANDING PAGE */}
      {showLanding && (
        <div className="fixed inset-0 bg-[#0a0e0f] z-50 flex items-center justify-center">
          <div className="text-center max-w-2xl px-6">
            <p className="text-xl text-gray-400 mb-1 tracking-widest">AhmedOS// Agent Runtime</p>
            <h2 className="text-4xl font-bold text-white mb-4">AHMED ABBAS</h2>
            <p className="text-lg text-gray-400 mb-2">Full Stack AI Engineer</p>
            <p className="text-sm text-gray-500 mb-6">React · Cloudflare · Generative AI</p>
            <p className="text-base text-gray-300 mb-8 max-w-lg mx-auto">
              I build software, AI systems and products end-to-end.
            </p>
            <p className="text-sm text-gray-400 mb-8 italic">
              This isn't a portfolio that tells you about me. It's a system that lets you investigate me.
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setShowAboutPanel(!showAboutPanel)}
                className="px-8 py-3 bg-[#5eead4] text-black font-bold rounded hover:bg-[#4dd4c4] transition-colors"
              >
                {showAboutPanel ? 'Hide Me' : 'About Me'}
              </button>
              <button 
                onClick={() => {
                  setShowLanding(false);
                  handleAgentClick();
                }}
                className="px-8 py-3 border border-[#5eead4] text-[#5eead4] font-bold rounded hover:bg-[#5eead4]/10 transition-colors"
              >
                Ask my portfolio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ABOUT ME PANEL - Slide in from right with same content as left panel - only show on landing page */}
      {showAboutPanel && showLanding && (
        <div className="fixed inset-0 z-[60]">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowAboutPanel(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 md:w-96 bg-[#0a0e0f] border-l border-[#1a1f22] overflow-y-auto transform transition-transform">
            <div className="px-4 py-3 border-b border-[#1a1f22] flex justify-between items-center">
              <span className="text-xs text-gray-500 tracking-widest">OPERATOR</span>
              <button 
                onClick={() => setShowAboutPanel(false)}
                className="px-3 py-1 text-xs border border-[#1a1f22] rounded hover:border-[#5eead4] hover:text-[#5eead4] transition-colors"
              >
                Hide Me
              </button>
            </div>
            <div className="p-4">
              <h2 className="text-3xl font-bold text-white mb-1">Ahmed</h2>
              <p className="text-sm text-gray-400 mb-4">Ahmed Abbas</p>
              <p className="text-[#5eead4] font-bold mb-1">FULL-STACK ENGINEER</p>
              <p className="text-[#5eead4] font-bold mb-4 text-sm">AI / ML ENGINEER · AGENTIC AI DEVELOPER</p>
              <p className="text-xs text-gray-500 mb-6">Pune, India · Immediate joiner</p>
              
              <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                Full-Stack Engineer and AI/ML Engineer with expertise in building scalable web applications, CRM systems, and AI-powered solutions. Proficient in React, Next.js, Python, Node.js, and modern cloud infrastructure. Experienced in agentic AI workflows, RAG architectures, MCP, and LLM applications. Strong background in distributed systems, serverless architecture, and multi-tenant SaaS development. Currently building DukaanX, a multi-tenant SaaS platform with AI-powered capabilities.
              </p>

              <div className="border-t border-[#1a1f22] pt-4 mb-6">
                <div className="text-xs space-y-1">
                  <p className="text-gray-400">📧 sayyedwp@gmail.com</p>
                  <p className="text-gray-400">📱 +91 8530070721</p>
                  <p className="text-gray-400">🔗 github.com/ahmed152515</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-xs text-gray-500 tracking-widest block mb-3">CAPABILITIES</span>
                <span className="text-xs text-gray-500 block mb-2">Languages</span>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['C', 'C++', 'JavaScript', 'TypeScript', 'Python', 'SQL'].map((skill) => (
                    <span key={skill} className="px-2 py-1 text-xs border border-[#1a1f22] rounded text-gray-300">
                      {skill}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-500 block mb-2">Frontend</span>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['React', 'Next.js', 'TypeScript', 'Tailwind CSS'].map((skill) => (
                    <span key={skill} className="px-2 py-1 text-xs border border-[#1a1f22] rounded text-gray-300">
                      {skill}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-500 block mb-2">Backend</span>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['Node.js', 'Python', 'Flask', 'SQL'].map((skill) => (
                    <span key={skill} className="px-2 py-1 text-xs border border-[#1a1f22] rounded text-gray-300">
                      {skill}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-500 block mb-2">AI / ML</span>
                <div className="flex flex-wrap gap-2">
                  {['LLM Apps', 'RAG', 'MCP', 'LangChain'].map((skill) => (
                    <span key={skill} className="px-2 py-1 text-xs border border-[#1a1f22] rounded text-gray-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-500 tracking-widest block mb-3">PROJECTS</span>
                <div className="space-y-1">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleProjectClick(project.id)}
                      className={`w-full text-left px-3 py-2 text-xs transition-all rounded-sm flex items-center gap-2 ${
                        selectedProject === project.id
                          ? 'bg-[#5eead4]/10 border border-[#5eead4]/30 text-[#5eead4]'
                          : 'text-gray-400 hover:bg-[#1a1f22] hover:text-[#5eead4] border border-transparent'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        selectedProject === project.id 
                          ? 'bg-[#5eead4] animate-pulse' 
                          : project.status === 'In Development'
                          ? 'bg-yellow-500'
                          : 'bg-gray-600'
                      }`} />
                      <span>{project.name}</span>
                      {project.highlight && (
                        <span className="ml-auto text-[10px] text-[#5eead4]">★</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE TABS */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0e0f] border-t border-[#1a1f22] z-30">
        <div className="flex">
          <button
            onClick={() => setMobileTab('profile')}
            className={`flex-1 py-3 text-xs font-bold ${
              mobileTab === 'profile' ? 'text-[#5eead4] border-t-2 border-[#5eead4]' : 'text-gray-500'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setMobileTab('runtime')}
            className={`flex-1 py-3 text-xs font-bold ${
              mobileTab === 'runtime' ? 'text-[#5eead4] border-t-2 border-[#5eead4]' : 'text-gray-500'
            }`}
          >
            Runtime
          </button>
          <button
            onClick={() => setMobileTab('ask')}
            className={`flex-1 py-3 text-xs font-bold ${
              mobileTab === 'ask' ? 'text-[#5eead4] border-t-2 border-[#5eead4]' : 'text-gray-500'
            }`}
          >
            Ask
          </button>
        </div>
      </div>

      {/* MAIN CONTENT - Only show if landing is hidden */}
      {!showLanding && (
        <>
          {/* TOP BAR - Desktop only */}
          <div className="hidden md:flex items-center justify-between px-6 py-4 border-b border-[#1a1f22]">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-white">AHMED OS</span>
              <span className="text-xs text-gray-500 tracking-widest">FULL-STACK ENGINEER · AI/ML ENGINEER · AGENTIC AI DEVELOPER</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <button 
                onClick={() => setShowAboutPanel(true)}
                className="px-3 py-1 border border-[#1a1f22] rounded hover:border-[#5eead4] transition-colors"
              >
                About Me
              </button>
              <button 
                onClick={handleRuntimeClick}
                className={`px-3 py-1 border rounded transition-colors ${
                  systemMode === 'runtime' 
                    ? 'border-[#5eead4] bg-[#5eead4]/10 text-[#5eead4]' 
                    : 'border-[#1a1f22] hover:border-[#5eead4]'
                }`}
              >
                RUNTIME
              </button>
              <button 
                onClick={handleAgentClick}
                className={`px-3 py-1 border rounded transition-colors ${
                  systemMode === 'agent' 
                    ? 'border-[#5eead4] bg-[#5eead4]/10 text-[#5eead4]' 
                    : 'border-[#1a1f22] hover:border-[#5eead4]'
                }`}
              >
                AGENT
              </button>
              <span className="text-gray-500">SESSION ACTIVE</span>
              <button className="px-3 py-1 border border-[#1a1f22] rounded hover:border-[#5eead4] transition-colors">
                MCP /mcp
              </button>
              <Settings className="w-4 h-4 text-gray-500 hover:text-[#5eead4] cursor-pointer" />
              <div className="flex items-center gap-2 px-3 py-1 bg-[#5eead4]/10 border border-[#5eead4]/30 rounded">
                <div className="w-2 h-2 bg-[#5eead4] rounded-full animate-pulse" />
                <span className="text-[#5eead4] font-bold">LIVE</span>
              </div>
            </div>
          </div>

      {/* MAIN CONTENT - 3 COLUMN LAYOUT - Desktop */}
      <div className="hidden md:flex gap-4 p-4 h-[calc(100vh-180px)]">
        {/* LEFT PANEL - OPERATOR */}
        <div className="w-80 flex flex-col border border-[#1a1f22] bg-[#0a0e0f]/50">
          <div className="px-4 py-3 border-b border-[#1a1f22]">
            <span className="text-xs text-gray-500 tracking-widest">OPERATOR</span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            <h2 className="text-3xl font-bold text-white mb-1">Ahmed</h2>
            <p className="text-sm text-gray-400 mb-4">Ahmed Abbas</p>
            <p className="text-[#5eead4] font-bold mb-1">FULL-STACK ENGINEER</p>
            <p className="text-[#5eead4] font-bold mb-4 text-sm">AI / ML ENGINEER · AGENTIC AI DEVELOPER</p>
            <p className="text-xs text-gray-500 mb-6">Pune, India · Immediate joiner</p>
            
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              Full-Stack Engineer and AI/ML Engineer with expertise in building scalable web applications, CRM systems, and AI-powered solutions. Proficient in React, Next.js, Python, Node.js, and modern cloud infrastructure. Experienced in agentic AI workflows, RAG architectures, MCP, and LLM applications. Strong background in distributed systems, serverless architecture, and multi-tenant SaaS development. Currently building DukaanX, a multi-tenant SaaS platform with AI-powered capabilities.
            </p>

            <div className="border-t border-[#1a1f22] pt-4 mb-6">
              <div className="text-xs space-y-1">
                <p className="text-gray-400">📧 sayyedwp@gmail.com</p>
                <p className="text-gray-400">📱 +91 8530070721</p>
                <p className="text-gray-400">🔗 github.com/ahmed152515</p>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-xs text-gray-500 tracking-widest block mb-3">CAPABILITIES</span>
              <span className="text-xs text-gray-500 block mb-2">Languages</span>
              <div className="flex flex-wrap gap-2 mb-3">
                {['C', 'C++', 'JavaScript', 'TypeScript', 'Python', 'SQL'].map((skill) => (
                  <span key={skill} className="px-2 py-1 text-xs border border-[#1a1f22] rounded text-gray-300">
                    {skill}
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500 block mb-2">Frontend</span>
              <div className="flex flex-wrap gap-2 mb-3">
                {['React', 'Next.js', 'TypeScript', 'Tailwind CSS'].map((skill) => (
                  <span key={skill} className="px-2 py-1 text-xs border border-[#1a1f22] rounded text-gray-300">
                    {skill}
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500 block mb-2">Backend</span>
              <div className="flex flex-wrap gap-2 mb-3">
                {['Node.js', 'Python', 'Flask', 'SQL'].map((skill) => (
                  <span key={skill} className="px-2 py-1 text-xs border border-[#1a1f22] rounded text-gray-300">
                    {skill}
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500 block mb-2">AI / ML</span>
              <div className="flex flex-wrap gap-2">
                {['LLM Apps', 'RAG', 'MCP', 'LangChain'].map((skill) => (
                  <span key={skill} className="px-2 py-1 text-xs border border-[#1a1f22] rounded text-gray-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-500 tracking-widest block mb-3">PROJECTS</span>
              <div className="space-y-1">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleProjectClick(project.id)}
                    className={`w-full text-left px-3 py-2 text-xs transition-all rounded-sm flex items-center gap-2 ${
                      selectedProject === project.id
                        ? 'bg-[#5eead4]/10 border border-[#5eead4]/30 text-[#5eead4]'
                        : 'text-gray-400 hover:bg-[#1a1f22] hover:text-[#5eead4] border border-transparent'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      selectedProject === project.id 
                        ? 'bg-[#5eead4] animate-pulse' 
                        : project.status === 'In Development'
                        ? 'bg-yellow-500'
                        : 'bg-gray-600'
                    }`} />
                    <span>{project.name}</span>
                    {project.highlight && (
                      <span className="ml-auto text-[10px] text-[#5eead4]">★</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CENTER PANEL - SPECIALIST */}
        <div className="flex-1 flex flex-col border border-[#1a1f22] bg-[#0a0e0f]/50 relative">
          <div className="px-4 py-3 border-b border-[#1a1f22]">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-sm font-bold text-white">{getGraphTitle().name}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">{getGraphTitle().category}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                    getGraphTitle().status === 'ACTIVE' 
                      ? 'bg-[#5eead4]/10 text-[#5eead4] border border-[#5eead4]/30' 
                      : getGraphTitle().status === 'In Development'
                      ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'
                      : 'bg-gray-500/10 text-gray-500 border border-gray-500/30'
                  }`}>
                    ● {getGraphTitle().status}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-gray-600">ARCHITECTURE MAP</span>
            </div>
          </div>
          <div className="flex-1 overflow-hidden relative">
            {systemMode === 'project' && selectedProject ? (
              <ProjectArchitectureView projectId={selectedProject} />
            ) : (
              <RuntimeGraph 
                architecture={getCurrentArchitecture()}
                onNodeClick={(nodeId) => setSelectedNode(nodeId)}
              />
            )}
            
            {/* Node Inspector Drawer - only show when not in Runtime mode */}
            {selectedNode && systemMode !== 'runtime' && (
              <div className="absolute top-4 right-4 w-64 bg-[#0a0e0f] border border-[#1a1f22] p-4 shadow-lg z-10">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs text-gray-500 tracking-widest">NODE INSPECTOR</span>
                  <button 
                    onClick={() => setSelectedNode(null)}
                    className="text-gray-500 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>
                {(() => {
                  const currentArch = getCurrentArchitecture();
                  const node = currentArch.nodes.find(n => n.id === selectedNode);
                  if (!node) return null;
                  return (
                    <>
                      <div className="text-sm font-bold text-white mb-1">{node.label}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">{node.category}</div>
                      <div className="text-[10px] text-gray-400 mb-3">{node.type}</div>
                      {selectedProject && systemMode === 'project' && (
                        <div className="text-[10px] text-gray-500 border-t border-[#1a1f22] pt-2">
                          Part of {getProjectById(selectedProject)?.name}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL - CHAT */}
        <div className="w-96 flex flex-col border border-[#1a1f22] bg-[#0a0e0f]/50">
          <div className="px-4 py-3 border-b border-[#1a1f22]">
            <span className="text-sm text-white">Ask anything about Ahmed.</span>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2 mb-4">
              <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
              {[
                "What has he built at Risiar?",
                "Does he know Python and Flask?",
                "What is DukaanX?",
                "Has he worked with payment gateway integrations?",
                "What CRM systems has he built?",
                "Does he have experience with Docker and databases?"
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(q); }}
                  className="w-full text-left px-3 py-2 text-xs border border-[#1a1f22] rounded hover:border-[#5eead4] hover:text-[#5eead4] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
            
            {/* Message transcript */}
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`p-3 border rounded ${msg.role === 'visitor' ? 'border-[#5eead4]/30 bg-[#5eead4]/5' : 'border-[#1a1f22] bg-[#0a0e0f]'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold ${msg.role === 'visitor' ? 'text-[#5eead4]' : 'text-gray-400'}`}>
                      {msg.role.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-gray-600">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300">{msg.content}</p>
                </div>
              ))}
              {isLoading && (
                <div className="p-3 border border-[#1a1f22] rounded bg-[#0a0e0f]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">AHMEDOS</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#5eead4] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-[#5eead4] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-[#5eead4] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 border-t border-[#1a1f22]">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask the runtime…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1 bg-[#0a0e0f] border border-[#1a1f22] rounded px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#5eead4] disabled:opacity-50"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="px-4 py-2 bg-[#5eead4] text-black font-bold text-sm rounded hover:bg-[#4dd4c4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                SEND
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM PANEL - EVENT STREAM */}
      <div className="mx-4 mb-4 border border-[#1a1f22] bg-[#0a0e0f]/50 h-32">
        <div className="px-4 py-2 border-b border-[#1a1f22] flex justify-between items-center">
          <span className="text-xs text-gray-500 tracking-widest">EVENT STREAM</span>
          <span className="text-xs text-gray-600">actual runtime events only</span>
        </div>
        <div className="p-4 font-mono text-xs overflow-y-auto h-[calc(100%-40px)]">
          {events.length === 0 ? (
            <p className="text-gray-600">Waiting for events...</p>
          ) : (
            events.map((event, i) => (
              <div key={i} className="mb-1">
                <span className="text-gray-500">{new Date(event.timestamp).toLocaleTimeString()}</span>
                <span className={`ml-2 ${
                  event.type === 'TOOL_RESULT' || event.type === 'TOOL_CALLED' ? 'text-[#5eead4]' :
                  event.type === 'WORKFLOW_COMPLETED' ? 'text-green-400' :
                  'text-gray-400'
                }`}>
                  {event.type.padEnd(20)}
                </span>
                <span className="text-gray-300">{event.message}</span>
              </div>
            ))
          )}
          <div ref={eventsEndRef} />
        </div>
      </div>

      {/* MOBILE CONTENT */}
      <div className="md:hidden pb-16">
        {mobileTab === 'profile' && (
          <div className="p-4">
            <h2 className="text-2xl font-bold text-white mb-2">Ahmed</h2>
            <p className="text-sm text-gray-400 mb-4">Ahmed Abbas</p>
            <p className="text-[#5eead4] font-bold mb-1">FULL-STACK ENGINEER</p>
            <p className="text-[#5eead4] font-bold mb-4 text-sm">AI / ML ENGINEER · AGENTIC AI DEVELOPER</p>
            <p className="text-xs text-gray-500 mb-6">Pune, India · Immediate joiner</p>
            
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              Full-Stack Engineer and AI/ML Engineer with expertise in building scalable web applications, CRM systems, and AI-powered solutions.
            </p>

            <div className="border-t border-[#1a1f22] pt-4 mb-6">
              <div className="text-xs space-y-1">
                <p className="text-gray-400">📧 sayyedwp@gmail.com</p>
                <p className="text-gray-400">📱 +91 8530070721</p>
                <p className="text-gray-400">🔗 github.com/ahmed152515</p>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-xs text-gray-500 tracking-widest block mb-3">CAPABILITIES</span>
              <div className="flex flex-wrap gap-2">
                {['React', 'Next.js', 'TypeScript', 'Python', 'Node.js', 'Cloudflare'].map((skill) => (
                  <span key={skill} className="px-2 py-1 text-xs border border-[#1a1f22] rounded text-gray-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-500 tracking-widest block mb-3">PROJECTS</span>
              <div className="space-y-1">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleProjectClick(project.id)}
                    className={`w-full text-left px-3 py-2 text-xs transition-all rounded-sm flex items-center gap-2 ${
                      selectedProject === project.id
                        ? 'bg-[#5eead4]/10 border border-[#5eead4]/30 text-[#5eead4]'
                        : 'text-gray-400 hover:bg-[#1a1f22] hover:text-[#5eead4] border border-transparent'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      selectedProject === project.id 
                        ? 'bg-[#5eead4] animate-pulse' 
                        : project.status === 'In Development'
                        ? 'bg-yellow-500'
                        : 'bg-gray-600'
                    }`} />
                    <span>{project.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {mobileTab === 'runtime' && (
          <div className="h-[calc(100vh-140px)]">
            <RuntimeGraph 
              architecture={getCurrentArchitecture()}
              onNodeClick={(nodeId) => setSelectedNode(nodeId)}
            />
          </div>
        )}

        {mobileTab === 'ask' && (
          <div className="flex flex-col h-[calc(100vh-120px)]">
            <div className="flex-1 overflow-y-auto p-4 pb-0">
              {messages.length === 0 && (
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
                  {[
                    "What has he built at Risiar?",
                    "Does he know Python and Flask?",
                    "What is DukaanX?",
                  ].map((q, i) => (
                    <button
                      key={i}
                      onClick={() => { setInput(q); }}
                      className="w-full text-left px-3 py-2 text-xs border border-[#1a1f22] rounded hover:border-[#5eead4] hover:text-[#5eead4] transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="space-y-3 pb-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`p-3 border rounded ${msg.role === 'visitor' ? 'border-[#5eead4]/30 bg-[#5eead4]/5' : 'border-[#1a1f22] bg-[#0a0e0f]'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-bold ${msg.role === 'visitor' ? 'text-[#5eead4]' : 'text-gray-400'}`}>
                        {msg.role.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-gray-600">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300">{msg.content}</p>
                  </div>
                ))}
                {isLoading && (
                  <div className="p-3 border border-[#1a1f22] rounded bg-[#0a0e0f]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400">AHMEDOS</span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-[#5eead4] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-[#5eead4] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-[#5eead4] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-3 border-t border-[#1a1f22] bg-[#0a0e0f]">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask the runtime…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1 bg-[#0a0e0f] border border-[#1a1f22] rounded px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#5eead4] disabled:opacity-50"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="px-4 py-2 bg-[#5eead4] text-black font-bold text-sm rounded hover:bg-[#4dd4c4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  SEND
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* How Built Modal */}
      <HowBuiltModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <RuntimeProvider>
      <HomeContent />
    </RuntimeProvider>
  );
}
