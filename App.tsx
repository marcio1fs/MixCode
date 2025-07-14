

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import RightPane from './components/RightPane';
import Header from './components/Header';
import Terminal from './components/Terminal';
import FileSearch from './components/FileSearch';
import NewProjectModal from './components/NewProjectModal';
import ActivityBar from './components/ActivityBar';
import LiveShareModal from './components/LiveShareModal';
import { FileSystemNode, TerminalLine, SessionMeta, PluginsConfig, ChatMessage, TechDebtReport, User, SessionData, SidebarView, ProfileId } from './types';
import { flattenFileTree, filesToNodeTree, findNodeByPath, updateNodeInTree, addNodeToTree, addFileAndParentsToTree } from './utils/fileSystem';
import { createProject } from './utils/projectTemplates';
import * as geminiService from './services/geminiService';
import { encrypt, decrypt, isMixSyncPath } from './services/cryptoService';
import './plugins'; // Initialize the plugin system
import { PROFILES } from './constants/profiles';

type RightPaneView = 'chat' | 'radar';

const MOCK_USERS: Omit<User, 'id'>[] = [
    { name: 'Alex', avatarColor: '#3b82f6' }, // blue
    { name: 'Maria', avatarColor: '#ec4899' }, // pink
    { name: 'Chen', avatarColor: '#22c55e' }, // green
    { name: 'Yuki', avatarColor: '#f97316' }, // orange
];

const currentUser: User = { id: 'user-1', name: 'You', avatarColor: '#8b5cf6' };

function App() {
  const [rootNode, setRootNode] = useState<FileSystemNode | null>(null);
  const [activeFile, setActiveFile] = useState<FileSystemNode | null>(null);
  const [taskForAi, setTaskForAi] = useState<string | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [activeSidebarView, setActiveSidebarView] = useState<SidebarView>('explorer');
  const [allFiles, setAllFiles] = useState<FileSystemNode[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rootNodeRef = useRef(rootNode);
  rootNodeRef.current = rootNode;


  // -- State for .mixsync features --
  const [chatMessages, setChatMessages] =useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [pluginConfig, setPluginConfig] = useState<PluginsConfig | null>(null);
  
  // --- Right Pane State ---
  const [rightPaneTab, setRightPaneTab] = useState<RightPaneView>('chat');
  const [techDebtReport, setTechDebtReport] = useState<TechDebtReport | null>(null);
  const [isRadarLoading, setIsRadarLoading] = useState(false);
  
  // --- Live Share State ---
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  // --- MixFlows State ---
  const [selectedFlow, setSelectedFlow] = useState('refactor-deploy');
  const [flowOutput, setFlowOutput] = useState('');
  const [isFlowRunning, setIsFlowRunning] = useState(false);

  // --- Profile State ---
  const [activeProfile, setActiveProfile] = useState<ProfileId>('analitico');


  useEffect(() => {
    // Set initial theme based on default profile
    document.body.dataset.theme = PROFILES[activeProfile].theme;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Secure File I/O Helpers ---
  const readFileContent = useCallback(async (path: string): Promise<string> => {
    const projectRoot = rootNodeRef.current;
    if (!projectRoot) return '';
    const node = findNodeByPath(projectRoot, path);
    if (!node?.content) return '';
    
    if (isMixSyncPath(path)) {
        return decrypt(node.content);
    }
    return node.content;
  }, []);

  const writeFileContent = useCallback(async (path: string, newContent: string) => {
    let contentToStore = newContent;
    if (isMixSyncPath(path)) {
        contentToStore = await encrypt(newContent);
    }
    setRootNode(prevRoot => {
        if (!prevRoot) return null;
        return updateNodeInTree(prevRoot, path, { content: contentToStore });
    });
  }, []);
  
  // --- Project and State Loading ---
  const loadProjectState = useCallback(async (projectRoot: FileSystemNode) => {
    // Load session
    const sessionPath = `${projectRoot.name}/.mixsync/session.meta`;
    const sessionContent = await readFileContent(sessionPath);
    if(sessionContent) {
        try {
            const meta: SessionMeta = JSON.parse(sessionContent);
            const fileToOpen = findNodeByPath(projectRoot, meta.activeFile);
            if (fileToOpen) {
                handleFileSelect(fileToOpen);
            }
        } catch(e) { console.error("Could not parse session.meta", e); }
    }

    // Load chat history
    const historyPath = `${projectRoot.name}/.mixsync/history.json`;
    const historyContent = await readFileContent(historyPath);
     if(historyContent) {
        try {
            const history: ChatMessage[] = JSON.parse(historyContent);
            setChatMessages(history);
        } catch(e) { console.error("Could not parse history.json", e); }
    }

    // Load plugin config
    const pluginPath = `${projectRoot.name}/.mixsync/plugins.json`;
    const pluginContent = await readFileContent(pluginPath);
    if(pluginContent) {
        try {
            const config: PluginsConfig = JSON.parse(pluginContent);
            setPluginConfig(config);
        } catch(e) { console.error("Could not parse plugins.json", e); }
    }
  }, [readFileContent]); // eslint-disable-line react-hooks/exhaustive-deps

  const setRootNodeAndLoadState = useCallback(async (newRoot: FileSystemNode | null) => {
      setRootNode(newRoot);
      // Wait for state to update before loading
      await new Promise(resolve => setTimeout(resolve, 0));
      if (newRoot) {
          loadProjectState(newRoot);
      } else {
          setAllFiles([]);
          setChatMessages([]);
          setPluginConfig(null);
          setActiveFile(null);
          setTechDebtReport(null);
      }
  }, [loadProjectState]);

  useEffect(() => {
    if (rootNode) {
      setAllFiles(flattenFileTree(rootNode));
    } else {
      setAllFiles([]);
    }
  }, [rootNode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        if (rootNode) { // Only allow search if a project is open
          setIsSearchOpen(prev => !prev);
        }
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rootNode]);

  const handleFileContentChange = useCallback(async (filePath: string, newContent: string) => {
    // Optimistically update the active file for smooth UI
    setActiveFile(prevActiveFile => {
      if (prevActiveFile && prevActiveFile.path === filePath) {
        return { ...prevActiveFile, content: newContent };
      }
      return prevActiveFile;
    });
    await writeFileContent(filePath, newContent);
  }, [writeFileContent]);

  const handleFileSelect = useCallback(async (file: FileSystemNode) => {
    if (file.type === 'folder') return;
    setIsSearchOpen(false);

    const selectFileAction = async (fileNode: FileSystemNode) => {
        let content = fileNode.content || '';
        // Decrypt content for viewing if it's a sync file
        if (isMixSyncPath(fileNode.path) && content) {
            content = await decrypt(content);
        }
        setActiveFile({ ...fileNode, content });

        // Update session.meta
        const projectRoot = rootNodeRef.current;
        if (projectRoot) {
            const sessionPath = `${projectRoot.name}/.mixsync/session.meta`;
            const newSessionContent = JSON.stringify({ activeFile: fileNode.path }, null, 2);
            await writeFileContent(sessionPath, newSessionContent);
        }
    };
    
    if (file.content === undefined && file.file) {
        const fileWithPath = { ...file, content: "Loading..." };
        setActiveFile(fileWithPath); 
      
        file.file.text()
            .then(async text => {
                const loadedFile = { ...file, content: text };
                // Persist the raw content first
                setRootNode(prevRoot => prevRoot ? updateNodeInTree(prevRoot, file.path, { content: text }) : null);
                // Then select it, which handles decryption for view if needed
                await selectFileAction(loadedFile);
            })
            .catch(err => {
                console.error("Error reading file:", err);
                const errorContent = `// Error reading file: ${err.message}`;
                const errorFile = { ...file, content: errorContent };
                setRootNode(prevRoot => prevRoot ? updateNodeInTree(prevRoot, file.path, { content: errorContent }) : null);
                setActiveFile(errorFile);
            });
    } else {
      await selectFileAction(file);
    }
  }, [writeFileContent]);


  const handleAskAI = useCallback((prompt: string) => {
    const fileList = allFiles.map(f => f.path).join('\n');
    const fullPrompt = `${prompt}\n\nFor context, here is the full list of files in the project:\n${fileList}`;
    setTaskForAi(fullPrompt);
    setRightPaneTab('chat');
  }, [allFiles]);
  
  const handlePromptHandled = useCallback(() => {
    setTaskForAi(null);
  }, []);

    const handleSendMessage = useCallback(async (text: string) => {
        setIsChatLoading(true);
        const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text };
        const assistantMessageId = (Date.now() + 1).toString();
        const assistantPlaceholder: ChatMessage = { id: assistantMessageId, role: 'assistant', text: '', isStreaming: true };

        const currentMessages = [...chatMessages, userMessage];
        setChatMessages([...currentMessages, assistantPlaceholder]);
        
        try {
            const fullResponse = await geminiService.getChatCompletion(currentMessages, text);

            const finalAssistantMessage: ChatMessage = { ...assistantPlaceholder, text: fullResponse, isStreaming: false };
            const finalMessages = [...currentMessages, finalAssistantMessage];
            setChatMessages(finalMessages);
            
            if (rootNodeRef.current) {
                const historyPath = `${rootNodeRef.current.name}/.mixsync/history.json`;
                await writeFileContent(historyPath, JSON.stringify(finalMessages, null, 2));
            }

        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: ChatMessage = { id: assistantMessageId, role: 'assistant', text: "Sorry, I encountered an error.", isStreaming: false };
            setChatMessages([...currentMessages, errorMessage]);
        } finally {
            setIsChatLoading(false);
        }
    }, [chatMessages, writeFileContent]);

  const handleToggleTerminal = useCallback(() => {
    setIsTerminalOpen(prev => !prev);
  }, []);
  
  const handleRunCode = useCallback((code: string, language: string) => {
    setIsTerminalOpen(true);

    const prompt = <span className="text-[var(--color-info-text)]">~/mixcode-project <span className="text-[var(--color-success-text)]">$</span></span>;

    const startLine: TerminalLine = {
      id: Date.now(),
      text: <>{prompt} <span className="text-[var(--color-text-primary)]">Running {language} code...</span></>
    };
    
    setTerminalLines([startLine]); // Clear and set start line
    
    // Simulate execution
    setTimeout(() => {
        const duration = (Math.random() * 0.5 + 0.1).toFixed(3);
        const isSuccess = Math.random() > 0.2; // 80% chance of success

        if (isSuccess) {
            const outputLine: TerminalLine = {
                id: Date.now() + 1,
                text: `Hello from your ${language} script!`
            };
            const endLine: TerminalLine = {
                id: Date.now() + 2,
                text: <span className="text-[var(--color-success-text)]">[Finished in {duration}s with exit code 0]</span>
            };
            setTerminalLines(prev => [...prev, outputLine, endLine]);
        } else {
            const errorLine: TerminalLine = {
                id: Date.now() + 1,
                text: <span className="text-[var(--color-danger-text)]">Error: A simulated runtime error occurred in '{language}' script.</span>
            };
             const endLine: TerminalLine = {
                id: Date.now() + 2,
                text: <span className="text-[var(--color-danger-text)]">[Finished in {duration}s with exit code 1]</span>
            };
            setTerminalLines(prev => [...prev, errorLine, endLine]);
        }
    }, 700);
  }, []);
  
  const handleDeploy = useCallback(() => {
    setIsTerminalOpen(true);
    const addLine = (text: React.ReactNode, delay: number) => {
        return new Promise(resolve => {
            setTimeout(() => {
                setTerminalLines(prev => [...prev, { id: Date.now() + Math.random(), text }]);
                resolve(null);
            }, delay);
        });
    };

    const run = async () => {
        setTerminalLines([]);
        await addLine(<span><span className="text-[var(--color-info-text)]">$</span> mixcode-cli deploy --target production</span>, 0);
        await addLine(<span><span className="text-[var(--color-text-quaternary)]">LOG</span>  Connecting to Docker daemon...</span>, 500);
        await addLine(<span><span className="text-[var(--color-text-quaternary)]">LOG</span>  Building Docker image for 'meu-projeto:latest'...</span>, 800);
        await addLine(<span><span className="text-[var(--color-success-text)]">SUCCESS</span> Docker image built successfully.</span>, 2000);
        await addLine(<span><span className="text-[var(--color-text-quaternary)]">LOG</span>  Pushing image to registry...</span>, 500);
        await addLine(<span><span className="text-[var(--color-success-text)]">SUCCESS</span> Image pushed.</span>, 3000);
        await addLine(<span><span className="text-[var(--color-text-quaternary)]">LOG</span>  Running post-deploy command: python migrate.py</span>, 500);
        await addLine(<span><span className="text-[var(--color-success-text)]">SUCCESS</span> Migrations complete.</span>, 1500);
        await addLine(<span><span className="text-[var(--color-text-quaternary)]">LOG</span>  Running post-deploy command: curl http://localhost:8080/health</span>, 500);
        await addLine(<span><span className="text-[var(--color-success-text)]">SUCCESS</span> Health check passed.</span>, 1000);
        await addLine(<span><span className="text-[var(--color-warning-text)]">DEPLOYMENT COMPLETE!</span> Project 'meu-projeto' is live.</span>, 200);
    };
    run();
  }, []);

  const handleOpenFileSearch = useCallback(() => {
    if (rootNode) setIsSearchOpen(true);
  }, [rootNode]);

  const handleOpenFolder = () => {
    fileInputRef.current?.click();
  };
  
  const handleFolderSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
        const projectNode = await filesToNodeTree(files);
        await setRootNodeAndLoadState(projectNode);
    }
    if (e.target) e.target.value = '';
  };


  const handleNewProject = useCallback(() => {
    setIsNewProjectModalOpen(true);
  }, []);
  
  const handleCreateProject = useCallback(async (name: string, language: 'typescript' | 'python') => {
      const newProject = await createProject(name, language);
      await setRootNodeAndLoadState(newProject);
      setIsNewProjectModalOpen(false);
  }, [setRootNodeAndLoadState]);

  const handleForgeModule = useCallback(async () => {
    const projectRoot = rootNodeRef.current;
    if (!projectRoot) return;
    
    const description = window.prompt("Descreva o módulo que você deseja criar (ex: 'um formulário de login com campos de email e senha'):");
    if (!description) return;

    setRightPaneTab('chat');
    const statusMessage: ChatMessage = { id: Date.now().toString(), role: 'assistant', text: `🧙‍♂️ Forjando módulo: "${description}"...`, isStreaming: true };
    const messagesWithPlaceholder = [...chatMessages, statusMessage];
    setChatMessages(messagesWithPlaceholder);

    const projectContext = allFiles
        .filter(f => !f.path.includes('.mixsync/'))
        .map(f => f.path.replace(`${projectRoot.name}/`, ''))
        .join('\n');

    try {
        const result = await geminiService.forgeModule(description, projectContext);

        if (!result.files || result.files.length === 0) {
             throw new Error("A IA não retornou nenhum arquivo para criar.");
        }

        let newRoot = projectRoot;
        for (const file of result.files) {
            newRoot = addFileAndParentsToTree(newRoot, file.path, file.content);
        }
        setRootNode(newRoot);
        
        const successText = `✅ Módulo forjado com sucesso! ${result.files.length} arquivos criados.\n\n**Sugestão de Integração:**\n${result.integrationSuggestion}`;
        const finalMessage: ChatMessage = { ...statusMessage, text: successText, isStreaming: false };
        const finalHistory = messagesWithPlaceholder.map(m => m.id === statusMessage.id ? finalMessage : m);
        
        setChatMessages(finalHistory);
        await writeFileContent(`${projectRoot.name}/.mixsync/history.json`, JSON.stringify(finalHistory, null, 2));

    } catch (error) {
        const err = error instanceof Error ? error.message : String(error);
        console.error("Error forging module:", err);
        const errorText = `❌ Erro ao forjar módulo: ${err}`;
        const errorMessage = { ...statusMessage, text: errorText, isStreaming: false };
        const finalHistory = messagesWithPlaceholder.map(m => m.id === statusMessage.id ? errorMessage : m);
        setChatMessages(finalHistory);
    }
  }, [allFiles, chatMessages, writeFileContent]);

  const handleGenerateProjectMap = useCallback(async () => {
    const projectRoot = rootNodeRef.current;
    if (!projectRoot) return;
    handleAskAI("Generating project map in `ast-map.json`...");

    const filesData = flattenFileTree(projectRoot)
        .filter(f => !f.path.includes('.mixsync/')) // Exclude meta files
        .map(f => `Path: ${f.path}\nContent:\n${f.content || ''}`)
        .join('\n\n---\n\n');

    const prompt = `Analyze the following project files and generate a JSON object that represents the application's structure. The JSON should map out components, services, and their primary relationships or dependencies. Provide only the JSON object.\n\n${filesData}`;
    
    const fullResponse = await geminiService.sendOneTimeMessage(prompt);

    const mapPath = `${projectRoot.name}/.mixsync/ast-map.json`;
    try {
        // Just to check if it's valid JSON, we don't need the parsed object here.
        JSON.parse(fullResponse);
        await writeFileContent(mapPath, fullResponse);

        const mapNode = findNodeByPath(rootNodeRef.current, mapPath);
        if(mapNode) {
            // Decrypt the content for viewing
            const decryptedContent = await decrypt(mapNode.content || '');
            setActiveFile({ ...mapNode, content: decryptedContent });
        }
    } catch(e) {
        console.error("Failed to parse project map from AI", e);
        const errorContent = `// AI failed to generate a valid JSON map.\n${fullResponse}`;
        await writeFileContent(mapPath, errorContent);
    }
  }, [handleAskAI, writeFileContent]);

  const handleArchitectureReview = useCallback(async () => {
    const projectRoot = rootNodeRef.current;
    if (!projectRoot) return;
    setRightPaneTab('chat');
    
    const statusMessage: ChatMessage = { id: Date.now().toString(), role: 'assistant', text: '🔍 Performing architecture review...', isStreaming: true };
    const messagesWithPlaceholder = [...chatMessages, statusMessage];
    setChatMessages(messagesWithPlaceholder);

    try {
        const astMapPath = `${projectRoot.name}/.mixsync/ast-map.json`;
        const pluginsPath = `${projectRoot.name}/.mixsync/plugins.json`;
        const historyPath = `${projectRoot.name}/.mixsync/history.json`;

        const [astMapContent, pluginsContent] = await Promise.all([
            readFileContent(astMapPath),
            readFileContent(pluginsPath),
        ]);

        const astMap = JSON.parse(astMapContent || '{}');
        const pluginsConfig: PluginsConfig = JSON.parse(pluginsContent || '{}');
        const history: ChatMessage[] = chatMessages;

        const pluginNames = Object.keys(pluginsConfig).filter(name => pluginsConfig[name].enabled);
        const recentHistory = history.slice(-5); // Get last 5 interactions
        const historySummary = recentHistory.map(msg => `${msg.role}: ${msg.text.substring(0, 200)}...`).join('\n');

        const prompt = `
You are a senior software architect. Please provide a high-level architecture review of this project based on the following data. Be concise and focus on actionable advice.

**Project AST Map (Structure):**
\`\`\`json
${JSON.stringify(astMap, null, 2)}
\`\`\`

**Enabled Plugins:**
- ${pluginNames.join('\n- ')}

**Recent Chat History (for context on user's goals):**
${historySummary}

**Review Request:**
Based on all the provided context, please suggest:
1.  **Relevant Design Patterns:** What patterns might be useful for the current structure?
2.  **High-Impact Refactorings:** What are the most critical areas to refactor for better maintainability or performance?
3.  **Key Risks:** Identify potential risks related to coupling, complexity, or scalability.

Provide the response in well-structured Markdown format.`;

        const fullResponse = await geminiService.sendOneTimeMessage(prompt);
        
        const finalMessage: ChatMessage = { ...statusMessage, text: fullResponse, isStreaming: false };
        const finalHistory = messagesWithPlaceholder.map(m => m.id === statusMessage.id ? finalMessage : m);
        
        setChatMessages(finalHistory);
        await writeFileContent(historyPath, JSON.stringify(finalHistory, null, 2));

    } catch (error) {
        const errorMessageText = `Sorry, I encountered an error during the architecture review: ${error instanceof Error ? error.message : String(error)}`;
        const errorMessage = { ...statusMessage, text: errorMessageText, isStreaming: false };
        const finalHistory = messagesWithPlaceholder.map(m => m.id === statusMessage.id ? errorMessage : m);
        setChatMessages(finalHistory);
    }
  }, [readFileContent, chatMessages, writeFileContent]);
  
  const handleGenerateTechDebtRadar = useCallback(async () => {
    const projectRoot = rootNodeRef.current;
    if (!projectRoot) return;

    setRightPaneTab('radar');
    setIsRadarLoading(true);
    setTechDebtReport(null);

    try {
        const astMapPath = `${projectRoot.name}/.mixsync/ast-map.json`;
        const historyPath = `${projectRoot.name}/.mixsync/history.json`;

        const [astMapContent, historyContent] = await Promise.all([
            readFileContent(astMapPath),
            readFileContent(historyPath),
        ]);

        const astMap = JSON.parse(astMapContent || '{}');
        const history: ChatMessage[] = JSON.parse(historyContent || '[]');

        // --- Generate Report ---
        
        // 1. Heatmap (mocked complexity)
        const functions = astMap.functions || ['App', 'Button', 'fetchData', 'handleSendMessage', 'handleDeploy'];
        const heatmap = functions.reduce((acc: { [key:string]: number }, func: string) => {
            acc[func] = Math.floor(Math.random() * 25) + 1; // Random complexity score
            return acc;
        }, {});

        // 2. Coverage
        const hasTests = functions.some((f: string) => f.toLowerCase().includes('test'));
        const coverage: TechDebtReport['coverage'] = hasTests ? 'Alta' : 'Média';

        // 3. Risk Areas
        const risk_areas = history
            .filter(msg => msg.role === 'user' && (msg.text.includes('eval(') || msg.text.includes('exec(')))
            .map(msg => msg.text);

        // 4. Trend
        const trend = history.length;
        
        setTechDebtReport({ heatmap, coverage, risk_areas, trend });

    } catch (error) {
        console.error("Error generating tech-debt report:", error);
        // Display an error on the radar panel itself later
    } finally {
        setIsRadarLoading(false);
    }

  }, [readFileContent]);

  // --- Live Share Handlers ---
  const handleToggleSessionModal = useCallback(() => {
    if (rootNode) { // Only allow sharing if a project is open
      setIsSessionModalOpen(prev => !prev);
    } else {
      alert("Please open a project before starting a Live Share session.");
    }
  }, [rootNode]);

  const handleStartSession = useCallback(() => {
    const sessionId = Math.random().toString(36).substring(2, 9);
    setSessionData({ sessionId, users: [currentUser] });
  }, []);

  const handleJoinSession = useCallback((sessionId: string) => {
    if (!sessionId.trim()) return;
    
    // Simulate joining a session with other users
    const mockOtherUsers = MOCK_USERS.slice(0, 2).map((u, i) => ({ ...u, id: `mock-${i}` }));
    
    setSessionData({
      sessionId: sessionId.trim(),
      users: [currentUser, ...mockOtherUsers],
    });
  }, []);

  const handleLeaveSession = useCallback(() => {
    setSessionData(null);
    setIsSessionModalOpen(false);
  }, []);

  // --- MixFlows Handler ---
  const handleRunFlow = useCallback(async () => {
    setIsFlowRunning(true);
    setFlowOutput('');
    const addLog = (log: string) => {
        setFlowOutput(prev => prev + `[${new Date().toLocaleTimeString()}] ${log}\n`);
    };

    const fileToProcess = activeFile;

    if (!fileToProcess || !fileToProcess.content) {
        addLog('Error: Please open a file with content to run a flow.');
        setIsFlowRunning(false);
        return;
    }

    addLog(`Starting flow: "${selectedFlow}" on file: ${fileToProcess.path}`);

    switch (selectedFlow) {
      case 'refactor-deploy': {
        try {
          addLog('Requesting code refactoring from AI...');
          const refactorPrompt = `Please refactor the following code from the file "${fileToProcess.path}" for clarity and performance. Only provide the refactored code block.:\n\`\`\`${fileToProcess.language || ''}\n${fileToProcess.content}\n\`\`\``;
          const refactoredCode = await geminiService.sendOneTimeMessage(refactorPrompt);
          
          const codeBlockRegex = /```(?:\w+)?\n([\s\S]+?)\n```/;
          const match = refactoredCode.match(codeBlockRegex);
          const extractedCode = match ? match[1] : refactoredCode.trim();

          addLog('Refactoring complete. Applying changes...');
          await handleFileContentChange(fileToProcess.path, extractedCode);
          addLog('Changes applied.');
          
          addLog('Starting deployment process...');
          addLog('Check the main terminal for deployment progress.');
          handleDeploy();
          
          addLog('Flow "Refactor & Deploy" finished.');

        } catch (error) {
          console.error(error);
          addLog(`Error during refactor-deploy flow: ${error instanceof Error ? error.message : String(error)}`);
        }
        break;
      }

      case 'code-doc': {
        try {
          addLog('Requesting documentation from AI...');
          const docPrompt = `Please write comprehensive documentation in Markdown format for the following code from the file "${fileToProcess.path}".\n\`\`\`${fileToProcess.language || ''}\n${fileToProcess.content}\n\`\`\``;
          const documentation = await geminiService.sendOneTimeMessage(docPrompt);
          addLog('Documentation generated.');

          const parentPath = fileToProcess.path.substring(0, fileToProcess.path.lastIndexOf('/'));
          const newFileName = `${fileToProcess.name}.md`;
          const newFilePath = `${parentPath}/${newFileName}`;

          addLog(`Creating documentation file at: ${newFilePath}`);
          
          const projectRoot = rootNodeRef.current;
          if (projectRoot) {
              const existingNode = findNodeByPath(projectRoot, newFilePath);
              if (existingNode) {
                  addLog('Overwriting existing documentation file...');
                  setRootNode(prevRoot => prevRoot ? updateNodeInTree(prevRoot, newFilePath, { content: documentation }) : null);
              } else {
                  const parentNode = findNodeByPath(projectRoot, parentPath);
                  if (parentNode) {
                      const newNode: FileSystemNode = {
                          name: newFileName,
                          path: newFilePath,
                          type: 'file',
                          language: 'markdown',
                          content: documentation,
                      };
                      setRootNode(prevRoot => prevRoot ? addNodeToTree(prevRoot, parentPath, newNode) : null);
                  } else {
                      throw new Error(`Could not find parent directory "${parentPath}"`);
                  }
              }
              addLog('Documentation file created successfully.');
              addLog('Flow "Code & Documentation" finished.');
          }
        } catch (error) {
          console.error(error);
          addLog(`Error during code-doc flow: ${error instanceof Error ? error.message : String(error)}`);
        }
        break;
      }
      default:
        addLog(`Error: Unknown flow "${selectedFlow}"`);
    }

    setIsFlowRunning(false);
  }, [activeFile, selectedFlow, handleFileContentChange, handleDeploy]);

  // --- Profile Handler ---
  const handleApplyProfile = useCallback(async (profileId: ProfileId) => {
    const projectRoot = rootNodeRef.current;
    if (!projectRoot) {
      alert("Please open a project to apply a profile.");
      return;
    }

    const profile = PROFILES[profileId];
    if (!profile) return;

    // 1. Set theme
    document.body.dataset.theme = profile.theme;
    if ((window as any).mermaid) {
        (window as any).mermaid.initialize({ startOnLoad: false, theme: profile.theme === 'light' ? 'default' : 'dark' });
    }

    // 2. Set plugins
    setPluginConfig(profile.plugins);
    const pluginPath = `${projectRoot.name}/.mixsync/plugins.json`;
    await writeFileContent(pluginPath, JSON.stringify(profile.plugins, null, 2));

    // 3. Set default views
    setActiveSidebarView(profile.defaultSidebarView);
    setRightPaneTab(profile.defaultRightPaneView);
    
    // 4. Update active profile state
    setActiveProfile(profileId);
    
  }, [writeFileContent, rootNodeRef]);

  const activeTheme = PROFILES[activeProfile].theme;


  return (
    <div className="flex flex-col h-screen w-full bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFolderSelection}
        style={{ display: 'none' }}
        webkitdirectory=""
        directory=""
      />
      {isSearchOpen && (
        <FileSearch 
          files={allFiles}
          onSelect={handleFileSelect}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
       <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreate={handleCreateProject}
      />
      <LiveShareModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        onStartSession={handleStartSession}
        onJoinSession={handleJoinSession}
        onLeaveSession={handleLeaveSession}
        sessionData={sessionData}
        currentUser={currentUser}
      />
      <Header 
        onToggleTerminal={handleToggleTerminal}
        onOpenFileSearch={handleOpenFileSearch}
        onNewProject={handleNewProject}
        isProjectOpen={!!rootNode}
        onToggleSessionModal={handleToggleSessionModal}
        sessionData={sessionData}
        activeProfile={activeProfile}
        onApplyProfile={handleApplyProfile}
      />
      <div className="flex flex-1 min-h-0">
        <ActivityBar 
            activeView={activeSidebarView}
            onViewChange={(view) => setActiveSidebarView(view)}
        />
        <Sidebar 
          activeView={activeSidebarView}
          rootNode={rootNode} 
          activeFile={activeFile?.path || ''}
          onFileSelect={handleFileSelect} 
          onOpenFolder={handleOpenFolder}
          onDeploy={handleDeploy}
          onGenerateProjectMap={handleGenerateProjectMap}
          onArchitectureReview={handleArchitectureReview}
          onGenerateTechDebtRadar={handleGenerateTechDebtRadar}
          onForgeModule={handleForgeModule}
          selectedFlow={selectedFlow}
          onFlowChange={setSelectedFlow}
          onRunFlow={handleRunFlow}
          flowOutput={flowOutput}
          isFlowRunning={isFlowRunning}
        />
        <main className="flex-1 flex flex-col min-w-0">
          <Editor 
            file={activeFile} 
            onAskAI={handleAskAI}
            onFileContentChange={handleFileContentChange}
            onRunCode={handleRunCode}
            pluginConfig={pluginConfig}
            theme={activeTheme}
          />
          {isTerminalOpen && <Terminal lines={terminalLines} onClose={() => setIsTerminalOpen(false)} />}
        </main>
        <RightPane
            activeTab={rightPaneTab}
            onTabChange={(tab) => setRightPaneTab(tab)}
            chatMessages={chatMessages}
            isChatLoading={isChatLoading}
            onSendMessage={handleSendMessage}
            initialPrompt={taskForAi}
            onPromptHandled={handlePromptHandled}
            techDebtReport={techDebtReport}
            isRadarLoading={isRadarLoading}
        />
      </div>
    </div>
  );
}

export default App;