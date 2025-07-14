import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Editor from '../../components/Editor';
import { FileSystemNode } from '../../types';

// Mock do Monaco Editor
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange }: any) => (
    <textarea
      data-testid="monaco-editor"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
  )
}));

const mockFile: FileSystemNode = {
  name: 'test.ts',
  type: 'file',
  path: 'src/test.ts',
  language: 'typescript',
  content: 'console.log("Hello World");'
};

const mockProps = {
  file: mockFile,
  onAskAI: vi.fn(),
  onFileContentChange: vi.fn(),
  onRunCode: vi.fn(),
  pluginConfig: null,
  theme: 'dark' as const
};

describe('Editor Component', () => {
  it('should render editor when file is provided', () => {
    render(<Editor {...mockProps} />);
    
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
    expect(screen.getByText('src/test.ts')).toBeInTheDocument();
  });

  it('should show placeholder when no file is selected', () => {
    render(<Editor {...mockProps} file={null} />);
    
    expect(screen.getByText('Select a file to begin')).toBeInTheDocument();
    expect(screen.getByText('or open the AI Chat to get started.')).toBeInTheDocument();
  });

  it('should show run button for supported languages', () => {
    render(<Editor {...mockProps} />);
    
    expect(screen.getByText('Run')).toBeInTheDocument();
  });

  it('should show explain button', () => {
    render(<Editor {...mockProps} />);
    
    expect(screen.getByText('Explain')).toBeInTheDocument();
  });

  it('should show refactor button', () => {
    render(<Editor {...mockProps} />);
    
    expect(screen.getByText('Refactor')).toBeInTheDocument();
  });

  it('should show generate tests button', () => {
    render(<Editor {...mockProps} />);
    
    expect(screen.getByText('Generate Tests')).toBeInTheDocument();
  });

  it('should call onAskAI when explain button is clicked', () => {
    render(<Editor {...mockProps} />);
    
    fireEvent.click(screen.getByText('Explain'));
    
    expect(mockProps.onAskAI).toHaveBeenCalledWith(
      expect.stringContaining('Please explain the following code')
    );
  });

  it('should call onRunCode when run button is clicked', () => {
    render(<Editor {...mockProps} />);
    
    fireEvent.click(screen.getByText('Run'));
    
    expect(mockProps.onRunCode).toHaveBeenCalledWith(
      'console.log("Hello World");',
      'typescript'
    );
  });
}); 