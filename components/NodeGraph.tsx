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
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'src', label: 'Knowledge', subtitle: 'Retrieved', status: 'completed', type: 'src' },
    { id: 'ctrl', label: 'Orchestrator', subtitle: 'Idle', status: 'idle', type: 'ctrl' },
    { id: 'mcp', label: 'MCP', subtitle: '0 used', status: 'idle', type: 'mcp' },
    { id: 'tool1', label: 'get_technical_skills', subtitle: 'Return structured technical skills', status: 'idle', type: 'tool' },
    { id: 'tool2', label: 'search_projects', subtitle: 'Search or list public projects', status: 'idle', type: 'tool' },
    { id: 'tool3', label: 'get_experience', subtitle: 'Return work history and roles', status: 'idle', type: 'tool' },
    { id: 'tool4', label: 'get_dukaanx_project', subtitle: 'Details on the DukaanX SaaS product', status: 'idle', type: 'tool' },
  ]);

  const [edges, setEdges] = useState<Edge[]>([
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

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      src: 'SRC',
      ctrl: 'CTRL',
      mcp: 'MCP',
      tool: 'TOOL'
    };
    return labels[type] || type.toUpperCase();
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
                stroke={edge.active ? 'var(--color-accent)' : 'var(--color-line-2)'}
                strokeWidth={edge.active ? 2 : 1}
                strokeDasharray={edge.active ? '5,5' : 'none'}
                animate={edge.active ? {
                  strokeDashoffset: [0, -10]
                } : {}}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
              {edge.active && (
                <text
                  x={midX}
                  y={midY - 5}
                  fill="var(--color-accent)"
                  fontSize="10"
                  textAnchor="middle"
                  style={{ fontFamily: 'var(--font-mono)' }}
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
            className="absolute panel p-3 rounded-sm"
            style={{
              left: pos.x - 80,
              top: pos.y - 25,
              width: 160,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-[9px] tracking-wider" style={{ color: 'var(--color-mute)' }}>
                {getTypeLabel(node.type)}
              </span>
              <div className="flex items-center gap-1">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: node.status === 'completed' ? 'var(--color-accent)' :
                           node.status === 'thinking' ? 'var(--color-accent)' :
                           'var(--color-line-2)'
                  }}
                  animate={node.status === 'thinking' ? {
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1]
                  } : {}}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity
                  }}
                />
                <span className="text-[9px]" style={{ color: 'var(--color-mute)' }}>
                  {node.status === 'completed' ? 'COMPLETED' :
                   node.status === 'thinking' ? 'Thinking…' :
                   'Idle'}
                </span>
              </div>
            </div>
            <p className="text-xs font-bold text-white mb-0.5">{node.label}</p>
            <p className="text-[10px] truncate" style={{ color: 'var(--color-fog)' }}>{node.subtitle}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
