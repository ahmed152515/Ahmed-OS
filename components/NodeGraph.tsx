'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: string;
  label: string;
  subtitle: string;
  status: 'idle' | 'thinking' | 'completed';
  type: 'src' | 'ctrl' | 'mcp' | 'tool';
}

interface Edge {
  from: string;
  to: string;
  label: string;
  active: boolean;
}

export default function NodeGraph() {
  const [nodes] = useState<Node[]>([
    { id: 'src', label: 'Knowledge', subtitle: 'Retrieved', status: 'completed', type: 'src' },
    { id: 'ctrl', label: 'Orchestrator', subtitle: 'Idle', status: 'idle', type: 'ctrl' },
    { id: 'mcp', label: 'MCP', subtitle: '0 used', status: 'idle', type: 'mcp' },
    { id: 'tool1', label: 'get_technical_skills', subtitle: 'Return structured technical skills', status: 'idle', type: 'tool' },
    { id: 'tool2', label: 'search_projects', subtitle: 'Search or list public projects', status: 'idle', type: 'tool' },
    { id: 'tool3', label: 'get_experience', subtitle: 'Return work history / roles', status: 'idle', type: 'tool' },
    { id: 'tool4', label: 'get_dukaanx_project', subtitle: 'Details on the DukaanX SaaS product', status: 'idle', type: 'tool' },
  ]);

  const [edges] = useState<Edge[]>([
    { from: 'src', to: 'ctrl', label: 'facts', active: false },
    { from: 'ctrl', to: 'tool1', label: 'tool', active: false },
    { from: 'ctrl', to: 'tool2', label: 'tool', active: false },
    { from: 'ctrl', to: 'tool3', label: 'tool', active: false },
    { from: 'ctrl', to: 'tool4', label: 'tool', active: false },
    { from: 'tool1', to: 'mcp', label: 'expose', active: false },
    { from: 'tool2', to: 'mcp', label: 'expose', active: false },
    { from: 'tool3', to: 'mcp', label: 'expose', active: false },
    { from: 'tool4', to: 'mcp', label: 'expose', active: false },
    { from: 'mcp', to: 'ctrl', label: 'mcp', active: false },
  ]);

  const getNodePosition = (id: string) => {
    const positions: Record<string, { x: number; y: number }> = {
      src: { x: 50, y: 50 },
      ctrl: { x: 200, y: 50 },
      mcp: { x: 350, y: 50 },
      tool1: { x: 200, y: 150 },
      tool2: { x: 200, y: 220 },
      tool3: { x: 200, y: 290 },
      tool4: { x: 200, y: 360 },
    };
    return positions[id] || { x: 0, y: 0 };
  };

  return (
    <div className="relative w-full h-full">
      <svg className="absolute inset-0 w-full h-full">
        {edges.map((edge: Edge, i: number) => {
          const from = getNodePosition(edge.from);
          const to = getNodePosition(edge.to);
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          
          return (
            <g key={i}>
              <motion.line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={edge.active ? '#5eead4' : '#1a1f22'}
                strokeWidth={edge.active ? 2 : 1}
                strokeDasharray={edge.active ? '5,5' : 'none'}
                animate={edge.active ? {
                  strokeDashoffset: [0, -10]
                } : {}}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
              {edge.active && (
                <text
                  x={midX}
                  y={midY - 5}
                  fill="#5eead4"
                  fontSize="10"
                  textAnchor="middle"
                  className="font-mono"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {nodes.map((node: Node) => {
        const pos = getNodePosition(node.id);
        return (
          <motion.div
            key={node.id}
            className="absolute border border-[#1a1f22] bg-[#0a0e0f] p-3 rounded"
            style={{
              left: pos.x - 80,
              top: pos.y - 25,
              width: 160,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <motion.div
                className={`w-2 h-2 rounded-full ${
                  node.status === 'completed' ? 'bg-[#5eead4]' :
                  node.status === 'thinking' ? 'bg-[#5eead4] animate-pulse' :
                  'bg-gray-600'
                }`}
                animate={node.status === 'thinking' ? {
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1]
                } : {}}
                transition={{
                  duration: 0.8,
                  repeat: Infinity
                }}
              />
              <span className="text-xs font-bold text-white">{node.label}</span>
            </div>
            <p className="text-[10px] text-gray-500 truncate">{node.subtitle}</p>
            {node.status === 'completed' && (
              <p className="text-[9px] text-[#5eead4] mt-1">COMPLETED</p>
            )}
            {node.status === 'thinking' && (
              <p className="text-[9px] text-[#5eead4] mt-1">Thinking...</p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
