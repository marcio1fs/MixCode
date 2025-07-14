import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock do Monaco Editor
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange }: any) => {
    return React.createElement('textarea', {
      'data-testid': 'monaco-editor',
      value: value,
      onChange: (e: any) => onChange?.(e.target.value)
    });
  }
}));

// Mock do Google GenAI
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: vi.fn().mockResolvedValue({
        text: 'Mocked AI response'
      })
    }
  }))
}));

// Mock do crypto service
vi.mock('../services/cryptoService', () => ({
  encrypt: vi.fn().mockResolvedValue('encrypted-content'),
  decrypt: vi.fn().mockResolvedValue('decrypted-content'),
  isMixSyncPath: vi.fn().mockReturnValue(false)
}));

// Mock do plugin service
vi.mock('../services/pluginService', () => ({
  pluginService: {
    runOnCodeChangeHooks: vi.fn().mockResolvedValue([]),
    runOnOpenFileHooks: vi.fn().mockResolvedValue(null)
  }
}));

// Configurar variáveis de ambiente para testes
(globalThis as any).process = { env: { API_KEY: 'test-api-key' } }; 