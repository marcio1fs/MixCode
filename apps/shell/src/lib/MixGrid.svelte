
<script lang="ts">
    import { onMount } from "svelte";

    let peers: string[] = [];
    let sessionId = "dev-room-01";
    let currentUser = "marcio";
    let inSession = false;
    let isLoading = false;
    let showPopover = false;
    let popoverElement: HTMLElement;

    async function joinSession() {
        if (isLoading) return;
        isLoading = true;
        try {
            const res = await fetch(`http://localhost:8000/grid/join/${sessionId}?user=${currentUser}`);
            const data = await res.json();
            peers = data.users || [];
            inSession = true;
        } catch (e) {
            console.error("Failed to join session:", e);
            peers = []; // Show an error in a real app
        } finally {
            isLoading = false;
        }
    }

    function leaveSession() {
        inSession = false;
        peers = [];
        showPopover = false;
    }
    
    function handleClickOutside(event: MouseEvent) {
        if (showPopover && popoverElement && !popoverElement.contains(event.target as Node)) {
            showPopover = false;
        }
    }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="relative" bind:this={popoverElement}>
    <button on:click={() => showPopover = !showPopover} title="MixGrid Session" class="relative p-1 rounded-full hover:bg-gray-700">
        <!-- Users Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.952a4.5 4.5 0 01-9 0m9 0a4.5 4.5 0 00-9 0m9 0h.008M9 15.75A3.75 3.75 0 015.25 12m0 0a3.75 3.75 0 013.75-3.75M9 15.75a3.75 3.75 0 01-3.75-3.75M15 12a3.75 3.75 0 01-3.75 3.75m0 0a3.75 3.75 0 013.75-3.75M15 12a3.75 3.75 0 013.75 3.75m0 0a3.75 3.75 0 01-3.75-3.75" />
        </svg>
        {#if inSession}
            <span class="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-gray-800" />
        {/if}
    </button>

    {#if showPopover}
        <div class="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-md shadow-lg p-4 z-30">
            {#if inSession}
                <h3 class="font-bold text-white mb-2">👥 MixGrid – Sessão Ativa</h3>
                <p class="text-xs text-gray-400 mb-3">Sessão: <span class="font-mono bg-gray-900 px-1 py-0.5 rounded">{sessionId}</span></p>
                
                <h4 class="text-sm font-semibold text-gray-300 mb-2">Participantes ({peers.length})</h4>
                <ul class="space-y-1 text-sm text-gray-300 max-h-32 overflow-y-auto">
                    {#each peers as peer}
                        <li><span class="text-green-400">🔗</span> {peer}</li>
                    {/each}
                </ul>
                <button on:click={leaveSession} class="w-full mt-4 text-center px-4 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 text-sm">
                    Sair da Sessão
                </button>
            {:else}
                <h3 class="font-bold text-white mb-2">👥 MixGrid</h3>
                <p class="text-sm text-gray-400 mb-4">Entre em uma sessão para colaborar em tempo real.</p>
                <button on:click={joinSession} disabled={isLoading} class="w-full text-center px-4 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                    {isLoading ? 'Conectando...' : 'Entrar na Sessão'}
                </button>
            {/if}
        </div>
    {/if}
</div>
