'use client';

import { useState } from 'react';
import AccordionItem from './AccordionItem';

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  sections: Section[];
}

export default function Accordion({ sections }: AccordionProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="border-t border-[var(--border)]">
      {sections.map((section) => (
        <AccordionItem
          key={section.id}
          title={section.title}
          isOpen={openSection === section.id}
          onToggle={() => handleToggle(section.id)}
        >
          {section.content}
        </AccordionItem>
      ))}
    </div>
  );
}
