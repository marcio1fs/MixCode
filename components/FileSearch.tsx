
import React, { useState, useEffect, useRef } from 'react';
import { FileSystemNode } from '../types';
import Icon from './Icon';

interface FileSearchProps {
  files: FileSystemNode[];
  onSelect: (file: FileSystemNode) => void;
  onClose: () => void;
}

const FileSearch: React.FC<FileSearchProps> = ({ files, onSelect, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FileSystemNode[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setResults(files.slice(0, 10)); // Show some initial files
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = files.filter(file => 
        file.path.toLowerCase().includes(lowerCaseQuery)
      );
      setResults(filtered);
    }
    setSelectedIndex(0);
  }, [query, files]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          onSelect(results[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [results, selectedIndex, onSelect, onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex justify-center items-start pt-24 z-50"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-[var(--color-bg-secondary)] rounded-lg shadow-2xl border border-[var(--color-border-primary)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-3 border-b border-[var(--color-border-primary)]">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search files by name..."
            className="w-full bg-transparent text-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none"
          />
        </div>
        <div className="max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <ul>
              {results.map((file, index) => (
                <li
                  key={file.path}
                  onMouseDown={() => onSelect(file)}
                  className={`flex items-center space-x-3 px-4 py-2 cursor-pointer ${
                    index === selectedIndex ? 'bg-[var(--color-accent)]' : 'hover:bg-[var(--color-bg-hover)]'
                  }`}
                >
                  <Icon name="file" className="w-5 h-5 text-[var(--color-text-tertiary)]" />
                  <span className={`${index === selectedIndex ? 'text-[var(--color-accent-text)]' : 'text-[var(--color-text-secondary)]'}`}>
                    {file.name}
                    <span className="ml-2 text-xs text-[var(--color-text-quaternary)]">{file.path.replace(file.name, '')}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-center text-[var(--color-text-tertiary)]">No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileSearch;