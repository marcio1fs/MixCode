
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    export let activeView: 'explorer' | 'deploy';

    const dispatch = createEventDispatcher();

    function setView(view: 'explorer' | 'deploy') {
        activeView = view;
        dispatch('viewChange', view);
    }
</script>

<div class="activity-bar w-14 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-2 space-y-2">
    <button
        on:click={() => setView('explorer')}
        title="Explorer"
        class="w-full flex justify-center p-3 relative"
    >
        {#if activeView === 'explorer'}
            <div class="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 rounded-r-full"></div>
        {/if}
        <!-- File Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 {activeView === 'explorer' ? 'text-white' : 'text-gray-400 hover:text-white'}">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
    </button>
    <button
        on:click={() => setView('deploy')}
        title="Deployment"
        class="w-full flex justify-center p-3 relative"
    >
         {#if activeView === 'deploy'}
            <div class="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 rounded-r-full"></div>
        {/if}
        <!-- Cloud Arrow Up Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 {activeView === 'deploy' ? 'text-white' : 'text-gray-400 hover:text-white'}">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75m-7.5-3C4.58 9.75 3 11.33 3 13.5c0 1.25.64 2.32 1.58 2.92M12 16.5C12 17.75 12.64 18.82 13.58 19.42m-1.58-2.92v.001M19.5 13.5c0-1.61-1.23-2.96-2.81-3.23m-1.57-5.91A5.25 5.25 0 0012 4.5c-2.94 0-5.25 2.36-5.25 5.25v.75m12.69-4.01C17.36 4.77 14.86 3 12 3s-5.36 1.77-6.19 4.24M12 16.5h.008" />
        </svg>
    </button>
</div>

<style>
    .activity-bar {
        grid-area: activity;
    }
</style>
