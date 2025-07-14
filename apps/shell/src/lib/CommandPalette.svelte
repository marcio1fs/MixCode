<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  export let show: boolean;

  const dispatch = createEventDispatcher();
  
  const commands = [
    { id: 'refactor', label: 'Refactor with AI' },
    { id: 'show_history', label: 'Show Project History' },
    { id: 'show_chat', label: 'Show AI Assistant' },
    { id: 'toggle_terminal', label: 'Toggle Terminal' },
  ];

  let query = '';
  let filteredCommands = commands;
  let selectedIndex = 0;
  let inputElement: HTMLInputElement;
  
  // Need to handle keydown events manually inside the component
  // to prevent interference with global handlers when the palette is not visible.
  function handleLocalKeyDown(e: KeyboardEvent) {
    if (!show) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % filteredCommands.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleSelect(filteredCommands[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      close();
    }
  }

  $: if (show) {
    // Reset on open
    query = '';
    selectedIndex = 0;
    setTimeout(() => inputElement?.focus(), 50);
  }

  $: filteredCommands = query 
    ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;
  
  $: if (filteredCommands.length > 0 && selectedIndex >= filteredCommands.length) {
      selectedIndex = Math.max(0, filteredCommands.length - 1);
  }

  function handleSelect(command: typeof commands[0]) {
      dispatch('command', command.id);
      close();
  }
  
  function close() {
      dispatch('close');
  }
</script>

<svelte:window on:keydown={handleLocalKeyDown} />

{#if show}
<div 
  class="fixed inset-0 bg-black/50 flex justify-center items-start pt-24 z-50"
  on:click={close}
  role="dialog"
  aria-modal="true"
>
  <div 
    class="w-full max-w-xl bg-gray-800 rounded-lg shadow-2xl border border-gray-700"
    on:click|stopPropagation
  >
    <div class="p-3 border-b border-gray-700 flex items-center space-x-2">
       <span class="font-mono text-gray-500 text-lg">&gt;</span>
       <input
        bind:this={inputElement}
        type="text"
        bind:value={query}
        placeholder="Type a command to run"
        class="w-full bg-gray-800 text-lg text-gray-200 placeholder-gray-500 focus:outline-none"
      />
    </div>
    <div class="max-h-96 overflow-y-auto">
      {#if filteredCommands.length > 0}
        <ul>
          {#each filteredCommands as command, index (command.id)}
            <li
              on:mousedown={() => handleSelect(command)}
              class={`flex items-center space-x-3 px-4 py-2 cursor-pointer ${
                index === selectedIndex ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`}
            >
              <span class={`${index === selectedIndex ? 'text-white' : 'text-gray-300'}`}>
                {command.label}
              </span>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="p-4 text-center text-gray-500">No matching commands found.</p>
      {/if}
    </div>
  </div>
</div>
{/if}
