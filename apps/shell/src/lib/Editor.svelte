<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import MonacoEditor from 'svelte-monaco-editor';
  
  export let code: string;
  export let language: string;
  export let projectPath: string;

  let isLoading = false;
  let isRunning = false;
  let loadingMessage = '';
  const dispatch = createEventDispatcher();

  const supportedRunLanguages = ['python', 'javascript'];
  $: canRun = supportedRunLanguages.includes(language);

  async function refactorWithAI() {
    if (!code || isLoading) return;

    isLoading = true;
    loadingMessage = 'Refactoring...';
    try {
      const res = await fetch('http://localhost:8000/api/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code, language: language, project_path: projectPath })
      });

      if (!res.ok) {
        throw new Error(`AI service responded with status: ${res.status}`);
      }

      const data = await res.json();
      if (data.result) {
        code = data.result;
      }
    } catch (error) {
      console.error("Error refactoring code:", error);
      // Optionally, show an error to the user
    } finally {
      isLoading = false;
    }
  }
  
  function generateDocs() {
    if (!code || language === 'markdown') return;
    dispatch('showDocs');
  }

  function runCode() {
      if (!canRun) return;
      dispatch('run', { code, language });
  }
</script>

<div class="flex flex-col w-full h-full">
    <div class="flex-shrink-0 bg-gray-800 p-2 border-b border-gray-700 flex justify-end items-center space-x-2">
        <button on:click={runCode} disabled={!canRun || isLoading} title="Run Code" class="flex items-center space-x-2 px-3 py-1 bg-green-700 hover:bg-green-600 rounded text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-600">
            <!-- Play Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                <path fill-rule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm6.39-2.908a.75.75 0 01.98-.01l4.25 3.5a.75.75 0 010 1.036l-4.25 3.5a.75.75 0 01-1.072-.858L10.5 10.5 7.308 8.162a.75.75 0 01.082-1.07z" clip-rule="evenodd" />
            </svg>
            <span>Run</span>
        </button>
        <button on:click={generateDocs} disabled={isLoading || !code || language === 'markdown'} class="flex items-center space-x-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
            <!-- Brain Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
               <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622-3.385m0 0a2.25 2.25 0 00-4.482 0l-1.622 3.385a15.998 15.998 0 01-1.622 3.385m0 0a2.25 2.25 0 00-4.482 0l-1.622 3.385m12.724 0l-1.622-3.385a2.25 2.25 0 00-4.482 0l-1.622 3.385"></path>
            </svg>
             <span>Generate Docs</span>
        </button>
        <button on:click={refactorWithAI} disabled={isLoading || !code} class="flex items-center space-x-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
            <!-- Sparkles Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846-.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.923-2.924L12 17.25l1.178-.398a3.375 3.375 0 002.923-2.924L16.5 12.75l.398 1.178a3.375 3.375 0 002.924 2.923L21 17.25l-1.178.398a3.375 3.375 0 00-2.924 2.923z" />
            </svg>
            <span>
                {#if isLoading}
                    {loadingMessage}
                {:else}
                    Refactor with AI
                {/if}
            </span>
        </button>
    </div>
    <div class="w-full h-full flex-1">
        <MonacoEditor
            bind:value={code}
            language={language}
            options={{
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
            readOnly: isLoading,
            }}
        />
    </div>
</div>