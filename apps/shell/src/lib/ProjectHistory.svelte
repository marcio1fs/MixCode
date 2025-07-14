<script lang="ts">
  import { onMount } from 'svelte';
  export let projectPath: string;
  let history: Array<{ timestamp: string; prompt: string; response:string }> = [];
  let isLoading = true;
  let errorMessage = '';

  onMount(async () => {
    if (!projectPath) {
        isLoading = false;
        errorMessage = "Project path is not available.";
        return;
    }
    try {
        const url = new URL("http://localhost:8000/api/history");
        url.searchParams.set("project_path", projectPath);

        const res = await fetch(url.toString());
        if (!res.ok) {
            throw new Error(`Failed to load history: ${res.statusText}`);
        }
        history = await res.json();
    } catch (err) {
        if (err instanceof Error) {
            errorMessage = err.message;
        } else {
            errorMessage = "An unknown error occurred.";
        }
        console.error(err);
    } finally {
        isLoading = false;
    }
  });
</script>

<style>
  .entry {
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    background: #374151; /* gray-700 */
    border-left: 3px solid #6b7280; /* gray-500 */
    border-radius: 0 0.25rem 0.25rem 0;
  }
  .timestamp {
    font-size: 0.75rem;
    color: #9ca3af; /* gray-400 */
    margin-bottom: 0.5rem;
  }
  .prompt {
    font-weight: bold;
    color: #fcd34d; /* amber-300 */
  }
  .response {
    margin-top: 0.5rem;
    color: #d1d5db; /* gray-300 */
    white-space: pre-wrap;
    word-break: break-word;
  }
  .error-message {
      background-color: #ef444420;
      color: #f87171;
      border: 1px solid #ef4444;
      padding: 1rem;
      border-radius: 0.25rem;
  }
</style>

<div class="p-4">
    {#if isLoading}
        <p>Loading history...</p>
    {:else if errorMessage}
        <div class="error-message">
            <strong>Error:</strong> {errorMessage}
            <p class="text-sm mt-2">Could not connect to the local AI service. Please ensure it is running on http://localhost:8000.</p>
        </div>
    {:else if history.length === 0}
        <p class="text-center text-gray-500 mt-8">No history recorded for this project yet.</p>
    {:else}
        {#each history as item (item.timestamp)}
            <div class="entry">
                <div class="timestamp">{new Date(item.timestamp).toLocaleString()}</div>
                <div class="prompt">You: {item.prompt}</div>
                <div class="response">AI: {item.response}</div>
            </div>
        {/each}
    {/if}
</div>
