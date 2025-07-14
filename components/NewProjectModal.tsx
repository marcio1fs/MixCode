
import React, { useState, useEffect, useRef } from 'react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, language: 'typescript' | 'python') => Promise<void>;
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [projectName, setProjectName] = useState('');
  const [language, setLanguage] = useState<'typescript' | 'python'>('typescript');
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the input when the modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
      setProjectName(''); // Reset field on open
      setIsCreating(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim() && !isCreating) {
      setIsCreating(true);
      await onCreate(projectName.trim(), language);
      // No need to set isCreating to false, as the modal will close.
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[var(--color-bg-secondary)] rounded-lg shadow-2xl border border-[var(--color-border-primary)]"
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Create New Project</h2>
            
            <div className="mb-4">
              <label htmlFor="projectName" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Project Name
              </label>
              <input
                ref={inputRef}
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="my-awesome-project"
                className="w-full bg-[var(--color-bg-tertiary)] border-[var(--color-border-secondary)] rounded-md px-4 py-2 text-[var(--color-text-primary)] focus:ring-[var(--color-ring)] focus:border-[var(--color-ring)]"
                required
                disabled={isCreating}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="language" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Language
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'typescript' | 'python')}
                className="w-full bg-[var(--color-bg-tertiary)] border-[var(--color-border-secondary)] rounded-md px-4 py-2 text-[var(--color-text-primary)] focus:ring-[var(--color-ring)] focus:border-[var(--color-ring)]"
                disabled={isCreating}
              >
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
              </select>
            </div>
          </div>

          <div className="bg-black/10 px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md font-semibold text-[var(--color-text-secondary)] bg-[var(--color-bg-quaternary)] hover:bg-[var(--color-bg-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-ring-offset)] focus:ring-[var(--color-text-quaternary)]"
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md font-semibold text-[var(--color-accent-text)] bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-ring-offset)] focus:ring-[var(--color-ring)] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!projectName.trim() || isCreating}
            >
              {isCreating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;