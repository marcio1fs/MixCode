

import React from 'react';

declare module 'react' {
  interface InputHTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

export type SidebarView = 'explorer' | 'plugins' | 'deploy' | 'flows';
export type ProfileId = 'analitico' | 'criativo' | 'agil';
export type Theme = 'dark' | 'light' | 'solarized';

export interface FileSystemNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  file?: File; // For file input API to store the File object
  language?: 'typescript' | 'json' | 'python' | 'markdown' | 'mermaid' | 'javascript' | 'yaml';
  content?: string;
  children?: FileSystemNode[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  isStreaming?: boolean;
}

export interface TerminalLine {
    id: number;
    text: React.ReactNode;
}

export interface MenuItem {
  label: string;
  action: () => void;
  shortcut?: string;
  disabled?: boolean;
  isDivider?: boolean;
}

export interface SessionMeta {
    activeFile: string;
}

export interface PluginsConfig {
    [pluginName: string]: {
        enabled: boolean;
    };
}

export interface TechDebtReport {
    heatmap: { [key: string]: number };
    coverage: 'Alta' | 'Média' | 'Baixa';
    risk_areas: string[];
    trend: number;
}

export interface User {
  id:string;
  name: string;
  avatarColor: string;
}

export interface SessionData {
  sessionId: string;
  users: User[];
}


// --- Plugin System Types ---

export interface FileContext {
    path: string;
    content: string;
    language?: 'typescript' | 'json' | 'python' | 'markdown' | 'mermaid' | 'javascript' | 'yaml';
}

// A suggestion from a plugin, which can be turned into a marker and code action
export interface PluginSuggestion {
    message: string;
    startLineNumber: number;
    endLineNumber: number;
    startColumn: number;
    endColumn: number;
    // Action to take, e.g., a quick fix
    action: {
        title: string;
        // The action will send a prompt to the AI. This function generates the prompt.
        getAIPrompt: (context: { codeSnippet: string, language?: string }) => string;
    }
}

export interface Plugin {
    name: string;
    description: string;
    // The core logic of the plugin, defined by its hooks
    hooks: {
        // This hook runs when the code is edited and should return suggestions.
        onCodeChange?: (context: FileContext) => Promise<PluginSuggestion[]>;
        // This hook runs when a file is opened and can return a prompt for the AI.
        onOpenFile?: (context: FileContext) => Promise<{ aiPrompt: string } | null>;
    };
}