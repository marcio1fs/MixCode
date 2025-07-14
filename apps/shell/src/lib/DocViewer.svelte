<script lang="ts">
  export let code: string;
  export let language: string;
  export let projectPath: string;
  export let active: boolean = false;

  let doc: string | null = null;
  let isLoading = false;
  let errorMessage = '';
  
  // Cache to avoid re-fetching for the same code
  const docCache = new Map<string, string>();

  // Reactive statement to fetch when the tab becomes active
  $: if (active && code) {
    fetchDocs();
  }

  async function fetchDocs() {
    if (!code || language === 'markdown') {
      isLoading = false;
      errorMessage = 'Cannot generate documentation for a markdown file or empty file.';
      doc = '';
      return;
    }
    
    const cacheKey = `${language}:${code}`;
    if (docCache.has(cacheKey)) {
        doc = docCache.get(cacheKey)!;
        return;
    }

    isLoading = true;
    errorMessage = '';
    doc = null;

    try {
      const res = await fetch('http://localhost:8000/api/doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, project_path: projectPath })
      });

      if (!res.ok) {
        throw new Error(`Documentation service responded with status: ${res.status}`);
      }

      const data = await res.json();
      if (data.documentation) {
        doc = data.documentation;
        docCache.set(cacheKey, doc!);
      } else {
        throw new Error("Received an empty documentation response.");
      }
    } catch (err) {
      if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        errorMessage = "An unknown error occurred while generating documentation.";
      }
      console.error(err);
    } finally {
      isLoading = false;
    }
  }
</script>

<style>
  .doc-content {
      white-space: pre-wrap;
      word-break: break-word;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      line-height: 1.6;
  }
</style>

<div class="p-4 h-full text-gray-300">
    {#if isLoading}
        <div class="flex items-center justify-center h-full text-gray-400">
            <p>Generating documentation...</p>
        </div>
    {:else if errorMessage}
        <div class="bg-red-900/50 text-red-300 border border-red-700 p-3 rounded-md">
            <strong>Error:</strong> {errorMessage}
        </div>
    {:else if doc}
        <div class="doc-content">
            {doc}
        </div>
    {:else}
        <div class="flex items-center justify-center h-full text-gray-500 text-center">
            <p>Click "Generate Docs" in the editor to create documentation for the active file.</p>
        </div>
    {/if}
</div>
