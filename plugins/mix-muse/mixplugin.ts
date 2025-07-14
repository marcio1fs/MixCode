import type { PluginAPI, FileContext } from "mixplugin-sdk";

interface MuseResponse {
  suggestions: string[];
  musicalPattern?: {
    rhythm: string;
    harmony: string;
    melody: string;
    structure: string;
  };
  namingSuggestions?: string[];
}

const plugin: PluginAPI = {
  async onEdit(ctx: FileContext) {
    try {
      // Chamar o backend Python do Mix Muse
      const res = await fetch("http://localhost:8000/mixmuse/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          code: ctx.content, 
          symbols: ctx.symbols || [],
          musicStyle: "jazz", // Configurável
          tempo: 120,
          complexity: "medium"
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: MuseResponse = await res.json();

      // Mostrar sugestões musicais
      if (data.suggestions && data.suggestions.length > 0) {
        showToast("🎵 MixMuse sugere: " + data.suggestions.join(", "));
      }

      // Mostrar padrão musical se disponível
      if (data.musicalPattern) {
        const pattern = data.musicalPattern;
        showToast(`🎼 Padrão musical: ${pattern.rhythm} | ${pattern.harmony} | ${pattern.melody}`);
      }

      // Mostrar sugestões de nomes se disponível
      if (data.namingSuggestions && data.namingSuggestions.length > 0) {
        showToast("🎶 Nomes musicais: " + data.namingSuggestions.join(", "));
      }

    } catch (error) {
      console.error("Erro ao chamar Mix Muse:", error);
      showToast("❌ Erro ao conectar com Mix Muse");
    }
  },

  async onOpenFile(ctx: FileContext) {
    try {
      // Análise inicial do arquivo
      const res = await fetch("http://localhost:8000/mixmuse/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          code: ctx.content,
          path: ctx.path,
          language: ctx.language
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: MuseResponse = await res.json();

      // Mostrar análise musical inicial
      if (data.musicalPattern) {
        const pattern = data.musicalPattern;
        showToast(`🎵 Análise musical: ${pattern.structure} em ${pattern.rhythm}`);
      }

    } catch (error) {
      console.error("Erro na análise inicial:", error);
    }
  },

  async onCodeChange(ctx: FileContext) {
    try {
      // Análise em tempo real durante edição
      const res = await fetch("http://localhost:8000/mixmuse/analyze-realtime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          code: ctx.content,
          changes: ctx.changes || [],
          symbols: ctx.symbols || []
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: MuseResponse = await res.json();

      // Mostrar sugestões em tempo real
      if (data.suggestions && data.suggestions.length > 0) {
        showToast("🎼 MixMuse em tempo real: " + data.suggestions.join(", "));
      }

    } catch (error) {
      console.error("Erro na análise em tempo real:", error);
    }
  },

  // Configurações do plugin
  config: {
    name: "Mix Muse",
    version: "1.0.0",
    description: "Plugin de IA musical que analisa código e sugere melhorias baseadas em teoria musical",
    author: "MixCode Team",
    settings: {
      musicStyle: {
        type: "select",
        label: "Estilo Musical",
        options: ["jazz", "classical", "electronic", "rock", "ambient"],
        default: "jazz"
      },
      tempo: {
        type: "number",
        label: "Tempo (BPM)",
        min: 60,
        max: 200,
        default: 120
      },
      complexity: {
        type: "select",
        label: "Complexidade",
        options: ["simple", "medium", "complex"],
        default: "medium"
      },
      enableNamingSuggestions: {
        type: "boolean",
        label: "Sugestões de Nomes Musicais",
        default: true
      },
      enableMusicalAnalysis: {
        type: "boolean",
        label: "Análise Musical",
        default: true
      }
    }
  }
};

// Função auxiliar para mostrar toasts (simulada)
function showToast(message: string) {
  // Em implementação real, isso seria integrado com o sistema de notificações
  console.log(`[Mix Muse] ${message}`);
  
  // Simular toast notification
  if (typeof window !== 'undefined' && window.showToast) {
    window.showToast(message);
  }
}

export default plugin; 