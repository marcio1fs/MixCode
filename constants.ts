import { FileSystemNode } from './types';

export const MOCK_FILE_SYSTEM: FileSystemNode = {
  name: 'mixcode-project',
  type: 'folder',
  path: 'mixcode-project',
  children: [
    {
      name: '.mixsync',
      type: 'folder',
      path: 'mixcode-project/.mixsync',
      children: [
        {
          name: 'history.json',
          type: 'file',
          language: 'json',
          path: 'mixcode-project/.mixsync/history.json',
          content: '[]',
        },
        {
          name: 'plugins.json',
          type: 'file',
          language: 'json',
          path: 'mixcode-project/.mixsync/plugins.json',
          content: JSON.stringify({
            "Smart Linter": { "enabled": true },
            "Code Diagrammer": { "enabled": true }
          }, null, 2),
        },
        {
            name: 'session.meta',
            type: 'file',
            language: 'json',
            path: 'mixcode-project/.mixsync/session.meta',
            content: JSON.stringify({
                "activeFile": "mixcode-project/src/App.tsx"
            }, null, 2),
        },
        {
            name: 'ast-map.json',
            type: 'file',
            language: 'json',
            path: 'mixcode-project/.mixsync/ast-map.json',
            content: '{}',
        }
      ]
    },
    {
      name: 'src',
      type: 'folder',
      path: 'mixcode-project/src',
      children: [
        {
          name: 'components',
          type: 'folder',
          path: 'mixcode-project/src/components',
          children: [
            {
              name: 'Button.tsx',
              type: 'file',
              path: 'mixcode-project/src/components/Button.tsx',
              language: 'typescript',
              content: `import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800';
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-gray-200 focus:ring-gray-500',
  };

  return (
    <button className={[baseClasses, variantClasses[variant]].join(' ')} {...props}>
      {children}
    </button>
  );
};

export default Button;
`
            },
          ],
        },
        {
          name: 'services',
          type: 'folder',
          path: 'mixcode-project/src/services',
          children: [
            {
              name: 'api.ts',
              type: 'file',
              path: 'mixcode-project/src/services/api.ts',
              language: 'typescript',
              content: `// Mock API service
export async function fetchData(endpoint: string): Promise<any> {
  console.log(\`Fetching from \${endpoint}\`);
  // Simulate a network request
  await new Promise(res => setTimeout(res, 500));
  return { data: 'mocked data' };
}
`
            },
          ],
        },
        {
          name: 'App.tsx',
          type: 'file',
          path: 'mixcode-project/src/App.tsx',
          language: 'typescript',
          content: `import React, { useState } from 'react';
import Button from './components/Button';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to MixCode</h1>
      <div className="mt-4">
        <p>Counter: {count}</p>
        <Button onClick={() => setCount(c => c + 1)}>
          Increment
        </Button>
      </div>
    </div>
  );
}

export default App;
`
        },
      ],
    },
    {
      name: 'README.md',
      type: 'file',
      path: 'mixcode-project/README.md',
      language: 'markdown',
      content: `# MixCode Project

This is a sample project to demonstrate the MixCode AI-assisted IDE.

## Features
- File navigation
- Code editing
- AI-powered chat and code actions
`
    },
     {
      name: 'mixcode.yaml',
      type: 'file',
      path: 'mixcode-project/mixcode.yaml',
      language: 'yaml',
      content: `name: meu-projeto
type: python
entrypoint: main.py
deploy:
  method: docker
  port: 8080
  env:
    API_KEY: sk-xxx
  post_deploy:
    - "python migrate.py"
    - "curl http://localhost:8080/health"
`
    },
    {
      name: 'architecture.md',
      type: 'file',
      path: 'mixcode-project/architecture.md',
      language: 'markdown',
      content: `# Application Architecture

Here is a simple diagram of the application's data flow.

\`\`\`mermaid
graph TD
    A[User Action] --> B{React UI};
    B --> C[State Management];
    C --> B;
    B --> D[Gemini API];
    D --> E[AI Response];
    E --> B;
\`\`\`

This demonstrates the new Mermaid diagram rendering capability.
`
    },
    {
      name: 'package.json',
      type: 'file',
      path: 'mixcode-project/package.json',
      language: 'json',
      content: `{
  "name": "mixcode-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10",
    "@vitejs/plugin-react": "^3.1.0",
    "typescript": "^4.9.3",
    "vite": "^4.1.0"
  }
}
`
    },
  ],
};