
<script lang="ts">
    import MixGrid from "./MixGrid.svelte";

    export let projectPath: string;
</script>

<header class="grid-area-header bg-gray-800 text-gray-300 flex items-center justify-between px-4 h-8 border-b border-gray-700 text-sm select-none z-20">
    <div class="flex items-center space-x-2">
         <!-- MixCode Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
        <span class="font-bold text-white">MixCode</span>
    </div>
    <div class="flex-1 text-center text-gray-400 font-mono text-xs truncate px-4">
        {projectPath}
    </div>
    <div class="flex items-center space-x-4">
        <MixGrid />
    </div>
</header>

<style>
    .grid-area-header {
        grid-area: header;
    }
</style>
