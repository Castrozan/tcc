# TCC - Agentes Conversacionais com IA

Este repositório contém o desenvolvimento do Trabalho de Conclusão de Curso sobre Agentes Conversacionais com IA para Interação Aprimorada em Sistemas.

## 📑 Documentação do Projeto

- [Pré-Projeto](docs/pre-projeto.md) - Detalhes iniciais do TCC incluindo tema, objetivos e justificativa
- [Notas de Desenvolvimento](notes.md) - Anotações e ideias sobre o desenvolvimento
- [Temas Considerados](theme-ideas.md) - Processo de escolha e refinamento do tema

## 🔧 Implementação

### MCP Server Manager

Uma aplicação para gerenciar servidores MCP (Model Context Protocol) que podem ser utilizados com o Claude Desktop.

```bash
cd mcp-server-manager-app
npm install
npm run dev
```

#### Componentes:
- **API REST** para gerenciamento de servidores MCP
- **Configuração Automática** do Claude Desktop
- **Servidor Alpha** para testes e demonstração

### Servidores MCP de Exemplo

1. **Weather Server** (Python)
   ```bash
   cd mcp/weather
   pip install -r requirements.txt
   python weather.py
   ```

2. **Alpha Server** (TypeScript)
   ```bash
   cd mcp-server-manager-app/alpha-server
   npm install
   npm run dev
   ```

## 🛠️ Ferramentas e Utilitários

### Makefile Commands

- `make apply-claude-config` - Aplica a configuração do Claude Desktop
- `make save-bookmarks` - Salva os bookmarks relacionados à pesquisa

### Configuração do Claude Desktop

O arquivo de configuração do Claude está em `mcp/claude_desktop_config.json` e pode ser gerenciado através da API do MCP Server Manager.

## 📚 Pesquisa e Referências

- [Documentação MCP](mcp/mcp-docs-and-hands-on.md) - Notas e aprendizados sobre o Model Context Protocol
- [Bookmarks](bookmarks/bookmarks.json) - Links úteis e referências salvas

## 🚀 Começando

1. Clone o repositório
   ```bash
   git clone https://github.com/Castrozan/TCC.git
   cd TCC
   ```

2. Configure o Claude Desktop
   ```bash
   make apply-claude-config
   ```

3. Inicie o MCP Server Manager
   ```bash
   cd mcp-server-manager-app
   npm install
   npm run dev
   ```

4. (Opcional) Inicie os servidores de exemplo
   ```bash
   # Weather Server
   cd mcp/weather
   python weather.py

   # Alpha Server
   cd mcp-server-manager-app/alpha-server
   npm install
   npm run dev
   ```

## 👤 Autor

**Lucas de Castro Zanoni**
- GitHub: [@Castrozan](https://github.com/Castrozan)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
