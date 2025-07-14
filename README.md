# MixCode – AI Assisted IDE

Um IDE moderno e centrado em IA que integra assistência inteligente para acelerar o ciclo de desenvolvimento. Este protótipo web demonstra recursos principais como navegador de arquivos, editor de código e assistente de chat com IA alimentado pelo Gemini, projetado com uma experiência de usuário familiar ao VS Code.

## 🚀 Características Principais

### ✨ Editor Inteligente
- **Monaco Editor**: Editor baseado no VS Code com syntax highlighting
- **Preview de Markdown**: Visualização em tempo real de arquivos Markdown
- **Execução de Código**: Execute Python, JavaScript e TypeScript diretamente
- **Ações de IA**: Explique, refatore e gere testes automaticamente

### 🤖 Assistência de IA
- **Chat Integrado**: Conversa com IA usando Google Gemini
- **Análise de Código**: Análise inteligente em tempo real
- **Geração de Módulos**: Crie módulos autocontidos com IA
- **Sugestões de Refatoração**: Melhore seu código com sugestões inteligentes

### 📁 Gerenciamento de Projetos
- **Navegador de Arquivos**: Interface familiar para navegar projetos
- **Busca Rápida**: Ctrl+P para buscar arquivos instantaneamente
- **Sessões Persistentes**: Seu trabalho é salvo automaticamente
- **Templates de Projeto**: Comece rapidamente com templates pré-configurados

### 👤 Perfis de Usuário
- **Analítico**: Foco em análise e qualidade de código
- **Criativo**: Foco em visualização e diagramas
- **Ágil**: Foco em fluxos de trabalho rápidos

### 🔌 Sistema de Plugins
- **Smart Linter**: Análise inteligente de código
- **Code Diagrammer**: Geração de diagramas
- **Mix Muse**: Plugin musical para renomeação inteligente
- **Arquitetura Extensível**: Adicione seus próprios plugins

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Monaco Editor
- **IA**: Google Gemini AI
- **Build**: Vite
- **Estilização**: CSS customizado com variáveis
- **Backend**: Python (FastAPI) para serviços de IA
- **Desktop**: Tauri para aplicação desktop

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- Python 3.8+ (para serviços de IA)
- Chave da API do Google Gemini (opcional)

### Passos de Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/marcio1fs/MixCode.git
   cd MixCode
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp env.example .env.local
   ```
   
   Edite `.env.local` e adicione sua chave da API (opcional):
   ```env
   GEMINI_API_KEY=sua_chave_aqui
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   Abra [http://localhost:5173](http://localhost:5173) no seu navegador

## 🧪 Testes

### Executar Testes
```bash
# Todos os testes
npm test

# Interface de testes
npm run test:ui

# Cobertura de testes
npm run test:coverage

# Testes em modo watch
npm run test:watch
```

### Testar Serviços Python
```bash
# Navegue para os serviços de IA
cd apps/ai-services

# Instale dependências Python
pip install -r requirements.txt

# Inicie o servidor
python main.py
```

### Testar Plugin Mix Muse
```bash
# Navegue para o plugin
cd plugins/mix-muse

# Instale dependências
pip install -r requirements.txt

# Inicie o servidor
python server.py

# Abra o arquivo de teste
# plugins/mix-muse/test_component.html
```

## 🔧 Configuração

### Perfis de Usuário

O MixCode oferece três perfis predefinidos:

#### Analítico
- **Foco**: Análise e qualidade de código
- **Plugins**: Smart Linter ativado
- **Tema**: Dark
- **Visualização**: Radar de dívida técnica

#### Criativo
- **Foco**: Visualização e diagramas
- **Plugins**: Code Diagrammer ativado
- **Tema**: Solarized
- **Visualização**: Chat de IA

#### Ágil
- **Foco**: Fluxos de trabalho rápidos
- **Plugins**: Smart Linter ativado
- **Tema**: Light
- **Visualização**: Fluxos de trabalho

### Plugins

#### Smart Linter
Analisa seu código em tempo real e oferece sugestões de melhoria.

#### Code Diagrammer
Gera diagramas automáticos do seu código para melhor compreensão.

#### Mix Muse
Plugin musical que oferece sugestões inteligentes de renomeação de funções baseadas em padrões musicais.

## 📚 Uso

### Navegação Básica

1. **Abrir Projeto**: Use "Open Folder" para carregar um projeto
2. **Navegar Arquivos**: Use o painel lateral para navegar pelos arquivos
3. **Editar Código**: Clique em um arquivo para abri-lo no editor
4. **Chat com IA**: Use o painel direito para conversar com a IA

### Atalhos de Teclado

- `Ctrl+P`: Buscar arquivos
- `Ctrl+Shift+P`: Paleta de comandos
- `Ctrl+S`: Salvar arquivo
- `Ctrl+Z`: Desfazer
- `Ctrl+Y`: Refazer
- `F5`: Executar código

### Recursos de IA

#### Explicar Código
Clique no botão "Explain" para obter uma explicação detalhada do código selecionado.

#### Refatorar Código
Use o botão "Refactor" para obter sugestões de melhoria do código.

#### Gerar Testes
Clique em "Generate Tests" para criar testes unitários automaticamente.

#### Chat Inteligente
Use o chat para fazer perguntas sobre seu código ou solicitar ajuda.

## 🔒 Segurança

### Criptografia
- Arquivos `.mixsync` são criptografados automaticamente
- Chaves de API são armazenadas de forma segura
- Sessões são protegidas

### Privacidade
- Dados locais permanecem no seu computador
- Comunicação com IA é feita de forma segura
- Nenhum dado é compartilhado sem permissão

## 🚀 Desenvolvimento

### Estrutura do Projeto
```
MixCode/
├── components/          # Componentes React
├── services/           # Serviços (IA, criptografia, etc.)
├── utils/             # Utilitários
├── plugins/           # Sistema de plugins
│   └── mix-muse/     # Plugin musical
├── tests/             # Testes automatizados
├── apps/              # Aplicações adicionais
│   ├── ai-services/   # Serviços Python de IA
│   └── shell/         # Aplicação Svelte/Tauri
└── constants/         # Configurações e perfis
```

### Adicionando Plugins

1. Crie um novo arquivo em `plugins/`
2. Implemente a interface `Plugin`
3. Registre o plugin no sistema

Exemplo:
```typescript
export const meuPlugin: Plugin = {
  name: 'Meu Plugin',
  description: 'Descrição do plugin',
  hooks: {
    onCodeChange: async (context) => {
      // Sua lógica aqui
      return [];
    }
  }
};
```

### Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Suporte

- **Issues**: [GitHub Issues](https://github.com/marcio1fs/MixCode/issues)
- **Documentação**: [Wiki](https://github.com/marcio1fs/MixCode/wiki)

## 🙏 Agradecimentos

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Editor de código
- [Google Gemini](https://ai.google.dev/) - IA generativa
- [React](https://reactjs.org/) - Framework frontend
- [Vite](https://vitejs.dev/) - Build tool

---

**MixCode** - Transformando a forma como você desenvolve com IA 🤖✨

**Desenvolvido por**: [@marcio1fs](https://github.com/marcio1fs)
