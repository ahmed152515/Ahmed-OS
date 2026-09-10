'use client';

import { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import RuntimeNode from './RuntimeNode';
import AnimatedEdge from './AnimatedEdge';
import { Architecture, ArchitectureNode, ArchitectureEdge } from '@/lib/data/portfolio';
import { useRuntime } from '@/lib/runtime/runtimeStore';

const nodeTypes = {
  runtimeNode: RuntimeNode,
};

const edgeTypes = {
  animated: AnimatedEdge,
};

interface RuntimeGraphProps {
  architecture?: Architecture;
  onNodeClick?: (nodeId: string) => void;
}

export default function RuntimeGraph({ architecture, onNodeClick }: RuntimeGraphProps) {
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const { activeNodeIds, completedNodeIds, activeEdgeIds, completedEdgeIds } = useRuntime();

  // Convert architecture data to React Flow format with branching layout
  const flowNodes = useMemo(() => {
    if (!architecture?.nodes) return [];

    // Find the central node (usually the project name or main service)
    const centralNode = architecture.nodes.find(n => 
      n.label.includes('DUKAANX') || 
      n.label.includes('CRM') ||
      n.label.includes('WEBSITE') ||
      n.label.includes('ADMIN') ||
      n.type === 'backend' ||
      n.type === 'frontend'
    ) || architecture.nodes[0];

    const centerX = 400;
    const centerY = 300;
    const radius = 200;

    return architecture.nodes.map((node: ArchitectureNode, index: number) => {
      let position;
      
      if (node.id === centralNode.id) {
        // Central node at the center
        position = { x: centerX, y: centerY };
      } else {
        // Branching layout: arrange other nodes in a circle around center
        const angle = ((index - (centralNode.id === node.id ? 0 : 0)) / (architecture.nodes.length - 1)) * 2 * Math.PI;
        position = {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius
        };
      }
      
      // Determine node status from runtime state
      let status: 'idle' | 'active' | 'completed' | 'error' = 'idle';
      if (activeNodeIds.includes(node.id)) status = 'active';
      else if (completedNodeIds.includes(node.id)) status = 'completed';
      
      return {
        id: node.id,
        type: 'runtimeNode',
        position,
        data: {
          ...node,
          status,
        },
      } as Node;
    });
  }, [architecture, activeNodeIds, completedNodeIds]);

  const flowEdges = useMemo(() => {
    if (!architecture?.edges) return [];

    return architecture.edges.map((edge: ArchitectureEdge) => {
      // Determine edge status from runtime state
      let status: 'idle' | 'active' | 'completed' | 'error' = 'idle';
      if (activeEdgeIds.includes(edge.id)) status = 'active';
      else if (completedEdgeIds.includes(edge.id)) status = 'completed';
      
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'animated',
        data: {
          status,
          type: edge.type,
        },
      } as Edge;
    });
  }, [architecture, activeEdgeIds, completedEdgeIds]);

  // Initialize nodes and edges when architecture changes
  useEffect(() => {
    if (architecture) {
      // Smooth transition: fade out old nodes, then fade in new ones
      setNodes([]);
      setEdges([]);
      
      setTimeout(() => {
        setNodes(flowNodes);
        setEdges(flowEdges);
      }, 150);
    }
  }, [architecture, flowNodes, flowEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClickHandler = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (onNodeClick) {
        onNodeClick(node.id);
      }
    },
    [onNodeClick]
  );

  return (
    <div className="w-full h-full bg-[#0a0e0f]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClickHandler}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.5}
        maxZoom={2}
        className="bg-[#0a0e0f]"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#1a1f22"
        />
        <Controls
          className="!bg-[#0a0e0f] !border !border-[#1a1f22] !text-gray-400"
          showZoom
          showFitView
          showInteractive={false}
        />
        <MiniMap
          className="!bg-[#0a0e0f] !border !border-[#1a1f22]"
          nodeColor="#1a1f22"
          maskColor="rgba(0, 0, 0, 0.5)"
        />
      </ReactFlow>
    </div>
  );
}
