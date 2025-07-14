
<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import FileNode from '$lib/FileNode.svelte';

    const dispatch = createEventDispatcher();
    let fileSystem: any[] = [];
    let isLoading = true;

    onMount(async () => {
        // Simulate async loading of file structure
        await new Promise(res => setTimeout(res, 500));
        
        fileSystem = [
            { name: 'README.md', type: 'file', lang: 'markdown', content: '# MixCode Svelte Project' },
            { 
                name: 'src', 
                type: 'folder', 
                children: [
                    { name: 'app.html', type: 'file', lang: 'html', content: '<!-- Svelte App Entry -->'},
                    { 
                        name: 'lib', 
                        type: 'folder',
                        children: [
                             { name: 'FileTree.svelte', type: 'file', lang: 'svelte', content: '<!-- You are here -->'},
                             { name: 'Editor.svelte', type: 'file', lang: 'svelte', content: '<script>...</script>' },
                             { name: 'AiChat.svelte', type: 'file', lang: 'svelte', content: '<script>...</script>' }
                        ]
                    },
                    { name: 'routes', type: 'folder', children: [
                        { name: '+page.svelte', type: 'file', lang: 'svelte', content: '<h1>Welcome to SvelteKit</h1>' }
                    ]}
                ]
            },
            { name: 'package.json', type: 'file', lang: 'json', content: '{ "name": "my-app" }' }
        ];

        isLoading = false;
    });

</script>

<div class="p-2 text-gray-300">
    <div class="flex justify-between items-center px-2 mb-2">
        <h3 class="text-sm font-bold uppercase text-gray-500">Explorer</h3>
        <button 
            on:click={() => dispatch('showHealthReport')} 
            title="Analisar Saúde do Projeto" 
            class="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-600"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
            </svg>
        </button>
    </div>
    {#if isLoading}
        <p class="px-2 text-gray-400">Loading project...</p>
    {:else}
        <div>
            {#each fileSystem as node (node.name)}
                <FileNode {node} on:fileSelect />
            {/each}
        </div>
    {/if}
</div>
