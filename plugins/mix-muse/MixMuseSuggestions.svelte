<script>
  import { onMount } from 'svelte';
  
  let suggestions = [];
  let loading = true;
  let error = null;
  let count = 0;

  onMount(async () => {
    try {
      loading = true;
      const res = await fetch('http://localhost:8000/mixmuse/recent');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      suggestions = await res.json();
      
      // Buscar contagem de sugestões
      const countRes = await fetch('http://localhost:8000/mixmuse/suggestions/count');
      if (countRes.ok) {
        const countData = await countRes.json();
        count = countData.count;
      }
    } catch (err) {
      error = err.message;
      console.error('Erro ao carregar sugestões:', err);
    } finally {
      loading = false;
    }
  });

  async function applySuggestion(original, newName) {
    try {
      const res = await fetch('http://localhost:8000/mixmuse/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ original, newName })
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const result = await res.json();
      alert(`🎵 ${result.message}`);
      
      // Recarregar sugestões
      const suggestionsRes = await fetch('http://localhost:8000/mixmuse/recent');
      if (suggestionsRes.ok) {
        suggestions = await suggestionsRes.json();
      }
    } catch (err) {
      alert(`❌ Erro ao aplicar sugestão: ${err.message}`);
      console.error('Erro ao aplicar sugestão:', err);
    }
  }

  function getMusicalEmoji(name) {
    const musicalWords = {
      'orchestrate': '🎼',
      'harmonize': '🎹',
      'tune': '🎵',
      'compose': '🎶',
      'arrange': '🎻',
      'resolve': '🎸',
      'data': '📊',
      'user': '👤',
      'record': '📝',
      'status': '📈',
      'item': '📦'
    };
    
    for (const [word, emoji] of Object.entries(musicalWords)) {
      if (name.toLowerCase().includes(word)) {
        return emoji;
      }
    }
    return '🎵';
  }
</script>

<style>
  .container {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: white;
  }

  .header {
    text-align: center;
    margin-bottom: 30px;
  }

  .header h1 {
    font-size: 2.5em;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }

  .header p {
    font-size: 1.1em;
    opacity: 0.9;
    margin: 10px 0;
  }

  .stats {
    background: rgba(255,255,255,0.1);
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    text-align: center;
  }

  .loading {
    text-align: center;
    padding: 40px;
    font-size: 1.2em;
  }

  .error {
    background: rgba(255,0,0,0.2);
    padding: 15px;
    border-radius: 10px;
    margin: 20px 0;
    border: 1px solid rgba(255,0,0,0.3);
  }

  .suggestions-list {
    list-style: none;
    padding: 0;
  }

  .suggestion-item {
    background: rgba(255,255,255,0.1);
    margin: 10px 0;
    padding: 15px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.3s ease;
  }

  .suggestion-item:hover {
    background: rgba(255,255,255,0.2);
    transform: translateX(5px);
  }

  .suggestion-text {
    flex: 1;
  }

  .original-name {
    color: #ffd700;
    font-weight: bold;
  }

  .arrow {
    margin: 0 10px;
    font-size: 1.2em;
  }

  .new-name {
    color: #90ee90;
    font-weight: bold;
    font-size: 1.1em;
  }

  .apply-btn {
    background: linear-gradient(45deg, #4CAF50, #45a049);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
  }

  .apply-btn:hover {
    background: linear-gradient(45deg, #45a049, #4CAF50);
    transform: scale(1.05);
  }

  .emoji {
    font-size: 1.5em;
    margin-right: 10px;
  }

  .footer {
    text-align: center;
    margin-top: 30px;
    opacity: 0.8;
    font-size: 0.9em;
  }
</style>

<div class="container">
  <div class="header">
    <h1>🎵 Mix Muse</h1>
    <p>Transformando código em música, uma linha por vez</p>
  </div>

  {#if loading}
    <div class="loading">
      <div>🎼 Carregando sugestões musicais...</div>
    </div>
  {:else if error}
    <div class="error">
      ❌ Erro: {error}
      <br>
      <small>Certifique-se de que o servidor está rodando em http://localhost:8000</small>
    </div>
  {:else}
    <div class="stats">
      <div>📊 {count} sugestões musicais disponíveis</div>
    </div>

    <h3>🎭 Sugestões de Nomes Musicais</h3>
    
    <ul class="suggestions-list">
      {#each suggestions as suggestion}
        <li class="suggestion-item">
          <div class="emoji">
            {getMusicalEmoji(suggestion.new)}
          </div>
          <div class="suggestion-text">
            <span class="original-name">{suggestion.original}</span>
            <span class="arrow">→</span>
            <span class="new-name">{suggestion.new}</span>
          </div>
          <button 
            class="apply-btn" 
            on:click={() => applySuggestion(suggestion.original, suggestion.new)}
          >
            ✔️ Aplicar
          </button>
        </li>
      {/each}
    </ul>

    {#if suggestions.length === 0}
      <div class="loading">
        <div>🎵 Nenhuma sugestão disponível no momento</div>
      </div>
    {/if}
  {/if}

  <div class="footer">
    <p>🎵 Mix Muse - Plugin de IA Musical</p>
    <p>Transformando nomes de funções em harmonia musical</p>
  </div>
</div> 