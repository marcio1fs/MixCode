import { Plugin, PluginSuggestion, FileContext } from '../types';

export const accessibilityCheckerPlugin: Plugin = {
  name: 'Accessibility Checker',
  description: 'Verifica e sugere melhorias de acessibilidade no código',
  hooks: {
    onCodeChange: async (context: FileContext): Promise<PluginSuggestion[]> => {
      const suggestions: PluginSuggestion[] = [];
      
      if (!context.content) return suggestions;

      const lines = context.content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Verificar imagens sem alt
        if (line.includes('<img') && !line.includes('alt=')) {
          suggestions.push({
            message: 'Image missing alt attribute - accessibility issue',
            startLineNumber: i + 1,
            endLineNumber: i + 1,
            startColumn: 1,
            endColumn: line.length + 1,
            action: {
              title: 'Add alt attribute to image',
              getAIPrompt: ({ codeSnippet, language }) => 
                `Please add an appropriate alt attribute to this image for accessibility:\n\n${codeSnippet}\n\nProvide a descriptive alt text.`
            }
          });
        }
        
        // Verificar botões sem texto acessível
        if (line.includes('<button') && !line.includes('aria-label') && !line.includes('>') && !line.includes('</button>')) {
          suggestions.push({
            message: 'Button missing accessible text or aria-label',
            startLineNumber: i + 1,
            endLineNumber: i + 1,
            startColumn: 1,
            endColumn: line.length + 1,
            action: {
              title: 'Add accessible text to button',
              getAIPrompt: ({ codeSnippet, language }) => 
                `Please add accessible text or aria-label to this button:\n\n${codeSnippet}\n\nProvide either button text or aria-label.`
            }
          });
        }
        
        // Verificar inputs sem labels
        if (line.includes('<input') && !line.includes('aria-label') && !line.includes('id=')) {
          suggestions.push({
            message: 'Input missing label or aria-label - accessibility issue',
            startLineNumber: i + 1,
            endLineNumber: i + 1,
            startColumn: 1,
            endColumn: line.length + 1,
            action: {
              title: 'Add label to input',
              getAIPrompt: ({ codeSnippet, language }) => 
                `Please add a proper label or aria-label to this input for accessibility:\n\n${codeSnippet}\n\nProvide either a label element or aria-label attribute.`
            }
          });
        }
        
        // Verificar contraste de cores
        if (line.includes('color:') && line.includes('#') && !line.includes('/*')) {
          const colorMatch = line.match(/#[0-9a-fA-F]{6}/);
          if (colorMatch) {
            suggestions.push({
              message: 'Consider checking color contrast for accessibility',
              startLineNumber: i + 1,
              endLineNumber: i + 1,
              startColumn: 1,
              endColumn: line.length + 1,
              action: {
                title: 'Check color contrast',
                getAIPrompt: ({ codeSnippet, language }) => 
                  `Please check if this color provides sufficient contrast for accessibility:\n\n${codeSnippet}\n\nConsider using a color with better contrast ratio.`
              }
            });
          }
        }
        
        // Verificar elementos sem roles semânticos
        if (line.includes('<div') && line.includes('onClick') && !line.includes('role=')) {
          suggestions.push({
            message: 'Interactive div should have a semantic role',
            startLineNumber: i + 1,
            endLineNumber: i + 1,
            startColumn: 1,
            endColumn: line.length + 1,
            action: {
              title: 'Add semantic role to interactive div',
              getAIPrompt: ({ codeSnippet, language }) => 
                `Please add a semantic role to this interactive div for accessibility:\n\n${codeSnippet}\n\nConsider using role="button" or similar.`
            }
          });
        }
        
        // Verificar headings sem hierarquia
        if (line.includes('<h') && !line.includes('h1') && !line.includes('h2') && !line.includes('h3')) {
          suggestions.push({
            message: 'Consider using proper heading hierarchy (h1, h2, h3, etc.)',
            startLineNumber: i + 1,
            endLineNumber: i + 1,
            startColumn: 1,
            endColumn: line.length + 1,
            action: {
              title: 'Fix heading hierarchy',
              getAIPrompt: ({ codeSnippet, language }) => 
                `Please ensure proper heading hierarchy for accessibility:\n\n${codeSnippet}\n\nUse h1, h2, h3, etc. in logical order.`
            }
          });
        }
        
        // Verificar elementos sem foco visível
        if (line.includes('onClick') && !line.includes('tabIndex') && !line.includes('onKeyDown')) {
          suggestions.push({
            message: 'Interactive element should be keyboard accessible',
            startLineNumber: i + 1,
            endLineNumber: i + 1,
            startColumn: 1,
            endColumn: line.length + 1,
            action: {
              title: 'Add keyboard accessibility',
              getAIPrompt: ({ codeSnippet, language }) => 
                `Please make this interactive element keyboard accessible:\n\n${codeSnippet}\n\nAdd tabIndex and onKeyDown handlers.`
            }
          });
        }
      }
      
      return suggestions;
    },
    
    onOpenFile: async (context: FileContext) => {
      if (!context.content) return null;
      
      const accessibilityIssues = [];
      
      if (context.content.includes('<img') && !context.content.includes('alt=')) {
        accessibilityIssues.push('Images without alt attributes');
      }
      
      if (context.content.includes('<button') && !context.content.includes('aria-label')) {
        accessibilityIssues.push('Buttons without accessible text');
      }
      
      if (context.content.includes('<input') && !context.content.includes('aria-label') && !context.content.includes('id=')) {
        accessibilityIssues.push('Inputs without labels');
      }
      
      if (accessibilityIssues.length > 0) {
        return {
          aiPrompt: `This file contains accessibility issues: ${accessibilityIssues.join(', ')}. Please review and suggest improvements to make the code more accessible to users with disabilities.`
        };
      }
      
      return null;
    }
  }
}; 