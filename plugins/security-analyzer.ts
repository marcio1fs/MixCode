import { Plugin, PluginSuggestion, FileContext } from '../types';

export const securityAnalyzerPlugin: Plugin = {
  name: 'Security Analyzer',
  description: 'Detecta vulnerabilidades de segurança comuns no código',
  hooks: {
    onCodeChange: async (context: FileContext): Promise<PluginSuggestion[]> => {
      const suggestions: PluginSuggestion[] = [];
      
      if (!context.content) return suggestions;

      const lines = context.content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Detectar SQL Injection
        if (line.includes('query') && line.includes('${') && !line.includes('prepared')) {
          suggestions.push({
            message: 'Potential SQL injection vulnerability detected',
            startLineNumber: i + 1,
            endLineNumber: i + 1,
            startColumn: 1,
            endColumn: line.length + 1,
            action: {
              title: 'Fix SQL injection',
              getAIPrompt: ({ codeSnippet, language }) => 
                `Please fix this potential SQL injection vulnerability by using parameterized queries or prepared statements:\n\n${codeSnippet}\n\nProvide a secure version.`
            }
          });
        }
        
        // Detectar XSS
        if (line.includes('innerHTML') || line.includes('outerHTML')) {
          suggestions.push({
            message: 'Potential XSS vulnerability - avoid innerHTML/outerHTML with user input',
            startLineNumber: i + 1,
            endLineNumber: i + 1,
            startColumn: 1,
            endColumn: line.length + 1,
            action: {
              title: 'Fix XSS vulnerability',
              getAIPrompt: ({ codeSnippet, language }) => 
                `Please fix this potential XSS vulnerability by using textContent or proper sanitization:\n\n${codeSnippet}\n\nProvide a secure version.`
            }
          });
        }
        
        // Detectar hardcoded secrets
        if (line.includes('password') && line.includes('=') && !line.includes('process.env')) {
          suggestions.push({
            message: 'Hardcoded password detected - use environment variables',
            startLineNumber: i + 1,
            endLineNumber: i + 1,
            startColumn: 1,
            endColumn: line.length + 1,
            action: {
              title: 'Use environment variables',
              getAIPrompt: ({ codeSnippet, language }) => 
                `Please replace this hardcoded password with an environment variable:\n\n${codeSnippet}\n\nUse process.env or similar secure configuration.`
            }
          });
        }
        
        // Detectar eval() usage
        if (line.includes('eval(')) {
          suggestions.push({
            message: 'eval() usage detected - security risk',
            startLineNumber: i + 1,
            endLineNumber: i + 1,
            startColumn: 1,
            endColumn: line.length + 1,
            action: {
              title: 'Replace eval() with safer alternative',
              getAIPrompt: ({ codeSnippet, language }) => 
                `Please replace this eval() usage with a safer alternative:\n\n${codeSnippet}\n\nConsider using JSON.parse() or other safer parsing methods.`
            }
          });
        }
        
        // Detectar console.log com dados sensíveis
        if (line.includes('console.log') && (
          line.includes('password') || 
          line.includes('token') || 
          line.includes('secret') || 
          line.includes('key')
        )) {
          suggestions.push({
            message: 'Sensitive data being logged - remove or mask sensitive information',
            startLineNumber: i + 1,
            endLineNumber: i + 1,
            startColumn: 1,
            endColumn: line.length + 1,
            action: {
              title: 'Remove sensitive data from logs',
              getAIPrompt: ({ codeSnippet, language }) => 
                `Please remove or mask sensitive information from this console.log:\n\n${codeSnippet}\n\nUse [REDACTED] or similar masking.`
            }
          });
        }
        
        // Detectar CORS mal configurado
        if (line.includes('Access-Control-Allow-Origin') && line.includes('*')) {
          suggestions.push({
            message: 'Wildcard CORS policy detected - security risk',
            startLineNumber: i + 1,
            endLineNumber: i + 1,
            startColumn: 1,
            endColumn: line.length + 1,
            action: {
              title: 'Fix CORS policy',
              getAIPrompt: ({ codeSnippet, language }) => 
                `Please fix this wildcard CORS policy to be more restrictive:\n\n${codeSnippet}\n\nSpecify allowed origins explicitly.`
            }
          });
        }
      }
      
      return suggestions;
    },
    
    onOpenFile: async (context: FileContext) => {
      if (!context.content) return null;
      
      const securityIssues = [];
      
      if (context.content.includes('eval(')) {
        securityIssues.push('eval() usage detected');
      }
      
      if (context.content.includes('innerHTML') || context.content.includes('outerHTML')) {
        securityIssues.push('innerHTML/outerHTML usage detected');
      }
      
      if (context.content.includes('password') && context.content.includes('=') && !context.content.includes('process.env')) {
        securityIssues.push('Hardcoded credentials detected');
      }
      
      if (securityIssues.length > 0) {
        return {
          aiPrompt: `This file contains potential security vulnerabilities: ${securityIssues.join(', ')}. Please review the code and suggest security improvements to make it more secure.`
        };
      }
      
      return null;
    }
  }
}; 