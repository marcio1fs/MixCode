import React, { useState } from 'react';
import { FileSystemNode } from '../types';
import Icon from './Icon';

interface FileExplorerProps {
  rootNode: FileSystemNode | null;
  activeFile: string;
  onFileSelect: (file: FileSystemNode) => void;
  onOpenFolder: () => void;
  onGenerateProjectMap: () => void;
  onArchitectureReview: () => void;
  onGenerateTechDebtRadar: () => void;
  onForgeModule: () => void;
}

const FileNode: React.FC<{ node: FileSystemNode; activeFile: string; onFileSelect: (file: FileSystemNode) => void; level?: number }> = ({ node, activeFile, onFileSelect, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isMixSync = node.path.includes('.mixsync');

  if (node.type === 'folder') {
    return (
      <div style={{ paddingLeft: `${level * 1}rem` }}>
        <div 
            className="flex items-center space-x-2 py-1 px-2 cursor-pointer hover:bg-[var(--color-bg-hover)] rounded-md"
            onClick={() => setIsOpen(!isOpen)}
        >
          <div className={`transform transition-transform duration-150 ${isOpen ? 'rotate-90' : ''}`}>
            <svg className="w-4 h-4 text-[var(--color-text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
          <Icon name="folder" className="w-5 h-5 text-yellow-400" />
          <span className={`text-[var(--color-text-secondary)] ${isMixSync ? 'text-[var(--color-text-quaternary)] italic' : ''}`}>{node.name}</span>
        </div>
        {isOpen && node.children && (
          <div>
            {node.children.map(child => (
              <FileNode key={child.path} node={child} activeFile={activeFile} onFileSelect={onFileSelect} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ paddingLeft: `${level * 1}rem` }}>
      <div 
        className={`flex items-center space-x-2 py-1 px-2 cursor-pointer rounded-md ${activeFile === node.path ? 'bg-[var(--color-accent)]/20' : 'hover:bg-[var(--color-bg-hover)]'}`}
        onClick={() => onFileSelect(node)}
      >
        <div className="w-4 h-4"></div> {/* Spacer */}
        <Icon name="file" className="w-5 h-5 text-[var(--color-text-tertiary)]" />
        <span className={`${activeFile === node.path ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'} ${isMixSync ? 'text-[var(--color-text-quaternary)] italic' : ''}`}>{node.name}</span>
      </div>
    </div>
  );
};

const FileExplorer: React.FC<FileExplorerProps> = ({ rootNode, activeFile, onFileSelect, onOpenFolder, onGenerateProjectMap, onArchitectureReview, onGenerateTechDebtRadar, onForgeModule }) => {
  return (
    <>
      <div className="flex justify-between items-center px-2 pb-2 flex-shrink-0">
          <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">Explorer</h2>
          {rootNode && (
            <div className="flex items-center space-x-1">
                 <button onClick={onForgeModule} title="Forjar Novo Módulo" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] p-1 rounded-md hover:bg-[var(--color-bg-hover)]">
                    <Icon name="plus-circle" className="w-5 h-5" />
                </button>
                 <button onClick={onGenerateTechDebtRadar} title="Generate Tech-Debt Radar" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] p-1 rounded-md hover:bg-[var(--color-bg-hover)]">
                    <Icon name="radar" className="w-5 h-5" />
                </button>
                <button onClick={onArchitectureReview} title="Run Architecture Review" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] p-1 rounded-md hover:bg-[var(--color-bg-hover)]">
                    <Icon name="sitemap" className="w-5 h-5" />
                </button>
                <button onClick={onGenerateProjectMap} title="Generate Project Map" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] p-1 rounded-md hover:bg-[var(--color-bg-hover)]">
                    <Icon name="brain" className="w-5 h-5" />
                </button>
            </div>
          )}
      </div>
      {rootNode ? (
          <FileNode node={rootNode} activeFile={activeFile} onFileSelect={onFileSelect} />
      ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <Icon name="folder-open" className="w-12 h-12 text-[var(--color-text-quaternary)] mb-4" />
              <p className="text-[var(--color-text-tertiary)] mb-4">No folder opened.</p>
              <button 
                  onClick={onOpenFolder}
                  className="w-full bg-[var(--color-accent)] text-[var(--color-accent-text)] px-4 py-2 rounded-md hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:ring-offset-2 focus:ring-offset-[var(--color-ring-offset)]"
              >
                  Open Folder
              </button>
          </div>
      )}
    </>
  );
};

export default FileExplorer;