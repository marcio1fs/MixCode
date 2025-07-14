
<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    const dispatch = createEventDispatcher();
    
    type Line = {
        id: number;
        text: string;
        type: 'stdout' | 'stderr' | 'info' | 'status';
    }

    let lines: Line[] = [];
    let terminalEl: HTMLElement;

    export function clear() {
        lines = [];
    }
    
    export function addOutput(output: { stdout?: string, stderr?: string, info?: string, error?: string, duration?: number, exit_code?: number }) {
        const newLines: Line[] = [];
        let isStreaming = false;

        if (output.info) {
            newLines.push({ id: Date.now() + Math.random(), text: output.info, type: 'info' });
        }
        if (output.stdout) {
            // If the output is a stream chunk, append to the last line if it was also stdout
            const lastLine = lines[lines.length - 1];
            if (lastLine && lastLine.type === 'stdout' && !lastLine.text.endsWith('\n')) {
                 lastLine.text += output.stdout;
                 lines = lines; // Trigger reactivity
                 isStreaming = true;
            } else {
                newLines.push({ id: Date.now() + Math.random(), text: output.stdout, type: 'stdout' });
            }
        }
        if (output.stderr) {
            newLines.push({ id: Date.now() + Math.random(), text: output.stderr, type: 'stderr' });
        }
        if (output.error) {
            newLines.push({ id: Date.now() + Math.random(), text: `Execution Error: ${output.error}`, type: 'stderr' });
        }
        
        if (output.duration !== undefined && output.exit_code !== undefined) {
             const statusText = `[Finished in ${output.duration}s with exit code ${output.exit_code}]`;
             newLines.push({ id: Date.now() + Math.random(), text: statusText, type: 'status' });
        }
        
        if (!isStreaming) {
            lines = [...lines, ...newLines];
        }
    }
    
    $: if (lines && terminalEl) {
        // Allow DOM to update before scrolling
        setTimeout(() => {
            terminalEl.scrollTop = terminalEl.scrollHeight;
        }, 0);
    }
</script>

<div class="h-64 bg-gray-900 flex flex-col font-mono text-sm border-t border-gray-700 flex-shrink-0">
    <div class="flex items-center justify-between bg-gray-800 px-4 py-1 text-xs text-gray-400">
        <span class="font-semibold uppercase">Terminal</span>
        <button on:click={() => dispatch('close')} class="p-1 rounded-full hover:bg-gray-700" aria-label="Close Terminal">
            <!-- Close Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
    <div bind:this={terminalEl} class="flex-1 p-4 overflow-y-auto">
        {#each lines as line (line.id)}
            <div class:text-red-400={line.type === 'stderr'}
                 class:text-gray-400={line.type === 'info'}
                 class:text-green-400={line.type === 'status' && line.text.includes('exit code 0')}
                 class:text-red-400={line.type === 'status' && !line.text.includes('exit code 0')}
                 class="text-gray-200 whitespace-pre-wrap leading-relaxed"
            >
                {line.text}
            </div>
        {/each}
        <div class="flex items-center mt-2">
            <span class="text-cyan-400 mr-2">~/mixcode-project <span class="text-green-400">$</span></span>
            <div class="w-2 h-4 bg-gray-300 animate-pulse"></div>
        </div>
    </div>
</div>
