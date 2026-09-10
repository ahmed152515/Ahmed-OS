'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface RuntimeEvent {
  type: string;
  timestamp: string;
  message: string;
  tool?: string;
}

export interface RuntimeState {
  activeNodeIds: string[];
  completedNodeIds: string[];
  activeEdgeIds: string[];
  completedEdgeIds: string[];
  errorNodeIds: string[];
  events: RuntimeEvent[];
  isProcessing: boolean;
  isWakingUp: boolean;
}

interface RuntimeContextType extends RuntimeState {
  setActiveNode: (nodeId: string) => void;
  setCompletedNode: (nodeId: string) => void;
  setActiveEdge: (edgeId: string) => void;
  setCompletedEdge: (edgeId: string) => void;
  setErrorNode: (nodeId: string) => void;
  addEvent: (event: RuntimeEvent) => void;
  reset: () => void;
  setProcessing: (isProcessing: boolean) => void;
  setWakingUp: (isWakingUp: boolean) => void;
}

const RuntimeContext = createContext<RuntimeContextType | undefined>(undefined);

// Tool to node mapping for AI runtime graph
export const toolToNodeMap: Record<string, string> = {
  'get_profile': 'orchestrator',
  'get_skills': 'skills',
  'get_experience': 'experience',
  'get_education': 'experience',
  'get_projects': 'projects',
  'get_ai_experience': 'ai',
  'get_cloud_experience': 'ai',
  'get_engineering_philosophy': 'ai',
};

// Tool to edge mapping for AI runtime graph
export const toolToEdgeMap: Record<string, string> = {
  'get_profile': 'e1',
  'get_skills': 'e2',
  'get_experience': 'e3',
  'get_education': 'e3',
  'get_projects': 'e4',
  'get_ai_experience': 'e5',
  'get_cloud_experience': 'e5',
  'get_engineering_philosophy': 'e5',
};

export function RuntimeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RuntimeState>({
    activeNodeIds: [],
    completedNodeIds: [],
    activeEdgeIds: [],
    completedEdgeIds: [],
    errorNodeIds: [],
    events: [],
    isProcessing: false,
    isWakingUp: false,
  });

  const setActiveNode = (nodeId: string) => {
    setState((prev) => ({
      ...prev,
      activeNodeIds: [...new Set([...prev.activeNodeIds, nodeId])],
      completedNodeIds: prev.completedNodeIds.filter((id) => id !== nodeId),
    }));
  };

  const setCompletedNode = (nodeId: string) => {
    setState((prev) => ({
      ...prev,
      activeNodeIds: prev.activeNodeIds.filter((id) => id !== nodeId),
      completedNodeIds: [...new Set([...prev.completedNodeIds, nodeId])],
    }));
  };

  const setActiveEdge = (edgeId: string) => {
    setState((prev) => ({
      ...prev,
      activeEdgeIds: [...new Set([...prev.activeEdgeIds, edgeId])],
      completedEdgeIds: prev.completedEdgeIds.filter((id) => id !== edgeId),
    }));
  };

  const setCompletedEdge = (edgeId: string) => {
    setState((prev) => ({
      ...prev,
      activeEdgeIds: prev.activeEdgeIds.filter((id) => id !== edgeId),
      completedEdgeIds: [...new Set([...prev.completedEdgeIds, edgeId])],
    }));
  };

  const setErrorNode = (nodeId: string) => {
    setState((prev) => ({
      ...prev,
      activeNodeIds: prev.activeNodeIds.filter((id) => id !== nodeId),
      errorNodeIds: [...new Set([...prev.errorNodeIds, nodeId])],
    }));
  };

  const addEvent = (event: RuntimeEvent) => {
    setState((prev) => ({
      ...prev,
      events: [...prev.events, event],
    }));
  };

  const reset = () => {
    setState({
      activeNodeIds: [],
      completedNodeIds: [],
      activeEdgeIds: [],
      completedEdgeIds: [],
      errorNodeIds: [],
      events: [],
      isProcessing: false,
      isWakingUp: false,
    });
  };

  const setProcessing = (isProcessing: boolean) => {
    setState((prev) => ({ ...prev, isProcessing }));
  };

  const setWakingUp = (isWakingUp: boolean) => {
    setState((prev) => ({ ...prev, isWakingUp }));
  };

  return (
    <RuntimeContext.Provider
      value={{
        ...state,
        setActiveNode,
        setCompletedNode,
        setActiveEdge,
        setCompletedEdge,
        setErrorNode,
        addEvent,
        reset,
        setProcessing,
        setWakingUp,
      }}
    >
      {children}
    </RuntimeContext.Provider>
  );
}

export function useRuntime() {
  const context = useContext(RuntimeContext);
  if (context === undefined) {
    throw new Error('useRuntime must be used within a RuntimeProvider');
  }
  return context;
}
