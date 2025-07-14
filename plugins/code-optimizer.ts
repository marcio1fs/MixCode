import { Plugin, PluginSuggestion, FileContext } from '../types';

export const codeOptimizerPlugin: Plugin = {
  name: 'Code Optimizer',
  description: 'Analisa e sugere otimizações de performance e legibilidade do código',
  hooks: {
    onCodeChange: async (context: FileContext): Promise<PluginSuggestion[]> => {
      const suggestions: PluginSuggestion[] = [];
      
      if (!context.content) return suggestions;

      const lines = context.content.split('\n');
      
      // Verificar loops ineficientes
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Detectar loops aninhados desnecessários
        if (line.includes('for') && line.includes('{')) {
          const nextLines = lines.slice(i + 1);
          const nestedLoopIndex = nextLines.findIndex(l => l.includes('for') && l.includes('{'));
          
          if (nestedLoopIndex !== -1) {
            suggestions.push({
              message: 'Consider using array methods like map/filter/reduce instead of nested loops',
              startLineNumber: i + 1,
              endLineNumber: i + 1,
              startColumn: 1,
              endColumn: line.length + 1,
              action: {
                title: 'Optimize nested loops',
                getAIPrompt: ({ codeSnippet, language }) => 
                  `Please optimize this nested loop code for better performance and readability. Consider using array methods like map, filter, or reduce:\n\n${codeSnippet}\n\nProvide the optimized version.`
              }
            });
          }
        }
        
        // Detectar variáveis não utilizadas
        if (line.includes('const ') || line.includes('let ') || line.includes('var ')) {
          const varName = line.match(/(?:const|let|var)\s+(\w+)/)?.[1];
          if (varName && !context.content.includes(varName, context.content.indexOf(line) + line.length)) {
            suggestions.push({
              message: `Unused variable '${varName}' detected`,
              startLineNumber: i + 1,
              endLineNumber: i + 1,
              startColumn: 1,
              endColumn: line.length + 1,
              action: {
                title: 'Remove unused variable',
                getAIPrompt: ({ codeSnippet, language }) => 
                  `Please remove the unused variable and clean up the code:\n\n${codeSnippet}`
              }
            });
          }
        }
        
        // Detectar funções muito longas
        if (line.includes('function ') || line.includes('=>')) {
          const functionStart = i;
          let braceCount = 0;
          let functionEnd = i;
          
          for (let j = i; j < lines.length; j++) {
            const currentLine = lines[j];
            braceCount += (currentLine.match(/{/g) || []).length;
            braceCount -= (currentLine.match(/}/g) || []).length;
            
            if (braceCount === 0 && j > i) {
              functionEnd = j;
              break;
            }
          }
          
          if (functionEnd - functionStart > 20) {
            suggestions.push({
              message: 'Function is too long. Consider breaking it into smaller functions',
              startLineNumber: functionStart + 1,
              endLineNumber: functionEnd + 1,
              startColumn: 1,
              endColumn: lines[functionEnd].length + 1,
              action: {
                title: 'Refactor long function',
                getAIPrompt: ({ codeSnippet, language }) => 
                  `Please refactor this long function into smaller, more focused functions:\n\n${codeSnippet}\n\nBreak it down into logical parts with clear responsibilities.`
              }
            });
          }
        }
      }
      
      return suggestions;
    },
    
    onOpenFile: async (context: FileContext) => {
      if (!context.content) return null;
      
      const lines = context.content.split('\n');
      const totalLines = lines.length;
      const complexity = lines.filter(line => 
        line.includes('if') || line.includes('for') || line.includes('while') || line.includes('switch')
      ).length;
      
      if (complexity > totalLines * 0.3) {
        return {
          aiPrompt: `This file has high cyclomatic complexity (${complexity} control flow statements in ${totalLines} lines). Please analyze the code and suggest ways to reduce complexity by simplifying conditional logic, extracting methods, or using design patterns.`
        };
      }
      
      return null;
    }
  }
}; 