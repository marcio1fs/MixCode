import { Plugin, FileContext, PluginSuggestion } from '../types';

const smartLinterPlugin: Plugin = {
    name: 'Smart Linter',
    description: 'Provides AI-powered suggestions and fixes for common code issues.',
    hooks: {
        async onCodeChange(context: FileContext): Promise<PluginSuggestion[]> {
            const { content, language } = context;
            const suggestions: PluginSuggestion[] = [];

            if (language !== 'typescript' && language !== 'javascript') {
                return [];
            }

            const lines = content.split('\n');

            // Rule: Detect 'var'
            const varPattern = /\bvar\b/g;
            lines.forEach((line, lineIndex) => {
                let match;
                varPattern.lastIndex = 0; // Reset lastIndex for global regexes
                while ((match = varPattern.exec(line)) !== null) {
                    suggestions.push({
                        message: "'var' is deprecated. Use 'let' or 'const' instead.",
                        startLineNumber: lineIndex + 1,
                        endLineNumber: lineIndex + 1,
                        startColumn: match.index + 1,
                        endColumn: match.index + match[0].length + 1,
                        action: {
                            title: '✨ Fix with MixCode AI',
                            getAIPrompt: ({ codeSnippet, language }) => {
                                return `The linter found an issue: "'var' is deprecated". Please fix the following code snippet by replacing 'var' with 'let' or 'const' appropriately:\n\`\`\`${language}\n${codeSnippet}\n\`\`\``;
                            }
                        }
                    });
                }
            });
            
            // Rule: Detect 'eval('
            const evalPattern = /eval\s*\(/g;
            lines.forEach((line, lineIndex) => {
                let match;
                evalPattern.lastIndex = 0; // Reset lastIndex for global regexes
                while ((match = evalPattern.exec(line)) !== null) {
                    suggestions.push({
                        message: "Use of 'eval()' is discouraged due to security risks.",
                        startLineNumber: lineIndex + 1,
                        endLineNumber: lineIndex + 1,
                        startColumn: match.index + 1,
                        endColumn: match.index + match[0].length + 1,
                        action: {
                            title: '✨ Explain risk with AI',
                            getAIPrompt: ({ codeSnippet, language }) => {
                                return `The linter found a potential security risk: "Use of 'eval()' is discouraged". Please explain the security risks of using 'eval()' in the context of the following code snippet:\n\`\`\`${language}\n${codeSnippet}\n\`\`\``;
                            }
                        }
                    });
                }
            });

            return suggestions;
        }
    }
};

export default smartLinterPlugin;
