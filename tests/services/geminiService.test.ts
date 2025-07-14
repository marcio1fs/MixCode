import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as geminiService from '../../services/geminiService';
import { ChatMessage } from '../../types';

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

describe('Gemini Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getChatCompletion', () => {
    it('should return AI response for chat completion', async () => {
      const history: ChatMessage[] = [
        { id: '1', role: 'user', text: 'Hello' },
        { id: '2', role: 'assistant', text: 'Hi there!' }
      ];
      const newMessage = 'How are you?';

      const result = await geminiService.getChatCompletion(history, newMessage);

      expect(result).toBe('Mocked AI response');
    });
  });

  describe('sendOneTimeMessage', () => {
    it('should return AI response for one-time message', async () => {
      const prompt = 'Explain TypeScript';

      const result = await geminiService.sendOneTimeMessage(prompt);

      expect(result).toBe('Mocked AI response');
    });
  });

  describe('forgeModule', () => {
    it('should return module files and integration suggestion', async () => {
      const description = 'Create a React component';
      const projectContext = 'src/components/';

      const result = await geminiService.forgeModule(description, projectContext);

      expect(result).toHaveProperty('files');
      expect(result).toHaveProperty('integrationSuggestion');
      expect(Array.isArray(result.files)).toBe(true);
      expect(typeof result.integrationSuggestion).toBe('string');
    });
  });
}); 