

import React, { useState, useEffect, useRef } from 'react';
import MonacoEditor, { Monaco } from '@monaco-editor/react';
import type * as monaco from 'monaco-editor';
import { FileSystemNode, PluginSuggestion, PluginsConfig, Theme } from '../types';
import Icon from './Icon';
import MarkdownPreview from './MarkdownPreview';
import { pluginService } from '../services/pluginService';

interface EditorProps {
  file: FileSystemNode | null;
  onAskAI: (prompt: string) => void;
  onFileContentChange: (filePath: string, newContent: string) => void;
  onRunCode: (code: string, language: string) => void;
  pluginConfig: PluginsConfig | null;
  theme: Theme;
}

const Editor: React.FC<EditorProps> = ({ file, onAskAI, onFileContentChange, onRunCode, pluginConfig, theme }) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [suggestions, setSuggestions] = useState<PluginSuggestion[]>([]);
  const changeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsPreviewMode(false);
    
    const runOpenFileHook = async () => {
        if (!file?.content || !pluginConfig) return;
        const context = { path: file.path, content: file.content, language: file.language };
        const result = await pluginService.runOnOpenFileHooks(context, pluginConfig);
        if (result?.aiPrompt) {
            onAskAI(result.aiPrompt);
        }
    };
    runOpenFileHook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file?.path, pluginConfig]);

  const handleEditorMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    // --- Register a command for the AI quick fix ---
    const fixCommand = editor.addCommand(monaco.KeyCode.Unknown, (_ctx, getAIPrompt, codeSnippet) => {
      if (!file) return;
      const prompt = getAIPrompt({ codeSnippet, language: file.language });
      onAskAI(prompt);
    }, '');

    // --- Plugin Integration ---
    const setupPluginHooks = () => {
      const model = editor.getModel();
      if (!model || !file || !pluginConfig) return;

      const runHooks = async () => {
        const code = editor.getValue();
        const context = { path: file.path, content: code, language: file.language };
        const newSuggestions = await pluginService.runOnCodeChangeHooks(context, pluginConfig);
        setSuggestions(newSuggestions); // Store suggestions in state

        const markers = newSuggestions.map(s => ({
          message: s.message,
          severity: monaco.MarkerSeverity.Hint,
          startLineNumber: s.startLineNumber,
          startColumn: s.startColumn,
          endLineNumber: s.endLineNumber,
          endColumn: s.endColumn,
          source: 'plugin',
        }));
        monaco.editor.setModelMarkers(model, 'plugins', markers);
      };

      // Debounce the hook execution
      const disposable = editor.onDidChangeModelContent(() => {
        const timeoutId = (model as any).__pluginTimeout;
        clearTimeout(timeoutId);
        (model as any).__pluginTimeout = setTimeout(runHooks, 500);
      });
      
      runHooks(); // Initial run
      return disposable;
    };
    
    const pluginDisposable = setupPluginHooks();
    
    const actionProvider = monaco.languages.registerCodeActionProvider(['typescript', 'javascript'], {
      provideCodeActions: (model, _range, context) => {
        const actions = context.markers
          .filter(marker => marker.source === 'plugin')
          .map(marker => {
            const suggestion = suggestions.find(s => 
                s.message === marker.message && 
                s.startLineNumber === marker.startLineNumber && 
                s.startColumn === marker.startColumn
            );

            if (!suggestion) return null;

            const codeSnippet = model.getValueInRange(marker);
            return {
              title: suggestion.action.title,
              kind: 'quickfix',
              marker,
              command: {
                id: fixCommand!,
                title: suggestion.action.title,
                arguments: [suggestion.action.getAIPrompt, codeSnippet],
              }
            };
          }).filter(Boolean);

        return {
          actions: actions as monaco.languages.CodeAction[],
          dispose: () => {}
        };
      }
    });

    // --- Cleanup on unmount ---
    editor.onDidDispose(() => {
        pluginDisposable?.dispose();
        actionProvider.dispose();
    });
  };


  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="text-center">
          <Icon name="file" className="w-16 h-16 mx-auto text-[var(--color-text-quaternary)]" />
          <p className="mt-2 text-lg text-[var(--color-text-tertiary)]">Select a file to begin</p>
          <p className="text-sm text-[var(--color-text-quaternary)]">or open the AI Chat to get started.</p>
        </div>
      </div>
    );
  }

  const handleAction = (action: 'explain' | 'refactor' | 'test') => {
    let prompt = '';
    const codeBlock = `\`\`\`${file.language || ''}\n${file.content}\n\`\`\``;
    switch (action) {
      case 'explain':
        prompt = `Please explain the following code from the file "${file.path}":\n${codeBlock}`;
        break;
      case 'refactor':
        prompt = `Please refactor the following code from the file "${file.path}" for clarity and performance. Only provide the refactored code block.:\n${codeBlock}`;
        break;
      case 'test':
        prompt = `Please write unit tests for the following code from the file "${file.path}". Provide the tests in a single code block.:\n${codeBlock}`;
        break;
    }
    onAskAI(prompt);
  };
  
  const handleEditorChange = (value: string | undefined) => {
    if (changeTimeoutRef.current) {
        clearTimeout(changeTimeoutRef.current);
    }
    if (value !== undefined && file) {
      changeTimeoutRef.current = setTimeout(() => {
        onFileContentChange(file.path, value);
      }, 500); // Debounce for 500ms
    }
  };
  
  const supportedRunLanguages = ['python', 'javascript', 'typescript'];
  const canRun = file.language && supportedRunLanguages.includes(file.language);

  const buttonClasses = "flex items-center space-x-1 px-2 py-1 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-hover)] rounded text-sm text-[var(--color-text-secondary)] disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex-1 flex flex-col bg-[var(--color-bg-primary)] min-h-0">
      <div className="flex items-center justify-between bg-[var(--color-bg-secondary)] p-2 border-b border-[var(--color-border-primary)] flex-shrink-0">
        <span className="text-[var(--color-text-secondary)]">{file.path}</span>
        <div className="flex items-center space-x-2">
            {file.language === 'markdown' && (
              <button onClick={() => setIsPreviewMode(!isPreviewMode)} className={buttonClasses}>
                  <span>{isPreviewMode ? 'Edit' : 'Preview'}</span>
              </button>
            )}
            <button
              onClick={() => onRunCode(file.content || '', file.language || 'text')}
              disabled={!canRun || isPreviewMode}
              className="flex items-center space-x-2 px-3 py-1 bg-[var(--color-success)] hover:bg-[var(--color-success-hover)] rounded text-sm text-[var(--color-text-white)] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--color-bg-quaternary)]"
            >
              <Icon name="play" className="w-4 h-4"/>
              <span>Run</span>
            </button>
            <button onClick={() => handleAction('explain')} className={buttonClasses} disabled={!file.content || isPreviewMode}>
                <Icon name="sparkles" className="w-4 h-4"/>
                <span>Explain</span>
            </button>
            <button onClick={() => handleAction('refactor')} className={buttonClasses} disabled={!file.content || isPreviewMode}>
                <Icon name="sparkles" className="w-4 h-4"/>
                <span>Refactor</span>
            </button>
            <button onClick={() => handleAction('test')} className={buttonClasses} disabled={!file.content || isPreviewMode}>
                <Icon name="sparkles" className="w-4 h-4"/>
                <span>Generate Tests</span>
            </button>
        </div>
      </div>
      <div className="flex-1 w-full h-full">
        {isPreviewMode ? (
          <MarkdownPreview content={file.content || ''} theme={theme} />
        ) : (
          <MonacoEditor
              key={file.path}
              language={file.language}
              value={file.content || ''}
              theme={theme === 'light' ? 'vs' : 'vs-dark'}
              onChange={handleEditorChange}
              onMount={handleEditorMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
        )}
      </div>
    </div>
  );
};

export default Editor;