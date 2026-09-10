'use client';

import { ReactNode } from 'react';

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function Tab({ label, isActive, onClick }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2 text-sm font-medium transition-colors ${
        isActive 
          ? 'text-[var(--accent)]' 
          : 'text-[var(--foreground)] opacity-50 hover:opacity-80'
      }`}
    >
      {label}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
      )}
    </button>
  );
}

interface HowBuiltTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}

export default function HowBuiltTabs({ activeTab, onTabChange, children }: HowBuiltTabsProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-[var(--border)]">
        <Tab
          label="How it works"
          isActive={activeTab === 'how-it-works'}
          onClick={() => onTabChange('how-it-works')}
        />
        <Tab
          label="Sample chats"
          isActive={activeTab === 'sample-chats'}
          onClick={() => onTabChange('sample-chats')}
        />
        <Tab
          label="FAQ"
          isActive={activeTab === 'faq'}
          onClick={() => onTabChange('faq')}
        />
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {children}
      </div>
    </div>
  );
}
