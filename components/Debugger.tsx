import React, { useState, useEffect } from 'react';
import { debuggerService, DebugSession, Breakpoint, Variable, CallStackFrame } from '../services/debuggerService';
import { FileSystemNode } from '../types';
import Icon from './Icon';

interface DebuggerProps {
  file: FileSystemNode | null;
}

const Debugger: React.FC<DebuggerProps> = ({ file }) => {
  const [currentSession, setCurrentSession] = useState<DebugSession | null>(null);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [callStack, setCallStack] = useState<CallStackFrame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expression, setExpression] = useState('');
  const [evaluationResult, setEvaluationResult] = useState<string>('');

  useEffect(() => {
    if (currentSession) {
      loadDebugData();
    }
  }, [currentSession]);

  const loadDebugData = async () => {
    if (!currentSession) return;

    try {
      const [vars, stack] = await Promise.all([
        debuggerService.getVariables(currentSession.id),
        debuggerService.getCallStack(currentSession.id),
      ]);
      setVariables(vars);
      setCallStack(stack);
    } catch (error) {
      console.error('Error loading debug data:', error);
    }
  };

  const handleStartDebug = async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      const config = await debuggerService.createDefaultConfig(file);
      const sessionId = await debuggerService.createSession(config);
      const session = debuggerService.getCurrentSession();
      setCurrentSession(session);
    } catch (error) {
      console.error('Error starting debug session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopDebug = async () => {
    if (!currentSession) return;

    try {
      await debuggerService.stop(currentSession.id);
      setCurrentSession(null);
      setVariables([]);
      setCallStack([]);
    } catch (error) {
      console.error('Error stopping debug session:', error);
    }
  };

  const handleContinue = async () => {
    if (!currentSession) return;

    try {
      await debuggerService.continue(currentSession.id);
      await loadDebugData();
    } catch (error) {
      console.error('Error continuing debug session:', error);
    }
  };

  const handleStepOver = async () => {
    if (!currentSession) return;

    try {
      await debuggerService.stepOver(currentSession.id);
      await loadDebugData();
    } catch (error) {
      console.error('Error stepping over:', error);
    }
  };

  const handleStepInto = async () => {
    if (!currentSession) return;

    try {
      await debuggerService.stepInto(currentSession.id);
      await loadDebugData();
    } catch (error) {
      console.error('Error stepping into:', error);
    }
  };

  const handleStepOut = async () => {
    if (!currentSession) return;

    try {
      await debuggerService.stepOut(currentSession.id);
      await loadDebugData();
    } catch (error) {
      console.error('Error stepping out:', error);
    }
  };

  const handlePause = async () => {
    if (!currentSession) return;

    try {
      await debuggerService.pause(currentSession.id);
      await loadDebugData();
    } catch (error) {
      console.error('Error pausing debug session:', error);
    }
  };

  const handleEvaluateExpression = async () => {
    if (!currentSession || !expression.trim()) return;

    try {
      const result = await debuggerService.evaluateExpression(currentSession.id, expression);
      setEvaluationResult(result);
    } catch (error) {
      setEvaluationResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const renderVariable = (variable: Variable, depth: number = 0) => (
    <div key={variable.name} style={{ marginLeft: depth * 16 }}>
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-[var(--color-text-secondary)]">{variable.name}:</span>
        <span className="text-[var(--color-text-primary)]">{variable.value}</span>
        <span className="text-[var(--color-text-tertiary)] text-xs">({variable.type})</span>
      </div>
      {variable.children && variable.children.length > 0 && (
        <div className="ml-4">
          {variable.children.map(child => renderVariable(child, depth + 1))}
        </div>
      )}
    </div>
  );

  if (!file) {
    return (
      <div className="p-4 text-center text-sm text-[var(--color-text-tertiary)]">
        <Icon name="bug" className="w-8 h-8 mx-auto mb-2" />
        <p>Select a file to start debugging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Debug Controls */}
      <div className="p-4 border-b border-[var(--color-border-primary)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Debugger</h3>
          {currentSession && (
            <span className={`text-xs px-2 py-1 rounded ${
              currentSession.status === 'running' ? 'bg-[var(--color-success)] text-white' :
              currentSession.status === 'paused' ? 'bg-[var(--color-warning)] text-white' :
              'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]'
            }`}>
              {currentSession.status}
            </span>
          )}
        </div>

        {!currentSession ? (
          <button
            onClick={handleStartDebug}
            disabled={isLoading}
            className="w-full bg-[var(--color-success)] hover:bg-[var(--color-success-hover)] text-white text-sm py-2 px-3 rounded disabled:opacity-50"
          >
            {isLoading ? 'Starting...' : 'Start Debug'}
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleContinue}
              disabled={currentSession.status !== 'paused'}
              className="flex-1 bg-[var(--color-success)] hover:bg-[var(--color-success-hover)] text-white text-xs py-1 px-2 rounded disabled:opacity-50"
              title="Continue (F5)"
            >
              <Icon name="play" className="w-3 h-3" />
            </button>
            <button
              onClick={handlePause}
              disabled={currentSession.status !== 'running'}
              className="flex-1 bg-[var(--color-warning)] hover:bg-[var(--color-warning-hover)] text-white text-xs py-1 px-2 rounded disabled:opacity-50"
              title="Pause"
            >
              <Icon name="pause" className="w-3 h-3" />
            </button>
            <button
              onClick={handleStepOver}
              disabled={currentSession.status !== 'paused'}
              className="flex-1 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] text-xs py-1 px-2 rounded disabled:opacity-50"
              title="Step Over (F10)"
            >
              <Icon name="arrow-right" className="w-3 h-3" />
            </button>
            <button
              onClick={handleStepInto}
              disabled={currentSession.status !== 'paused'}
              className="flex-1 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] text-xs py-1 px-2 rounded disabled:opacity-50"
              title="Step Into (F11)"
            >
              <Icon name="arrow-down" className="w-3 h-3" />
            </button>
            <button
              onClick={handleStepOut}
              disabled={currentSession.status !== 'paused'}
              className="flex-1 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] text-xs py-1 px-2 rounded disabled:opacity-50"
              title="Step Out (Shift+F11)"
            >
              <Icon name="arrow-up" className="w-3 h-3" />
            </button>
            <button
              onClick={handleStopDebug}
              className="flex-1 bg-[var(--color-error)] hover:bg-[var(--color-error-hover)] text-white text-xs py-1 px-2 rounded"
              title="Stop (Shift+F5)"
            >
              <Icon name="square" className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {currentSession && (
        <div className="flex-1 overflow-auto">
          {/* Variables */}
          <div className="p-4 border-b border-[var(--color-border-primary)]">
            <h4 className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">
              Variables
            </h4>
            <div className="space-y-1">
              {variables.map(variable => renderVariable(variable))}
            </div>
          </div>

          {/* Call Stack */}
          <div className="p-4 border-b border-[var(--color-border-primary)]">
            <h4 className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">
              Call Stack
            </h4>
            <div className="space-y-1">
              {callStack.map((frame, index) => (
                <div key={index} className="text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-[var(--color-text-primary)]">{frame.name}</span>
                    <span className="text-[var(--color-text-tertiary)]">
                      {frame.file}:{frame.line}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expression Evaluator */}
          <div className="p-4">
            <h4 className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">
              Evaluate Expression
            </h4>
            <div className="space-y-2">
              <input
                type="text"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="Enter expression to evaluate..."
                className="w-full px-2 py-1 text-xs bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded text-[var(--color-text-primary)]"
              />
              <button
                onClick={handleEvaluateExpression}
                disabled={!expression.trim()}
                className="w-full bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] text-xs py-1 px-2 rounded disabled:opacity-50"
              >
                Evaluate
              </button>
              {evaluationResult && (
                <div className="text-xs p-2 bg-[var(--color-bg-secondary)] rounded">
                  <span className="text-[var(--color-text-tertiary)]">Result: </span>
                  <span className="text-[var(--color-text-primary)]">{evaluationResult}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Debugger; 