
<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';

    const dispatch = createEventDispatcher();
    
    // This is a mock config for display purposes. In a real app,
    // this would be read from the project's mixcode.yaml file.
    let config = {
        name: 'meu-projeto',
        type: 'python',
        entrypoint: 'main.py',
        deploy: {
            method: 'docker',
            port: 8080,
            post_deploy: [
                "python migrate.py",
                "curl http://localhost:8080/health"
            ]
        }
    };
    let deploying = false;

    async function handleDeploy() {
        deploying = true;
        dispatch('deploy');
        // A real implementation might wait for a completion event
        // but for now we'll just set a timeout.
        setTimeout(() => deploying = false, 10000); // Reset after 10s
    }

</script>

<div class="p-2 text-gray-300">
    <h3 class="text-sm font-bold uppercase text-gray-500 px-2 mb-2">Deployment</h3>
    <div class="p-2 space-y-3">
        <div>
            <h4 class="text-xs font-semibold uppercase text-gray-500 tracking-wider">Project Name</h4>
            <p class="mt-1 bg-gray-800 p-2 rounded-md text-sm">{config.name}</p>
        </div>
        <div>
            <h4 class="text-xs font-semibold uppercase text-gray-500 tracking-wider">Type</h4>
            <p class="mt-1 bg-gray-800 p-2 rounded-md text-sm">{config.type}</p>
        </div>
        <div>
            <h4 class="text-xs font-semibold uppercase text-gray-500 tracking-wider">Deploy Method</h4>
            <p class="mt-1 bg-gray-800 p-2 rounded-md text-sm">{config.deploy.method}</p>
        </div>
         <div>
            <h4 class="text-xs font-semibold uppercase text-gray-500 tracking-wider">Post-Deploy Scripts</h4>
            <div class="mt-1 bg-gray-800 p-2 rounded-md text-sm font-mono text-cyan-400">
                {#each config.deploy.post_deploy as step}
                    <div>&gt; {step}</div>
                {/each}
            </div>
        </div>
        <div class="pt-4">
            <button 
                on:click={handleDeploy}
                disabled={deploying}
                class="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                 <!-- Cloud Arrow Up Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75m-7.5-3C4.58 9.75 3 11.33 3 13.5c0 1.25.64 2.32 1.58 2.92M12 16.5C12 17.75 12.64 18.82 13.58 19.42m-1.58-2.92v.001M19.5 13.5c0-1.61-1.23-2.96-2.81-3.23m-1.57-5.91A5.25 5.25 0 0012 4.5c-2.94 0-5.25 2.36-5.25 5.25v.75m12.69-4.01C17.36 4.77 14.86 3 12 3s-5.36 1.77-6.19 4.24M12 16.5h.008" />
                </svg>
                <span>
                    {#if deploying}
                        Deploying...
                    {:else}
                        Deploy Project
                    {/if}
                </span>
            </button>
        </div>
    </div>
</div>