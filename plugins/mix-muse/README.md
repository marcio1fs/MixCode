# Mix Muse Plugin

Um plugin inovador que combina análise de código com teoria musical para gerar código mais harmonioso e bem estruturado.

## 🚀 Instalação Rápida

**Windows:**
```bash
cd plugins/mix-muse
start_server.bat
```

**Linux/Mac:**
```bash
cd plugins/mix-muse
chmod +x start_server.sh
./start_server.sh
```

**Manual:**
```bash
cd plugins/mix-muse
pip install -r requirements.txt
python server.py
```

O servidor estará disponível em `http://localhost:8000`

## 🎵 Conceito

O Mix Muse analisa a estrutura do seu código e identifica padrões musicais correspondentes. Baseado nessa análise, ele sugere melhorias que tornam o código mais "musical" - com melhor ritmo, harmonia e estrutura.

## 🎼 Características

### Análise Musical do Código
- **Ritmo**: Analisa loops e condicionais para determinar padrões rítmicos
- **Harmonia**: Avalia funções e classes para criar camadas harmônicas
- **Melodia**: Identifica keywords e estruturas para criar linhas melódicas
- **Estrutura**: Organiza o código em formas musicais (AABA, sonata, etc.)
- **Nomenclatura**: Sugere nomes de funções baseados em teoria musical

### Estilos Musicais Suportados
- 🎷 **Jazz**: Código com improvisação e complexidade
- 🎻 **Classical**: Estrutura formal e organizada
- 🎹 **Electronic**: Padrões sintetizados e modernos
- 🎸 **Rock**: Código direto e energético
- 🌊 **Ambient**: Fluxo livre e atmosférico

### Configurações
- **Tempo**: 60-200 BPM (afeta a cadência do código)
- **Complexidade**: Simple, Medium, Complex
- **Estilo Musical**: Jazz, Classical, Electronic, Rock, Ambient

## 🚀 Como Usar

### 1. Instalação do Servidor

Primeiro, instale as dependências do servidor Python:

```bash
cd plugins/mix-muse
pip install -r requirements.txt
```

### 2. Iniciar o Servidor

```bash
python server.py
```

O servidor estará disponível em `http://localhost:8000`

### 3. Ativação do Plugin
O plugin é ativado automaticamente quando você abre um arquivo de código.

### 4. Análise Automática
- Analisa a estrutura do código em tempo real
- Identifica padrões musicais correspondentes
- Gera sugestões baseadas na teoria musical

### 5. Sugestões Inteligentes
- **Nomes Musicais**: Sugestões de nomes baseados em teoria musical
- **Simplificação**: Para código muito complexo
- **Modularização**: Para muitas camadas de funções
- **Organização**: Para melhor estrutura musical

### 6. APIs Disponíveis

- `POST /mixmuse/suggest` - Sugestões de melhorias
- `POST /mixmuse/analyze` - Análise inicial de arquivo
- `POST /mixmuse/analyze-realtime` - Análise em tempo real
- `GET /mixmuse/health` - Verificação de saúde
- `GET /mixmuse/styles` - Estilos musicais disponíveis
- `GET /mixmuse/complexities` - Níveis de complexidade

## 📊 Exemplos de Análise

### Código Simples (Pentatonic Scale)
```javascript
function add(a, b) {
    return a + b;
}
```
**Análise Musical**: 4/4 time signature, simple triads, pentatonic scale

### Código Complexo (Chromatic Scale)
```javascript
function processData(data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].type === 'user') {
            for (let j = 0; j < data[i].items.length; j++) {
                if (data[i].items[j].active) {
                    // Complex nested logic
                }
            }
        }
    }
}
```
**Análise Musical**: 7/8 complex rhythm, extended chords, chromatic scale

### Sugestões de Nomes Musicais
```javascript
// Antes
function processData(data) { ... }
function calculateSum(a, b) { ... }
function validateInput(input) { ... }

// Depois (sugestões musicais)
function orchestrateData(data) { ... }
function harmonizeValues(a, b) { ... }
function tuneParameters(input) { ... }
```

## 🎯 Benefícios

### Para Desenvolvedores
- **Melhor Organização**: Código mais estruturado e legível
- **Padrões Consistentes**: Aplicação de princípios musicais
- **Criatividade**: Abordagem única para desenvolvimento
- **Qualidade**: Código mais harmonioso e bem balanceado

### Para Projetos
- **Manutenibilidade**: Estrutura mais clara e organizada
- **Escalabilidade**: Padrões que crescem bem
- **Colaboração**: Código mais fácil de entender
- **Inovação**: Abordagem criativa para problemas

## 🔧 Configuração

### No manifest.json
```json
{
  "settings": {
    "musicStyle": {
      "type": "string",
      "default": "jazz",
      "options": ["jazz", "classical", "electronic", "rock", "ambient"]
    },
    "tempo": {
      "type": "number",
      "default": 120,
      "min": 60,
      "max": 200
    },
    "complexity": {
      "type": "string",
      "default": "medium",
      "options": ["simple", "medium", "complex"]
    }
  }
}
```

## 🎵 Teoria Musical Aplicada

### Ritmo (Loops e Condicionais)
- **4/4**: Código simples e direto
- **6/8**: Código com syncopação (condicionais)
- **7/8**: Código complexo com polirritmos
- **5/4**: Código irregular e inovador

### Harmonia (Funções e Classes)
- **Triads**: Estruturas básicas
- **7ths**: Funções intermediárias
- **9ths, 11ths**: Classes complexas
- **Clusters**: Muitas camadas

### Melodia (Keywords)
- **Pentatonic**: Código simples
- **Diatonic**: Código desenvolvido
- **Chromatic**: Código complexo

### Estrutura (Organização)
- **AABA**: Padrão clássico
- **Sonata**: Desenvolvimento formal
- **Free-form**: Estrutura livre

### Nomenclatura (Nomes de Funções)
- **Orchestrate**: Para funções principais
- **Harmonize**: Para funções de processamento
- **Tune**: Para funções de ajuste
- **Compose**: Para funções de criação
- **Arrange**: Para funções de organização

## 🎼 Exemplo de Saída

```typescript
// Generated by Mix Muse - Musical Code Generator
// Style: jazz
// Tempo: 140 BPM
// Key: C major
// Time Signature: 6/8

class MusicalCodeGenerator {
    private tempo: number = 140;
    private key: string = 'C major';
    private timeSignature: string = '6/8';
    private style: string = 'jazz';
    
    constructor() {
        this.initializeMusicalPattern();
    }
    
    private initializeMusicalPattern() {
        const rhythmPattern = this.createRhythmPattern();
        const harmonyLayers = this.createHarmonyLayers();
        const melodicElements = this.createMelodicElements();
        
        this.combineElements(rhythmPattern, harmonyLayers, melodicElements);
    }
    
    // ... mais métodos musicais
}
```

## 🤝 Contribuição

Para contribuir com o Mix Muse:

1. **Fork** o repositório
2. **Crie** uma branch para sua feature
3. **Implemente** melhorias musicais
4. **Teste** com diferentes estilos
5. **Submit** um pull request

## 📝 Licença

Este plugin é parte do MixCode e segue a mesma licença do projeto principal.

---

**Mix Muse** - Transformando código em música, uma linha por vez 🎵✨ 