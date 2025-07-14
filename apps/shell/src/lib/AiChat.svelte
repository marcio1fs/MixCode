<script lang="ts">
    import { onMount } from 'svelte';

    export let projectPath: string;

    let messages = [];
    let userInput = '';
    let isLoading = false;
    const chatContainer: HTMLElement;

    async function fetchHistory() {
        if (!projectPath) return;
        try {
            const res = await fetch(`http://localhost:8000/api/history?project_path=${encodeURIComponent(projectPath)}`);
            if (res.ok) {
                const history = await res.json();
                const historicalMessages = history.flatMap(item => [
                    { from: 'user', text: item.prompt },
                    { from: 'assistant', text: item.response }
                ]);
                messages = [...messages, ...historicalMessages];
            }
        } catch (error) {
            console.error("Failed to fetch history:", error);
        }
    }

    onMount(async () => {
        messages = [
            { from: 'assistant', text: 'Olá! Eu sou o assistente de IA local. Como posso ajudar?' }
        ];
        await fetchHistory();
    });

    // Auto-scroll to bottom when messages change
    $: if (messages && chatContainer) {
        // Timeout allows the DOM to update before scrolling
        setTimeout(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 0);
    }

    async function sendMessage() {
        if (!userInput.trim() || isLoading) return;

        isLoading = true;
        messages = [...messages, { from: 'user', text: userInput }];
        const currentInput = userInput;
        userInput = '';

        try {
            const response = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: currentInput,
                    context: null,
                    history: [],
                    project_path: projectPath
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();
            messages = [...messages, { from: 'assistant', text: data.result }];
        } catch (error) {
            console.error("Failed to fetch from AI service:", error);
            messages = [...messages, { from: 'assistant', text: 'Sorry, I couldn\'t connect to the AI service.' }];
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="flex flex-col h-full text-gray-300">
    <div class="p-4 border-b border-gray-600 flex-shrink-0">
        <h3 class="font-bold">AI Assistant</h3>
    </div>
    <div bind:this={chatContainer} class="flex-1 p-4 overflow-y-auto space-y-4">
        {#each messages as message}
            <div class={`flex w-full ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div class={`p-3 rounded-lg max-w-sm whitespace-pre-wrap ${message.from === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-600'}`}>
                    {message.text}
                </div>
            </div>
        {/each}
        {#if isLoading}
            <div class="flex w-full justify-start">
                 <div class="p-3 rounded-lg max-w-sm bg-gray-600">
                    <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <div class="w-2 h-2 bg-white rounded-full animate-pulse" style="animation-delay: 0.2s;"></div>
                        <div class="w-2 h-2 bg-white rounded-full animate-pulse" style="animation-delay: 0.4s;"></div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
    <div class="p-2 border-t border-gray-600 flex-shrink-0">
        <form on:submit|preventDefault={sendMessage} class="flex space-x-2">
            <input 
                type="text" 
                bind:value={userInput} 
                class="flex-1 bg-gray-800 rounded p-2 focus:outline-none disabled:opacity-50" 
                placeholder="Ask a question..."
                disabled={isLoading}
            />
            <button type="submit" class="bg-blue-600 rounded px-4 py-2 font-bold hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed" disabled={isLoading || !userInput.trim()}>
                {#if isLoading}
                    ...
                {:else}
                    Send
                {/if}
            </button>
        </form>
    </div>
</div>