'use client';

import { memo } from 'react';
import { EdgeProps, getBezierPath, Position } from '@xyflow/react';

interface AnimatedEdgeData {
  status: 'idle' | 'active' | 'completed' | 'error';
  type: 'data' | 'request' | 'response' | 'auth' | 'sync' | 'async';
}

function AnimatedEdge({ id, sourceX, sourceY, targetX, targetY, data }: EdgeProps) {
  const edgeData = data as unknown as AnimatedEdgeData;
  const status = edgeData?.status || 'idle';

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  });

  const getEdgeColor = () => {
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

  const getEdgeWidth = () => {
    switch (status) {
      case 'active':
        return 2;
      case 'completed':
        return 1.5;
      default:
        return 1;
    }
  };

  const getParticleColor = () => {
    switch (status) {
      case 'active':
        return '#5eead4';
      case 'error':
        return '#ef4444';
      default:
        return '#5eead4';
    }
  };

  // Calculate particle position along the path (simple linear interpolation)
  const getParticlePosition = (progress: number) => {
    const x = sourceX + (targetX - sourceX) * progress;
    const y = sourceY + (targetY - sourceY) * progress;
    return { x, y };
  };

  return (
    <g>
      <path
        id={id}
        d={edgePath}
        stroke={getEdgeColor()}
        strokeWidth={getEdgeWidth()}
        fill="none"
        className="transition-all duration-300"
      />
      
      {status === 'active' && (
        <>
          <circle
            cx={getParticlePosition(0.2).x}
            cy={getParticlePosition(0.2).y}
            r={2.5}
            fill={getParticleColor()}
            className="shadow-[0_0_8px_rgba(94,234,212,0.9)] animate-[particleFlow_1.5s_linear_infinite]"
            style={{ animationDelay: '0s' }}
          />
          <circle
            cx={getParticlePosition(0.4).x}
            cy={getParticlePosition(0.4).y}
            r={2.5}
            fill={getParticleColor()}
            className="shadow-[0_0_8px_rgba(94,234,212,0.9)] animate-[particleFlow_1.5s_linear_infinite]"
            style={{ animationDelay: '0.3s' }}
          />
          <circle
            cx={getParticlePosition(0.6).x}
            cy={getParticlePosition(0.6).y}
            r={2.5}
            fill={getParticleColor()}
            className="shadow-[0_0_8px_rgba(94,234,212,0.9)] animate-[particleFlow_1.5s_linear_infinite]"
            style={{ animationDelay: '0.6s' }}
          />
          <circle
            cx={getParticlePosition(0.8).x}
            cy={getParticlePosition(0.8).y}
            r={2.5}
            fill={getParticleColor()}
            className="shadow-[0_0_8px_rgba(94,234,212,0.9)] animate-[particleFlow_1.5s_linear_infinite]"
            style={{ animationDelay: '0.9s' }}
          />
        </>
      )}
      
      {status === 'error' && (
        <circle
          cx={getParticlePosition(0.5).x}
          cy={getParticlePosition(0.5).y}
          r={4}
          fill="#ef4444"
          className="shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse"
        />
      )}
    </g>
  );
}

export default memo(AnimatedEdge);
