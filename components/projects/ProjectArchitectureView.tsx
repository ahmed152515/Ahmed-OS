'use client';

import { useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  ReactFlow, 
  ReactFlowProvider,
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Position,
  EdgeProps,
  getBezierPath,
  BaseEdge,
  useReactFlow,
  Handle,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Store,
  User,
  Box,
  Monitor,
  Database,
  Sparkles,
  Cloud,
  Server,
  Cpu,
  CreditCard
} from 'lucide-react';
import { getProjectById } from '@/lib/data/portfolio';
import type { ArchitectureNode as PortfolioArchitectureNode, ArchitectureEdge as PortfolioArchitectureEdge } from '@/lib/data/portfolio';

// Icon mapping for node types - moved outside component to avoid render-time creation
const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  'client': Store,
  'admin': User,
  'frontend': Monitor,
  'backend': Server,
  'service': Box,
  'database': Database,
  'ai': Sparkles,
  'cloud': Cloud,
  'payment': CreditCard,
};

// Custom node component with futuristic compact design matching reference
function ArchitectureNode({ data }: { data: PortfolioArchitectureNode }) {
  // Category color palette - specific hex values provided
  const categoryColors: Record<string, { bg: string; text: string; border: string; glow: string; description: string }> = {
    'Input': { bg: '#00E5FF', text: '#0e7490', border: 'rgba(0, 229, 255, 0.6)', glow: 'rgba(0, 229, 255, 0.3)', description: 'External input source' },
    'User': { bg: '#00E5FF', text: '#0e7490', border: 'rgba(0, 229, 255, 0.6)', glow: 'rgba(0, 229, 255, 0.3)', description: 'User interaction' },
    'Admin': { bg: '#249BFF', text: '#1e40af', border: 'rgba(36, 155, 255, 0.6)', glow: 'rgba(36, 155, 255, 0.3)', description: 'Admin control' },
    'Service': { bg: '#FFD740', text: '#92400e', border: 'rgba(255, 215, 64, 0.6)', glow: 'rgba(255, 215, 64, 0.3)', description: 'Core service' },
    'Frontend': { bg: '#00D9B5', text: '#0e7490', border: 'rgba(0, 217, 181, 0.6)', glow: 'rgba(0, 217, 181, 0.3)', description: 'User interface' },
    'Backend': { bg: '#00E676', text: '#065f46', border: 'rgba(0, 230, 118, 0.6)', glow: 'rgba(0, 230, 118, 0.3)', description: 'Server logic' },
    'Database': { bg: '#8B5CF6', text: '#5b21b6', border: 'rgba(139, 92, 246, 0.6)', glow: 'rgba(139, 92, 246, 0.3)', description: 'Data storage' },
    'Payment': { bg: '#FFD740', text: '#92400e', border: 'rgba(255, 215, 64, 0.6)', glow: 'rgba(255, 215, 64, 0.3)', description: 'Payment processing' },
    'Infrastructure': { bg: '#8B5CF6', text: '#5b21b6', border: 'rgba(139, 92, 246, 0.6)', glow: 'rgba(139, 92, 246, 0.3)', description: 'Cloud infrastructure' },
    'Client': { bg: '#00E5FF', text: '#0e7490', border: 'rgba(0, 229, 255, 0.6)', glow: 'rgba(0, 229, 255, 0.3)', description: 'Client connection' },
    'Platform': { bg: '#00E676', text: '#065f46', border: 'rgba(0, 230, 118, 0.6)', glow: 'rgba(0, 230, 118, 0.3)', description: 'Platform core' },
    'AI': { bg: '#E040FB', text: '#9d174d', border: 'rgba(224, 64, 251, 0.6)', glow: 'rgba(224, 64, 251, 0.3)', description: 'AI processing' },
  };
  
  const colors = categoryColors[data.category] || categoryColors['Service'];
  const IconComponent = iconMap[data.type] || Cpu;
  
  // Check if this is a central/hub node for stronger glow
  const isHub = data.type === 'backend' || data.category === 'Backend' || data.category === 'Platform';
  const glowIntensity = isHub ? '0 0 40px' : '0 0 20px';
  const nodeSize = isHub ? 'min-w-[300px] max-w-[340px] h-[140px]' : 'min-w-[280px] max-w-[320px] h-[130px]';
  
  return (
    <>
      <Handle type="target" position={Position.Top} className="!w-1.5 !h-1.5 !bg-gray-600 !border-none !opacity-0" />
      <div 
        className={`px-4 py-3 rounded-xl border ${nodeSize}`}
        style={{ 
          borderColor: colors.border,
          boxShadow: `${glowIntensity} ${colors.glow}`,
          background: '#020B10',
          borderWidth: '1px'
        }}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div 
            className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${colors.bg}30`, border: `1px solid ${colors.border}`, boxShadow: `0 0 15px ${colors.glow}` }}
          >
            <IconComponent className="w-7 h-7" style={{ color: colors.bg }} />
          </div>
          
          {/* Title and Description */}
          <div className="flex-1 min-w-0">
            <div className="text-lg font-semibold text-white truncate leading-tight" style={{ textShadow: `0 0 10px ${colors.glow}` }}>{data.label}</div>
            <div className="text-[13px] text-gray-500 truncate uppercase tracking-wide mb-1">{data.category}</div>
            <div className="text-[14px] text-gray-400 truncate leading-tight">{colors.description}</div>
          </div>
          
          {/* Square badge with data */}
          <div 
            className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${colors.bg}20`, border: `1px solid ${colors.border}` }}
          >
            <span className="text-[11px] font-bold" style={{ color: colors.bg }}>DATA</span>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!w-1.5 !h-1.5 !bg-gray-600 !border-none !opacity-0" />
    </>
  );
}

// Custom animated edge component with lightning/thunder type animation
function AnimatedEdge({ id, sourceX, sourceY, targetX, targetY, style = {}, source, target }: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    curvature: 0.5,
  });
  
  // Get color from source node category
  const getNodeColor = (nodeId: string) => {
    const categoryColors: Record<string, string> = {
      'Input': '#00E5FF',
      'User': '#00E5FF',
      'Admin': '#249BFF',
      'Service': '#FFD740',
      'Frontend': '#00D9B5',
      'Backend': '#00E676',
      'Database': '#8B5CF6',
      'Payment': '#FFD740',
      'Infrastructure': '#8B5CF6',
      'Client': '#00E5FF',
      'Platform': '#00E676',
      'AI': '#E040FB',
    };
    return '#00E5FF'; // Default cyan
  };
  
  const particleColor = getNodeColor(source);
  
  return (
    <g>
      {/* Base edge line - darker for better visibility */}
      <BaseEdge 
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: particleColor,
          strokeWidth: 1,
          opacity: 0.4,
        }}
      />
      
      {/* Lightning/thunder type animated particles - faster and more energetic */}
      {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((delay, index) => (
        <circle
          key={`${id}-particle-${index}`}
          r={1.5}
          fill={particleColor}
          style={{ filter: `drop-shadow(0 0 8px ${particleColor})` }}
        >
          <animateMotion
            dur="1.5s"
            repeatCount="indefinite"
            begin={`${delay}s`}
            path={edgePath}
          />
          <animate
            attributeName="opacity"
            values="0;1;0.8;0"
            dur="1.5s"
            repeatCount="indefinite"
            begin={`${delay}s`}
          />
          <animate
            attributeName="r"
            values="1;2;1.5;1"
            dur="1.5s"
            repeatCount="indefinite"
            begin={`${delay}s`}
          />
        </circle>
      ))}
    </g>
  );
}

// Move nodeTypes and edgeTypes outside component to prevent recreation on every render
const nodeTypes = {
  architectureNode: ArchitectureNode,
};

const edgeTypes = {
  animated: AnimatedEdge,
};

interface ProjectArchitectureViewProps {
  projectId?: string;
}

function ProjectArchitectureGraph({ projectId }: ProjectArchitectureViewProps) {
  const project = projectId ? getProjectById(projectId) : undefined;
  const { fitView } = useReactFlow();
  const prevProjectIdRef = useRef<string | undefined>(undefined);
  
  // Memoize nodeTypes and edgeTypes to prevent recreation
  const memoizedNodeTypes = useMemo(() => nodeTypes, []);
  const memoizedEdgeTypes = useMemo(() => edgeTypes, []);
  
  // Anti-overlap algorithm - ensure no boxes touch each other
  // This must be outside the map to persist across all nodes
  const positions: Record<string, { x: number; y: number }> = {};
  const nodeWidth = 300;
  const nodeHeight = 130;
  const padding = 30; // Extra padding to ensure no touching
  
  // Central hub layout - position nodes around a central core with anti-overlap
  const getHubPosition = (nodeId: string, type: string, category: string) => {
    // Central core position
    const centerX = 400;
    const centerY = 300;
    
    // Identify the core/backend node
    const isCore = type === 'backend' || category === 'Backend' || category === 'Platform';
    
    if (isCore) {
      return { x: centerX, y: centerY };
    }
    
    // Input/User nodes at top - much further from center
    if (type === 'client' || category === 'Input' || category === 'User') {
      return { x: centerX, y: 40 };
    }
    
    // Database/Infrastructure at bottom - much further from center
    if (type === 'database' || type === 'cloud' || category === 'Database' || category === 'Infrastructure') {
      return { x: centerX, y: 560 };
    }
    
    // Service nodes arranged in a circle around the core with maximum spacing to prevent overlaps
    const serviceNodes = (project?.architectureGraph?.nodes || []).filter(n => 
      n.type === 'service' || n.category === 'Service' || n.category === 'Frontend' || n.category === 'Payment'
    );
    const serviceIndex = serviceNodes.findIndex(n => n.id === nodeId);
    const angle = (serviceIndex / serviceNodes.length) * Math.PI * 2;
    const radius = 450; // Increased to 450 to prevent overlaps with larger boxes
    
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    };
  };
  
  const getNonOverlappingPosition = (nodeId: string, type: string, category: string) => {
    const basePosition = getHubPosition(nodeId, type, category);
    let position = { ...basePosition };
    
    // Check against all previously positioned nodes
    let attempts = 0;
    const maxAttempts = 50;
    
    while (attempts < maxAttempts) {
      let overlap = false;
      
      for (const [otherId, otherPos] of Object.entries(positions)) {
        if (otherId === nodeId) continue;
        
        // Calculate distance between nodes
        const dx = position.x - otherPos.x;
        const dy = position.y - otherPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Minimum required distance to prevent touching
        const minDistance = Math.sqrt(nodeWidth * nodeWidth + nodeHeight * nodeHeight) + padding;
        
        if (distance < minDistance) {
          overlap = true;
          // Move to left or right to avoid overlap
          const moveX = dx > 0 ? 60 : -60;
          const moveY = dy > 0 ? 40 : -40;
          position.x += moveX;
          position.y += moveY;
          break;
        }
      }
      
      if (!overlap) break;
      attempts++;
    }
    
    positions[nodeId] = position;
    return position;
  };
  
  // Convert architecture to React Flow format with central hub layout
  const initialNodes: Node[] = (project?.architectureGraph?.nodes || []).map((node: PortfolioArchitectureNode) => {
    const position = getNonOverlappingPosition(node.id, node.type, node.category);
    
    return {
      id: node.id,
      type: 'architectureNode',
      position,
      data: node as unknown as Record<string, unknown>,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    };
  });
  
  const initialEdges: Edge[] = (project?.architectureGraph?.edges || []).map((edge: PortfolioArchitectureEdge, index: number) => ({
    id: `e${index}`,
    source: edge.source,
    target: edge.target,
    type: 'animated',
    animated: true,
    style: { strokeWidth: 1 },
  }));
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const onConnect = (params: Connection) => setEdges((eds) => addEdge(params, eds));
  
  // Reset nodes and edges when projectId changes
  useEffect(() => {
    if (projectId !== prevProjectIdRef.current) {
      prevProjectIdRef.current = projectId;
      setNodes(initialNodes);
      setEdges(initialEdges);
      // Fit view after a short delay to ensure nodes are updated
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 300 });
      }, 50);
    }
  }, [projectId, initialNodes, initialEdges, setNodes, setEdges, fitView]);
  
  if (!project || !project.architectureGraph) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        No architecture data available
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#0a0e0f]">
      <ReactFlow
        key={`project-${projectId}`}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={memoizedNodeTypes}
        edgeTypes={memoizedEdgeTypes}
        fitView
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.1}
        maxZoom={5}
        className="bg-[#020B10]"
      >
        <Background variant={BackgroundVariant.Dots} gap={35} size={1} color="#0A2029" />
        <div className="absolute bottom-4 left-4 bg-[#020B10] border border-[#0A2029] rounded-lg p-2 text-[10px] text-gray-400">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded bg-[#00E5FF]" />
            <span>Input/User</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded bg-[#FFD740]" />
            <span>Service</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded bg-[#00E676]" />
            <span>Backend</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded bg-[#8B5CF6]" />
            <span>Database</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#E040FB]" />
            <span>AI</span>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <MiniMap 
            className="!bg-[#020B10] !border !border-[#0A2029] rounded-lg" 
            nodeColor={(node) => {
              const data = node.data as unknown as PortfolioArchitectureNode;
              const categoryColors: Record<string, string> = {
                'Input': '#00E5FF',
                'User': '#00E5FF',
                'Admin': '#249BFF',
                'Service': '#FFD740',
                'Frontend': '#00D9B5',
                'Backend': '#00E676',
                'Database': '#8B5CF6',
                'Payment': '#FFD740',
                'Infrastructure': '#8B5CF6',
                'Client': '#00E5FF',
                'Platform': '#00E676',
                'AI': '#E040FB',
              };
              return categoryColors[data.category] || '#FFD740';
            }}
            maskColor="rgba(0, 0, 0, 0.5)"
          />
          <Controls className="!bg-[#020B10] !border !border-[#0A2029] !text-gray-400" />
        </div>
      </ReactFlow>
    </div>
  );
}

export default function ProjectArchitectureView({ projectId }: ProjectArchitectureViewProps) {
  return (
    <ReactFlowProvider>
      <ProjectArchitectureGraph projectId={projectId} />
    </ReactFlowProvider>
  );
}
