# 🎵 Mix Muse - Guia de Integração

## Visão Geral

O **Mix Muse** é um plugin inovador que integra análise de código com teoria musical, oferecendo sugestões únicas baseadas em padrões musicais. Este guia explica como integrar e usar o plugin no ambiente MixCode.

## 📁 Estrutura do Plugin

```
plugins/mix-muse/
├── manifest.json              # Configuração do plugin
├── index.ts                   # Implementação TypeScript
├── mixplugin.ts              # Plugin compatível com SDK
├── muse_agent.py             # Backend Python principal
├── server.py                 # Servidor FastAPI
├── requirements.txt          # Dependências Python
├── plugin.config.json        # Configuração avançada
├── start_server.bat          # Script Windows
├── start_server.sh           # Script Linux/Mac
├── test_example.py           # Exemplos de teste
├── README.md                 # Documentação principal
└── INTEGRATION.md            # Este guia
```

## 🚀 Instalação

### 1. Dependências Python

```bash
cd plugins/mix-muse
pip install -r requirements.txt
```

### 2. Iniciar Servidor

**Windows:**
```bash
start_server.bat
```

**Linux/Mac:**
```bash
chmod +x start_server.sh
./start_server.sh
```

**Manual:**
```bash
python server.py
```

### 3. Verificar Funcionamento

```bash
python test_example.py
```

## 🔌 Integração com MixCode

### Plugin TypeScript (mixplugin.ts)

O arquivo `mixplugin.ts` implementa a interface `PluginAPI` do SDK do MixPlugin:

```typescript
const plugin: PluginAPI = {
  async onEdit(ctx: FileContext) {
    // Análise durante edição
  },
  
  async onOpenFile(ctx: FileContext) {
    // Análise inicial
  },
  
  async onCodeChange(ctx: FileContext) {
    // Análise em tempo real
  }
};
```

### Configurações Disponíveis

```json
{
  "musicStyle": "jazz|classical|electronic|rock|ambient",
  "tempo": 60-200,
  "complexity": "simple|medium|complex",
  "enableNamingSuggestions": true,
  "enableMusicalAnalysis": true
}
```

## 🎼 APIs do Servidor

### POST /mixmuse/suggest
Sugestões de melhorias baseadas em análise musical.

**Request:**
```json
{
  "code": "código fonte",
  "symbols": ["função1", "função2"],
  "musicStyle": "jazz",
  "tempo": 120,
  "complexity": "medium"
}
```

**Response:**
```json
{
  "suggestions": ["sugestão 1", "sugestão 2"],
  "musicalPattern": {
    "rhythm": "4/4",
    "harmony": "C major",
    "melody": "pentatonic",
    "structure": "AABA"
  },
  "namingSuggestions": ["nome1", "nome2"]
}
```

### POST /mixmuse/analyze
Análise inicial de arquivo.

### POST /mixmuse/analyze-realtime
Análise em tempo real durante edição.

### GET /mixmuse/health
Verificação de saúde da API.

### GET /mixmuse/styles
Estilos musicais disponíveis.

## 🎵 Funcionalidades Musicais

### Análise de Ritmo
- **4/4**: Código simples e direto
- **6/8**: Código com syncopação
- **7/8**: Código complexo
- **5/4**: Código irregular

### Análise de Harmonia
- **Triads**: Estruturas básicas
- **7ths**: Funções intermediárias
- **9ths, 11ths**: Classes complexas

### Sugestões de Nomenclatura
- **Orchestrate**: Funções principais
- **Harmonize**: Funções de processamento
- **Tune**: Funções de ajuste
- **Compose**: Funções de criação

## 🔧 Configuração Avançada

### Estilos Musicais

1. **Jazz**: Improvisação e complexidade
2. **Classical**: Estrutura formal
3. **Electronic**: Padrões sintetizados
4. **Rock**: Código energético
5. **Ambient**: Fluxo livre

### Níveis de Complexidade

1. **Simple**: Código básico
2. **Medium**: Código moderado
3. **Complex**: Código avançado

## 🧪 Testes

### Teste Automático
```bash
python test_example.py
```

### Teste Manual
```bash
curl -X POST http://localhost:8000/mixmuse/suggest \
  -H "Content-Type: application/json" \
  -d '{"code": "function test() {}", "symbols": ["test"]}'
```

## 🐛 Troubleshooting

### Servidor não inicia
1. Verifique se Python 3.7+ está instalado
2. Instale dependências: `pip install -r requirements.txt`
3. Verifique se porta 8000 está livre

### Plugin não responde
1. Verifique se servidor está rodando em `http://localhost:8000`
2. Teste com: `curl http://localhost:8000/mixmuse/health`
3. Verifique logs do servidor

### Erros de análise
1. Verifique se código está em linguagem suportada
2. Verifique se símbolos estão corretos
3. Ajuste configurações de complexidade

## 📈 Monitoramento

### Logs do Servidor
```bash
python server.py --log-level debug
```

### Métricas de Performance
- Tempo de resposta das APIs
- Uso de memória do servidor
- Número de análises por minuto

## 🔄 Atualizações

### Atualizar Dependências
```bash
pip install -r requirements.txt --upgrade
```

### Reiniciar Servidor
```bash
# Parar servidor (Ctrl+C)
# Iniciar novamente
python server.py
```

## 🤝 Contribuição

### Adicionar Novo Estilo Musical
1. Edite `muse_agent.py`
2. Adicione novo estilo em `MusicStyle`
3. Implemente lógica específica
4. Atualize documentação

### Adicionar Nova Análise
1. Crie nova função em `muse_agent.py`
2. Adicione endpoint em `server.py`
3. Atualize `mixplugin.ts`
4. Teste com `test_example.py`

## 📚 Recursos Adicionais

- [Documentação FastAPI](https://fastapi.tiangolo.com/)
- [Teoria Musical](https://en.wikipedia.org/wiki/Music_theory)
- [MixCode Plugin SDK](https://github.com/mixcode/plugin-sdk)

---

**Mix Muse** - Transformando código em música, uma linha por vez 🎵✨ 