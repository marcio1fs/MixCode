
<script lang="ts">
    import AiChat from '$lib/AiChat.svelte';
    import ProjectHistory from '$lib/ProjectHistory.svelte';
    import MixIQ from '$lib/MixIQ.svelte';
    import DocViewer from './DocViewer.svelte';
    import ProjectHealth from './ProjectHealth.svelte';
    
    export let projectPath: string;
    export let activeTab: 'chat' | 'history' | 'analysis' | 'docs' | 'health' = 'chat';
    export let code: string;
    export let language: string;

    function getTabClass(tabName: typeof activeTab) {
        return activeTab === tabName 
            ? 'border-blue-500 text-white' 
            : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500';
    }
</script>

<div class="flex flex-col h-full text-gray-300">
    <div class="flex-shrink-0 border-b border-gray-600 flex text-sm">
        <button 
            on:click={() => activeTab = 'chat'} 
            class="flex-1 p-3 text-center font-bold border-b-2 transition-colors duration-150 {getTabClass('chat')}"
        >
            AI Assistant
        </button>
        <button 
            on:click={() => activeTab = 'history'} 
            class="flex-1 p-3 text-center font-bold border-b-2 transition-colors duration-150 {getTabClass('history')}"
        >
            History
        </button>
         <button 
            on:click={() => activeTab = 'analysis'} 
            class="flex-1 p-3 text-center font-bold border-b-2 transition-colors duration-150 {getTabClass('analysis')}"
        >
            Analysis
        </button>
         <button 
            on:click={() => activeTab = 'docs'} 
            class="flex-1 p-3 text-center font-bold border-b-2 transition-colors duration-150 {getTabClass('docs')}"
        >
            Docs
        </button>
        <button 
            on:click={() => activeTab = 'health'} 
            class="flex-1 p-3 text-center font-bold border-b-2 transition-colors duration-150 {getTabClass('health')}"
        >
            Saúde
        </button>
    </div>
    <div class="flex-1 overflow-y-auto">
        {#if activeTab === 'chat'}
            <AiChat {projectPath} />
        {:else if activeTab === 'history'}
            <ProjectHistory {projectPath} />
        {:else if activeTab === 'analysis'}
            <MixIQ {code} {language} />
        {:else if activeTab === 'docs'}
            <DocViewer {code} {language} {projectPath} active={activeTab === 'docs'} />
        {:else if activeTab === 'health'}
            <ProjectHealth {projectPath} active={activeTab === 'health'} />
        {/if}
    </div>
</div>
