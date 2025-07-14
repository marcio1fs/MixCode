import { Plugin, FileContext } from '../types';

const codeDiagrammerPlugin: Plugin = {
    name: 'Code Diagrammer',
    description: 'Generates a Mermaid diagram representing the code structure when a file is opened.',
    hooks: {
        async onOpenFile(context: FileContext) {
            // Only run for files with some content and for supported languages
            if (!context.content || (context.language !== 'typescript' && context.language !== 'python' && context.language !== 'javascript')) {
                return null;
            }

            // Don't run on very small files
            if (context.content.length < 50) {
                return null;
            }

            return {
                aiPrompt: `Please generate a Mermaid.js graph (using graph TD) that illustrates the high-level structure of the following code from the file "${context.path}". The diagram should show key functions, classes, and their relationships. Provide only the Mermaid code block.\n\n\`\`\`${context.language}\n${context.content}\n\`\`\``
            };
        }
    }
};

export default codeDiagrammerPlugin;
