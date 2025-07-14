import React from 'react';
import Icon from './Icon';

interface MixFlowViewProps {
  selectedFlow: string;
  onFlowChange: (flow: string) => void;
  onRunFlow: () => void;
  output: string;
  isFlowRunning: boolean;
}

const MixFlowView: React.FC<MixFlowViewProps> = ({ selectedFlow, onFlowChange, onRunFlow, output, isFlowRunning }) => {
  return (
    <div>
      <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider px-2 pb-2">MixFlows</h2>
      <div className="p-2 space-y-4">
        <div>
          <label htmlFor="flow-select" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
            Select Flow
          </label>
          <select
            id="flow-select"
            value={selectedFlow}
            onChange={(e) => onFlowChange(e.target.value)}
            disabled={isFlowRunning}
            className="w-full bg-[var(--color-bg-tertiary)] border-[var(--color-border-secondary)] rounded-md px-3 py-2 text-[var(--color-text-primary)] focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
          >
            <option value="refactor-deploy">Refactor & Deploy</option>
            <option value="code-doc">Code & Documentation</option>
          </select>
        </div>
        <button
          onClick={onRunFlow}
          disabled={isFlowRunning}
          className="w-full flex items-center justify-center space-x-2 bg-[var(--color-accent)] text-[var(--color-accent-text)] px-4 py-2 rounded-md hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-ring-offset)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name="play" className="w-5 h-5" />
          <span>{isFlowRunning ? 'Running...' : 'Execute MixFlow'}</span>
        </button>
        <div>
          <h4 className="text-xs font-semibold uppercase text-[var(--color-text-quaternary)] tracking-wider">Output</h4>
          <pre className="mt-1 bg-[var(--color-bg-primary)]/80 p-3 rounded-md text-xs font-mono text-[var(--color-text-secondary)] h-96 overflow-y-auto whitespace-pre-wrap">
            {output || 'Flow output will appear here.'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default MixFlowView;