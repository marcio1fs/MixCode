
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import FileTree from '$lib/FileTree.svelte';
  import Editor from '$lib/Editor.svelte';
  import RightPane from '$lib/RightPane.svelte';
  import CommandPalette from '$lib/CommandPalette.svelte';
  import Terminal from '$lib/Terminal.svelte';
  import ActivityBar from '$lib/ActivityBar.svelte';
  import DeploymentView from '$lib/DeploymentView.svelte';
  import Header from '$lib/Header.svelte';

  type SidebarView = 'explorer' | 'deploy';

  // Component State
  let activeFileContent = `// Welcome to MixCode!
// Select a file from the explorer to begin.
function helloWorld() {
  console.log("Hello, MixCode!");
}
`;
  let activeFileLanguage = 'javascript';
  let projectPath = "/users/mixcode-user/dev/my-svelte-project"; // Mock project path

  // Component Instances
  let editorComponent: Editor;
  let terminalComponent: Terminal;

  // State for child components & modals
  let rightPaneTab: 'chat' | 'history' | 'analysis' | 'docs' | 'health' = 'chat';
  let showCommandPalette = false;
  let isTerminalOpen = false;
  let activeSidebarView: SidebarView = 'explorer';

  // --- Handlers ---
  function handleFileSelect(event: CustomEvent<{ content: string; language: string }>) {
    activeFileContent = event.detail.content;
    activeFileLanguage = event.detail.language;
  }
  
  function handleCommand(event: CustomEvent<string>) {
      const command = event.detail;
      if (command === 'refactor') {
          editorComponent?.refactorWithAI();
      } else if (command === 'show_history') {
          rightPaneTab = 'history';
      } else if (command === 'show_chat') {
          rightPaneTab = 'chat';
      } else if (command === 'toggle_terminal') {
          isTerminalOpen = !isTerminalOpen;
      }
  }

  function handleShowDocs() {
    rightPaneTab = 'docs';
  }

  function handleShowHealthReport() {
    rightPaneTab = 'health';
  }

  async function handleRunCode(event: CustomEvent<{ code: string, language: string }>) {
    if (!isTerminalOpen) {
      isTerminalOpen = true;
      // Wait for terminal to mount
      await new Promise(r => setTimeout(r, 50));
    }
    terminalComponent?.clear();
    terminalComponent?.addOutput({info: `Running ${event.detail.language} code...`});
    
    try {
      const res = await fetch('http://localhost:8000/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event.detail),
      });
      const result = await res.json();
      terminalComponent?.addOutput(result);
    } catch (e) {
      if (e instanceof Error) {
        terminalComponent?.addOutput({ stderr: `Failed to connect to execution service: ${e.message}` });
      }
    }
  }

  async function handleDeploy() {
    if (!isTerminalOpen) {
      isTerminalOpen = true;
      await new Promise(r => setTimeout(r, 50));
    }
    terminalComponent?.clear();
    terminalComponent?.addOutput({info: `Starting deployment for project: ${projectPath}...`});

    try {
        const response = await fetch('http://localhost:8000/api/deploy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_path: projectPath }),
        });

        if (!response.body) {
          terminalComponent?.addOutput({ stderr: 'Deployment service did not return a readable stream.' });
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            terminalComponent?.addOutput({ stdout: chunk });
        }
        terminalComponent?.addOutput({info: `[Deployment finished]`});

    } catch (e) {
      if (e instanceof Error) {
        terminalComponent?.addOutput({ stderr: `Failed to connect to deployment service: ${e.message}` });
      }
    }
  }
  
  function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
          e.preventDefault();
          showCommandPalette = !showCommandPalette;
      }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
  });
  
  onDestroy(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
</script>

<CommandPalette 
    bind:show={showCommandPalette} 
    on:command={handleCommand} 
    on:close={() => showCommandPalette = false}
/>

<div class="main-grid">
  <Header {projectPath}/>
  <ActivityBar bind:activeView={activeSidebarView} />
  <div class="sidebar">
      {#if activeSidebarView === 'explorer'}
        <FileTree on:fileSelect={handleFileSelect} on:showHealthReport={handleShowHealthReport} />
      {:else if activeSidebarView === 'deploy'}
        <DeploymentView on:deploy={handleDeploy} />
      {/if}
  </div>
  <div class="editor-pane">
    <Editor 
        bind:this={editorComponent} 
        bind:code={activeFileContent} 
        language={activeFileLanguage} 
        {projectPath}
        on:run={handleRunCode}
        on:showDocs={handleShowDocs}
    />
    {#if isTerminalOpen}
        <Terminal bind:this={terminalComponent} on:close={() => isTerminalOpen = false}/>
    {/if}
  </div>
  <div class="chat-pane">
    <RightPane bind:activeTab={rightPaneTab} {projectPath} code={activeFileContent} language={activeFileLanguage} />
  </div>
</div>

<style>
  .main-grid {
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: auto 250px 1fr 400px;
    grid-template-areas: 
      "header header header header"
      "activity sidebar editor-pane chat-pane";
    height: 100vh;
    width: 100vw;
    background-color: #1f2937; /* gray-800 */
    color: #e2e8f0;
  }

  .sidebar {
    grid-area: sidebar;
    background-color: #2d3748; /* gray-700 */
    overflow-y: auto;
  }
  
  .editor-pane {
      grid-area: editor-pane;
      display: flex;
      flex-direction: column;
      background-color: #1a202c; /* gray-900 */
      min-height: 0; /* Important for flexbox children to shrink properly */
  }

  .chat-pane {
    grid-area: chat-pane;
    background-color: #2d3748; /* gray-700 */
    border-left: 1px solid #4a5568;
    display: flex;
    flex-direction: column;
  }
</style>
