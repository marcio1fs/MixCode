
import { FileSystemNode } from '../types';
import { updateNodeInTree } from './fileSystem';
import { encrypt } from '../services/cryptoService';

const createMixSyncFolder = async (projectName: string): Promise<FileSystemNode> => ({
  name: '.mixsync',
  type: 'folder',
  path: `${projectName}/.mixsync`,
  children: [
    {
      name: 'history.json',
      type: 'file',
      language: 'json',
      path: `${projectName}/.mixsync/history.json`,
      content: await encrypt('[]'),
    },
    {
      name: 'plugins.json',
      type: 'file',
      language: 'json',
      path: `${projectName}/.mixsync/plugins.json`,
      content: await encrypt(JSON.stringify({
        "Smart Linter": { "enabled": true },
        "Code Diagrammer": { "enabled": true }
      }, null, 2)),
    },
    {
        name: 'session.meta',
        type: 'file',
        language: 'json',
        path: `${projectName}/.mixsync/session.meta`,
        content: await encrypt(JSON.stringify({}, null, 2)),
    },
    {
        name: 'ast-map.json',
        type: 'file',
        language: 'json',
        path: `${projectName}/.mixsync/ast-map.json`,
        content: await encrypt('{}'),
    }
  ],
});


const createTypeScriptProject = async (projectName: string): Promise<FileSystemNode> => {
  return {
    name: projectName,
    type: 'folder',
    path: projectName,
    children: [
      await createMixSyncFolder(projectName),
      {
        name: 'src',
        type: 'folder',
        path: `${projectName}/src`,
        children: [
          {
            name: 'index.ts',
            type: 'file',
            path: `${projectName}/src/index.ts`,
            language: 'typescript',
            content: `console.log("Hello, ${projectName}!");\n`,
          },
        ],
      },
      {
        name: 'package.json',
        type: 'file',
        path: `${projectName}/package.json`,
        language: 'json',
        content: JSON.stringify(
          {
            name: projectName,
            version: '0.1.0',
            main: 'src/index.ts',
            scripts: {
              start: 'ts-node src/index.ts',
            },
          },
          null,
          2
        ),
      },
      {
        name: 'README.md',
        type: 'file',
        path: `${projectName}/README.md`,
        language: 'markdown',
        content: `# ${projectName}\n\nWelcome to your new TypeScript project.`,
      },
    ],
  };
};

const createPythonProject = async (projectName: string): Promise<FileSystemNode> => {
  return {
    name: projectName,
    type: 'folder',
    path: projectName,
    children: [
      await createMixSyncFolder(projectName),
      {
        name: 'main.py',
        type: 'file',
        path: `${projectName}/main.py`,
        language: 'python',
        content: `def main():\n    print("Hello, ${projectName}!")\n\nif __name__ == "__main__":\n    main()\n`,
      },
      {
        name: 'requirements.txt',
        type: 'file',
        path: `${projectName}/requirements.txt`,
        content: '# Add your dependencies here\n',
      },
      {
        name: 'README.md',
        type: 'file',
        path: `${projectName}/README.md`,
        language: 'markdown',
        content: `# ${projectName}\n\nWelcome to your new Python project.`,
      },
    ],
  };
};

export const createProject = async (
  projectName: string,
  language: 'typescript' | 'python'
): Promise<FileSystemNode> => {
  let project: FileSystemNode;
  switch (language) {
    case 'typescript':
      project = await createTypeScriptProject(projectName);
      break;
    case 'python':
      project = await createPythonProject(projectName);
      break;
    default:
      // Fallback to a generic project
      project = {
        name: projectName,
        type: 'folder',
        path: projectName,
        children: [
          await createMixSyncFolder(projectName),
          {
            name: 'README.md',
            type: 'file',
            path: `${projectName}/README.md`,
            content: `# ${projectName}`,
          },
        ],
      };
      break;
  }

  // Set the default active file in session.meta
  const defaultFile = language === 'python' ? `${projectName}/main.py` : `${projectName}/src/index.ts`;
  const sessionMetaPath = `${projectName}/.mixsync/session.meta`;
  const encryptedSessionContent = await encrypt(JSON.stringify({ activeFile: defaultFile }, null, 2));

  return updateNodeInTree(project, sessionMetaPath, { content: encryptedSessionContent });
};
