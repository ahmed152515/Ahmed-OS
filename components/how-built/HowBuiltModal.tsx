'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import HowBuiltTabs from './HowBuiltTabs';
import HowItWorks from './HowItWorks';
import SampleChats from './SampleChats';
import FAQ from './FAQ';

interface HowBuiltModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowBuiltModal({ isOpen, onClose }: HowBuiltModalProps) {
  const [activeTab, setActiveTab] = useState('how-it-works');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'how-it-works':
        return <HowItWorks />;
      case 'sample-chats':
        return <SampleChats />;
      case 'faq':
        return <FAQ />;
      default:
        return <HowItWorks />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[48rem] max-h-[min(92dvh,840px)] bg-[var(--background)] border border-[var(--border)] rounded-sm flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="how-built-title"
          >
            {/* Header */}
            <div className="flex-shrink-0 p-6 border-b border-[var(--border)]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-[var(--accent)] opacity-60 font-mono mb-2">
                    BEHIND THE RUNTIME
                  </div>
                  <h2 id="how-built-title" className="text-lg font-medium text-[var(--foreground)] mb-1">
                    How I built this
                  </h2>
                  <p className="text-sm text-[var(--foreground)] opacity-60">
                    Technical architecture and implementation details
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-[var(--foreground)] opacity-50 hover:opacity-100 transition-opacity"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Tabs and Content */}
            <HowBuiltTabs activeTab={activeTab} onTabChange={setActiveTab}>
              <div className="p-6">
                {renderContent()}
              </div>
            </HowBuiltTabs>

            {/* Footer */}
            <div className="flex-shrink-0 p-4 border-t border-[var(--border)] bg-[rgba(94,234,212,0.02)]">
              <div className="text-xs text-[var(--foreground)] opacity-50 font-mono">
                Ahmed Sayyed · MCP /mcp · built to be investigated
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
