<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let node;
	export let level = 0;

	// Folders are open by default, files don't have this state.
	let isOpen = node.type === 'folder' ? true : undefined;

	const dispatch = createEventDispatcher();

	function selectFile(file) {
		if (file.type === 'file') {
			dispatch('fileSelect', {
				content: file.content,
				language: file.lang,
			});
		}
	}

	function toggleFolder() {
		if (node.type === 'folder') {
			isOpen = !isOpen;
		}
	}

    function handleClick() {
        if (node.type === 'folder') {
            toggleFolder();
        } else {
            selectFile(node);
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            handleClick();
        }
    }

</script>

<div style="padding-left: {level * 1}rem;">
	<div
		class="flex items-center space-x-2 py-1 px-2 cursor-pointer hover:bg-gray-600 rounded-md"
		on:click={handleClick}
		on:keydown={handleKeydown}
		role="button"
		tabindex="0"
	>
		{#if node.type === 'folder'}
			<svg
				class="w-4 h-4 text-gray-400 transform transition-transform duration-150 flex-shrink-0 {isOpen ? 'rotate-90' : ''}"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
			<!-- Folder Icon -->
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-yellow-400 flex-shrink-0">
				<path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
			</svg>
		{:else}
			<div class="w-4 h-4 flex-shrink-0" /> <!-- Spacer to align with chevron -->
			<!-- File Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400 flex-shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
		{/if}
		<span class="text-gray-300 truncate">{node.name}</span>
	</div>

	{#if isOpen && node.children}
		<div class="mt-0.5">
			{#each node.children as child (child.name)}
				<!-- Pass the fileSelect event up to the parent -->
				<svelte:self node={child} level={level + 1} on:fileSelect />
			{/each}
		</div>
	{/if}
</div>