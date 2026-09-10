'use client';

import { X } from 'lucide-react';
import { Project } from '@/lib/data/portfolio';

interface ProjectDetailPanelProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDetailPanel({ project, onClose }: ProjectDetailPanelProps) {
  if (!project) return null;

  return (
    <div className="absolute inset-0 bg-[#0a0e0f]/95 border border-[#1a1f22] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{project.name}</h2>
            <p className="text-xs text-[#5eead4]">{project.category}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-1 text-xs border border-[#1a1f22] rounded text-gray-400">
                {project.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#1a1f22] rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Technologies */}
          <div>
            <h3 className="text-xs text-gray-500 tracking-widest mb-3">TECHNOLOGIES</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs border border-[#1a1f22] rounded text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Overview */}
          <div>
            <h3 className="text-xs text-gray-500 tracking-widest mb-3">OVERVIEW</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{project.overview}</p>
          </div>

          {/* Problem */}
          {project.problem && (
            <div>
              <h3 className="text-xs text-gray-500 tracking-widest mb-3">PROBLEM</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{project.problem}</p>
            </div>
          )}

          {/* Solution */}
          {project.solution && (
            <div>
              <h3 className="text-xs text-gray-500 tracking-widest mb-3">SOLUTION</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{project.solution}</p>
            </div>
          )}

          {/* Architecture */}
          {project.architecture && (
            <div>
              <h3 className="text-xs text-gray-500 tracking-widest mb-3">ARCHITECTURE</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{project.architecture}</p>
            </div>
          )}

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <div>
              <h3 className="text-xs text-gray-500 tracking-widest mb-3">FEATURES</h3>
              <ul className="space-y-2">
                {project.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-start">
                    <span className="text-[#5eead4] mr-2">▸</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contribution */}
          {project.contribution && (
            <div>
              <h3 className="text-xs text-gray-500 tracking-widest mb-3">CONTRIBUTION</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{project.contribution}</p>
            </div>
          )}

          {/* Technical Decisions */}
          {project.technicalDecisions && project.technicalDecisions.length > 0 && (
            <div>
              <h3 className="text-xs text-gray-500 tracking-widest mb-3">TECHNICAL DECISIONS</h3>
              <ul className="space-y-2">
                {project.technicalDecisions.map((decision, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-start">
                    <span className="text-[#5eead4] mr-2">▸</span>
                    <span>{decision}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Challenges */}
          {project.challenges && project.challenges.length > 0 && (
            <div>
              <h3 className="text-xs text-gray-500 tracking-widest mb-3">CHALLENGES</h3>
              <ul className="space-y-2">
                {project.challenges.map((challenge, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-start">
                    <span className="text-[#5eead4] mr-2">▸</span>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Learning */}
          {project.learning && (
            <div>
              <h3 className="text-xs text-gray-500 tracking-widest mb-3">LEARNING & OUTCOME</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{project.learning}</p>
            </div>
          )}

          {/* Links */}
          <div className="border-t border-[#1a1f22] pt-6">
            <h3 className="text-xs text-gray-500 tracking-widest mb-3">LINKS</h3>
            <div className="space-y-2">
              {project.github && (
                <a
                  href={`https://${project.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-[#5eead4] hover:underline"
                >
                  🔗 {project.github}
                </a>
              )}
              {project.url && (
                <a
                  href={`https://${project.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-[#5eead4] hover:underline"
                >
                  🔗 {project.url}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
