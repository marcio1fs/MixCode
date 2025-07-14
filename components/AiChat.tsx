

import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { ChatMessage } from '../types';
import Icon from './Icon';

interface AiChatProps {
    messages: ChatMessage[];
    isLoading: boolean;
    onSendMessage: (text: string) => void;
    initialPrompt: string | null;
    onPromptHandled: () => void;
}

const AiChat: React.FC<AiChatProps> = ({ messages, isLoading, onSendMessage, initialPrompt, onPromptHandled }) => {
  const [input, setInput] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    if (initialPrompt) {
        onSendMessage(initialPrompt);
        onPromptHandled();
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="w-full h-full bg-[var(--color-bg-secondary)] flex flex-col">
      <div className="p-4 border-b border-[var(--color-border-primary)]">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">AI Assistant</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-sm ${msg.role === 'user' ? 'bg-[var(--color-accent)] text-[var(--color-accent-text)]' : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]'}`}>
              <div className="prose prose-sm max-w-full text-[var(--color-text-primary)] prose-headings:text-[var(--color-text-primary)] prose-p:text-[var(--color-text-primary)] prose-strong:text-[var(--color-text-primary)] prose-a:text-[var(--color-accent-subtle)]">
                  <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{msg.text}</ReactMarkdown>
              </div>
              {msg.isStreaming && <div className="w-2 h-2 bg-white rounded-full animate-pulse inline-block ml-2"></div>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-[var(--color-border-primary)]">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI anything..."
            disabled={isLoading}
            className="flex-1 bg-[var(--color-bg-tertiary)] border-[var(--color-border-secondary)] rounded-md px-4 py-2 text-[var(--color-text-primary)] focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
          />
          <button type="submit" disabled={isLoading || !input.trim()} className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:bg-[var(--color-bg-quaternary)] disabled:cursor-not-allowed text-[var(--color-accent-text)] p-2 rounded-md">
            <Icon name="send" className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiChat;