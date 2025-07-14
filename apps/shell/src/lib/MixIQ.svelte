<script lang="ts">
  export let code: string;
  export let language: string;

  const analysisCache = new Map<string, any>();

  let insights: { complexity: number; coverage: string; issues: string[] } | null = null;
  let isLoading = false;
  let errorMessage = '';

  // Reactive statement to re-fetch when code/language changes
  $: if (code && language) {
    fetchAnalysis();
  }

  async function fetchAnalysis() {
    isLoading = true;
    errorMessage = '';
    insights = null;

    // Don't analyze placeholder text
    if (code.startsWith('// Welcome to MixCode!')) {
        isLoading = false;
        errorMessage = 'Select a file to analyze.';
        return;
    }
    
    // Use a simple hash of the code as the cache key
    const cacheKey = `${language}:${code}`;
    if (analysisCache.has(cacheKey)) {
      insights = analysisCache.get(cacheKey);
      isLoading = false;
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      if (!res.ok) {
        throw new Error(`AI service responded with status: ${res.status}`);
      }
      const data = await res.json();
      insights = data;
      analysisCache.set(cacheKey, data); // Save to cache
    } catch (err) {
      if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        errorMessage = "An unknown error occurred while analyzing the code.";
      }
      console.error(err);
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="p-4">
    <h3 class="font-bold mb-4 text-white">🧠 MixIQ Analysis</h3>
    {#if isLoading}
        <div class="text-center p-8 text-gray-400">
            <p>Analyzing code...</p>
        </div>
    {:else if errorMessage}
        <div class="bg-red-900/50 text-red-300 border border-red-700 p-3 rounded-md">
            <strong>Error:</strong> {errorMessage}
        </div>
    {:else if insights}
        <div class="space-y-4">
            <div class="bg-gray-700 p-3 rounded-md">
                <p class="text-sm text-gray-400">Cyclomatic Complexity</p>
                <p class="text-2xl font-bold text-white">{insights.complexity}</p>
                <p class="text-xs text-gray-500">Lower is better. High complexity can make code harder to test and maintain.</p>
            </div>
             <div class="bg-gray-700 p-3 rounded-md">
                <p class="text-sm text-gray-400">Estimated Test Coverage</p>
                <p class="text-2xl font-bold text-white">{insights.coverage}</p>
                <p class="text-xs text-gray-500">An AI-powered estimate of how much of this code is covered by tests.</p>
            </div>
            <div class="bg-gray-700 p-3 rounded-md">
                <p class="text-sm text-gray-400">Potential Issues</p>
                {#if insights.issues && insights.issues.length > 0}
                    <ul class="list-disc list-inside mt-2 space-y-1 text-sm text-amber-300">
                        {#each insights.issues as issue}
                            <li>{issue}</li>
                        {/each}
                    </ul>
                {:else}
                    <p class="mt-2 text-sm text-gray-400">No major issues found. Great job!</p>
                {/if}
            </div>
        </div>
    {:else}
         <div class="text-center p-8 text-gray-500">
            <p>Select a file to see the AI code analysis.</p>
        </div>
    {/if}
</div>