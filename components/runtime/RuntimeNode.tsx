'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

interface RuntimeNodeData {
  id: string;
  type: 'client' | 'frontend' | 'backend' | 'database' | 'api' | 'auth' | 'storage' | 'ai' | 'cloud' | 'queue' | 'payment' | 'admin' | 'service';
  label: string;
  category: string;
  description?: string;
  status: 'idle' | 'active' | 'completed' | 'error';
}

function RuntimeNode({ data }: NodeProps) {
  const nodeData = data as unknown as RuntimeNodeData;
  const { label, category, description, status } = nodeData;

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return '#5eead4';
      case 'completed':
        return '#5eead466';
      case 'error':
        return '#ef4444';
      default:
        return '#1a1f22';
    }
  };

  const getBorderColor = () => {
    switch (status) {
      case 'active':
        return '#5eead4';
      case 'completed':
        return '#5eead466';
      case 'error':
        return '#ef4444';
      default:
        return '#1a1f22';
    }
  };

  const getGlowColor = () => {
    switch (status) {
      case 'active':
        return 'rgba(94, 234, 212, 0.3)';
      case 'completed':
        return 'rgba(94, 234, 212, 0.1)';
      case 'error':
        return 'rgba(239, 68, 68, 0.3)';
      default:
        return 'transparent';
    }
  };

  return (
    <div
      className={`
        relative px-3 py-2 bg-[#0a0e0f] border rounded-sm min-w-[140px] max-w-[180px]
        transition-all duration-300
      `}
      style={{
        borderColor: getBorderColor(),
        boxShadow: status === 'active' || status === 'error' ? `0 0 12px ${getGlowColor()}` : 'none',
      }}
    >
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-gray-600 !border-none" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-gray-600 !border-none" />

      <div className="flex items-center gap-2 mb-1">
        <div 
          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            status === 'active' ? 'animate-pulse' : ''
          }`}
          style={{ backgroundColor: getStatusColor() }}
        />
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
          {category}
        </span>
      </div>

      <div className="text-xs font-medium text-white font-mono truncate">
        {label}
      </div>

      {description && status === 'active' && (
        <div className="text-[9px] text-gray-400 mt-1 truncate">
          {description}
        </div>
      )}
      
      {status === 'error' && (
        <div className="text-[9px] text-red-400 mt-1 truncate animate-pulse">
          ERROR
        </div>
      )}
    </div>
  );
}

export default memo(RuntimeNode);
