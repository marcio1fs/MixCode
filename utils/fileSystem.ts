import { FileSystemNode } from '../types';

export const flattenFileTree = (node: FileSystemNode): FileSystemNode[] => {
  const files: FileSystemNode[] = [];
  
  const traverse = (currentNode: FileSystemNode) => {
    if (currentNode.type === 'file') {
      files.push(currentNode);
    }
    if (currentNode.children) {
      currentNode.children.forEach(traverse);
    }
  };
  
  if (node) traverse(node);
  return files;
};

export const findNodeByPath = (root: FileSystemNode, path: string): FileSystemNode | null => {
    if (root.path === path) return root;
    if (root.type === 'folder' && root.children) {
        for (const child of root.children) {
            const found = findNodeByPath(child, path);
            if (found) return found;
        }
    }
    return null;
};

export const updateNodeInTree = (root: FileSystemNode, path: string, updates: Partial<FileSystemNode>): FileSystemNode => {
    const update = (node: FileSystemNode): FileSystemNode => {
      if (node.path === path) {
        return { ...node, ...updates };
      }
      if (node.type === 'folder' && node.children) {
        return { ...node, children: node.children.map(update) };
      }
      return node;
    };
    return update(root);
};

export const addNodeToTree = (root: FileSystemNode, parentPath: string, newNode: FileSystemNode): FileSystemNode => {
    const add = (node: FileSystemNode): FileSystemNode => {
      if (node.path === parentPath) {
        if (node.type === 'folder') {
            const children = [...(node.children || []), newNode];
            // Sort children alphabetically, folders first
            children.sort((a, b) => {
                if (a.type === 'folder' && b.type === 'file') return -1;
                if (a.type === 'file' && b.type === 'folder') return 1;
                return a.name.localeCompare(b.name);
            });
            return { ...node, children };
        }
      }
      if (node.type === 'folder' && node.children) {
        return { ...node, children: node.children.map(add) };
      }
      return node;
    };
    return add(root);
};


export const filesToNodeTree = async (files: FileList): Promise<FileSystemNode | null> => {
    if (files.length === 0) return null;

    // Use the first file's path to determine the root directory name.
    const rootPath = (files[0] as any).webkitRelativePath.split('/')[0];
    const root: FileSystemNode = {
        name: rootPath,
        type: 'folder',
        path: rootPath,
        children: [],
    };

    for (const file of Array.from(files)) {
        const pathParts = (file as any).webkitRelativePath.split('/');
        let currentNode = root;

        // Iterate through path parts to build folder structure
        for (let i = 1; i < pathParts.length; i++) {
            const part = pathParts[i];
            const currentPath = pathParts.slice(0, i + 1).join('/');
            
            // Check if it's the last part (the file itself)
            const isFile = i === pathParts.length - 1;

            let childNode = currentNode.children?.find(child => child.name === part);

            if (!childNode) {
                if (isFile) {
                    const fileExtension = part.split('.').pop()?.toLowerCase();
                    let language: FileSystemNode['language'] = undefined;
                    if (fileExtension === 'ts' || fileExtension === 'tsx') language = 'typescript';
                    if (fileExtension === 'js') language = 'javascript';
                    if (fileExtension === 'py') language = 'python';
                    if (fileExtension === 'json') language = 'json';
                    if (fileExtension === 'md') language = 'markdown';
                    if (fileExtension === 'yaml' || fileExtension === 'yml') language = 'yaml';
                    
                    childNode = {
                        name: part,
                        type: 'file',
                        path: (file as any).webkitRelativePath,
                        file: file, // Store the actual File object
                        language: language,
                    };
                    currentNode.children!.push(childNode);
                } else {
                    // It's a directory
                    childNode = {
                        name: part,
                        type: 'folder',
                        path: currentPath,
                        children: [],
                    };
                    currentNode.children!.push(childNode);
                }
            }
             // Move to the next level
            currentNode = childNode;
        }
    }
    
    // Recursive sort
    const sortNodes = (node: FileSystemNode) => {
        if (node.type === 'folder' && node.children) {
            // Sort to make .mixsync appear first if desired, or just alphabetically
            node.children.sort((a, b) => {
                if (a.name.startsWith('.') && !b.name.startsWith('.')) return -1;
                if (!a.name.startsWith('.') && b.name.startsWith('.')) return 1;
                if (a.type === 'folder' && b.type === 'file') return -1;
                if (a.type === 'file' && b.type === 'folder') return 1;
                return a.name.localeCompare(b.name);
            });
            node.children.forEach(sortNodes);
        }
    };

    sortNodes(root);

    return root;
};

const getLanguage = (name: string): FileSystemNode['language'] => {
    const fileExtension = name.split('.').pop()?.toLowerCase();
    if (fileExtension === 'ts' || fileExtension === 'tsx') return 'typescript';
    if (fileExtension === 'js' || fileExtension === 'jsx') return 'javascript';
    if (fileExtension === 'py') return 'python';
    if (fileExtension === 'json') return 'json';
    if (fileExtension === 'md') return 'markdown';
    if (fileExtension === 'yaml' || fileExtension === 'yml') return 'yaml';
    return undefined;
}

export const addFileAndParentsToTree = (root: FileSystemNode, relativeFilePath: string, content: string): FileSystemNode => {
    const pathParts = relativeFilePath.split('/').filter(p => p);
    const fileName = pathParts.pop();

    if (!fileName) {
        console.error('Invalid file path provided for creation:', relativeFilePath);
        return root;
    }

    let currentRoot = root;
    let parentPath = currentRoot.name;

    for (const folderName of pathParts) {
        const folderPath = `${parentPath}/${folderName}`;
        
        if (!findNodeByPath(currentRoot, folderPath)) {
            const newFolder: FileSystemNode = {
                name: folderName,
                type: 'folder',
                path: folderPath,
                children: [],
            };
            currentRoot = addNodeToTree(currentRoot, parentPath, newFolder);
        }
        parentPath = folderPath;
    }

    const newFilePath = `${parentPath}/${fileName}`;
    const newFile: FileSystemNode = {
        name: fileName,
        type: 'file',
        path: newFilePath,
        content,
        language: getLanguage(fileName),
    };

    if (findNodeByPath(currentRoot, newFile.path)) {
        return updateNodeInTree(currentRoot, newFile.path, { content });
    }
    
    return addNodeToTree(currentRoot, parentPath, newFile);
};
