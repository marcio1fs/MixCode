
<script lang="ts">
  import { onMount } from 'svelte';
  export let projectPath: string;
  export let active: boolean = false;

  let report: { heatmap: {[key:string]: number}, coverage: string, risk_areas: string[], trend: number } | null = null;
  let isLoading = true;
  let errorMessage = '';
  const reportCache = new Map<string, any>();

  // Reactive statement to re-fetch when the tab becomes active
  $: if (active) {
    fetchReport();
  }

  function getComplexityClass(score: number): string {
    if (score > 15) return 'bg-red-500 text-red-100';
    if (score > 8) return 'bg-yellow-500 text-yellow-100';
    return 'bg-green-500 text-green-100';
  }

  async function fetchReport() {
    if (!projectPath) {
        isLoading = false;
        errorMessage = "Project path is not available.";
        return;
    }
    
    if (reportCache.has(projectPath)) {
        report = reportCache.get(projectPath);
        isLoading = false;
        return;
    }

    isLoading = true;
    errorMessage = '';
    report = null;

    try {
      // NOTE: This endpoint is assumed to exist on the backend, similar to /api/history etc.
      const res = await fetch(`http://localhost:8000/api/radar/report?project_path=${encodeURIComponent(projectPath)}`);
      if (!res.ok) {
        throw new Error(`Failed to load project health report: ${res.statusText}`);
      }
      const data = await res.json();
      report = data;
      reportCache.set(projectPath, data);
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
  }
</script>

<div class="p-4 h-full">
    <h3 class="font-bold mb-4 text-white">🌡️ MixRadar – Saúde do Projeto</h3>
    {#if isLoading}
        <div class="flex items-center justify-center h-full text-gray-400">
            <p>Analisando saúde do projeto...</p>
        </div>
    {:else if errorMessage}
        <div class="bg-red-900/50 text-red-300 border border-red-700 p-3 rounded-md">
            <strong>Error:</strong> {errorMessage}
            <p class="text-sm mt-2">Could not connect to the local AI service. Please ensure it is running on http://localhost:8000.</p>
        </div>
    {:else if report}
        <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-700 p-3 rounded-md">
                    <p class="text-sm text-gray-400">📈 Cobertura de Testes</p>
                    <p class="text-2xl font-bold text-white">{report.coverage || 'N/A'}</p>
                </div>
                <div class="bg-gray-700 p-3 rounded-md">
                    <p class="text-sm text-gray-400">🚩 Áreas de Risco</p>
                    <p class="text-2xl font-bold text-white">{report.risk_areas?.length || 0}</p>
                </div>
            </div>
            
            <div class="bg-gray-700 p-3 rounded-md">
                <p class="text-sm text-gray-400 mb-2">🔥 Heatmap de Complexidade</p>
                {#if report.heatmap && Object.keys(report.heatmap).length > 0}
                    <ul class="space-y-1.5 max-h-60 overflow-y-auto pr-2">
                        {#each Object.entries(report.heatmap).sort(([, a], [, b]) => b - a) as [func, score]}
                            <li class="flex justify-between items-center bg-gray-900/50 p-2 rounded-md">
                                <span class="font-mono text-sm text-gray-300 truncate" title={func}>{func}</span>
                                <span class={`px-2 py-0.5 rounded-full text-xs font-bold ${getComplexityClass(score)}`}>
                                    {score}
                                </span>
                            </li>
                        {/each}
                    </ul>
                {:else}
                    <p class="text-sm text-gray-500 text-center py-4">Nenhuma função encontrada para análise.</p>
                {/if}
            </div>
             <div class="bg-gray-700 p-3 rounded-md">
                <p class="text-sm text-gray-400 mb-2">Riscos Semânticos Identificados</p>
                 {#if report.risk_areas && report.risk_areas.length > 0}
                    <ul class="space-y-2 text-sm max-h-40 overflow-y-auto pr-2">
                        {#each report.risk_areas as risk, index}
                            <li class="bg-red-900/40 p-2 rounded-md">
                                <p class="font-mono text-red-300 text-xs truncate" title={risk}>"{risk}"</p>
                            </li>
                        {/each}
                    </ul>
                {:else}
                    <p class="text-sm text-gray-500 text-center py-4">Nenhum risco de alto nível encontrado.</p>
                {/if}
            </div>
        </div>
    {:else}
         <div class="flex items-center justify-center h-full text-gray-500 text-center">
            <p>Clique no ícone de radar no explorador de arquivos para gerar um relatório.</p>
        </div>
    {/if}
</div>
