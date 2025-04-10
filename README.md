# TCC - Agentes Conversacionais com IA

Este repositório contém o desenvolvimento do Trabalho de Conclusão de Curso sobre Agentes Conversacionais com IA para Interação Aprimorada em Sistemas.

## 📑 Documentação do Projeto

- [Pré-Projeto](pre-projeto.md) - Detalhes iniciais do TCC incluindo tema, objetivos e justificativa
- [Notas de Desenvolvimento](notes.md) - Anotações e ideias sobre o desenvolvimento
- [Temas Considerados](theme-ideas.md) - Processo de escolha e refinamento do tema
- [Artigo](article/article.pdf) - Artigo completo do TCC
- [Citações](article/references.bib) - Referências bibliográficas

## 🌟 Por que este Workflow?

Este TCC foi desenvolvido seguindo um workflow orientado a código e versionamento, com diversas vantagens:

1. **Versionamento Completo**: Todo o conteúdo, tanto do código quanto do texto acadêmico, é versionado com Git, permitindo rastrear o histórico completo de desenvolvimento, experimentações e revisões.
2. **Escrita em Markdown e LaTeX**: O artigo é escrito em Markdown e compilado para LaTeX, combinando a facilidade de escrita do Markdown com o poder de formatação acadêmica do LaTeX e abnTeX.
3. **Gestão de Referências com BibTeX**: As citações são gerenciadas em formato BibTeX, garantindo consistência bibliográfica e facilitando a inclusão de novas referências.
4. **Automação de Conversões**: Scripts automatizam a conversão entre formatos (Markdown → LaTeX → PDF), mantendo a consistência entre o texto fonte e a saída final.
5. **Integração Código-Documentação**: Código e documentação estão no mesmo repositório, permitindo que exemplos práticos no código reflitam diretamente nos conceitos discutidos no texto.
6. **Reprodutibilidade Acadêmica**: Qualquer pessoa pode clonar o repositório e reproduzir tanto o ambiente de desenvolvimento quanto gerar o documento final com as mesmas ferramentas.
7. **Colaboração Facilitada**: O formato baseado em texto simples facilita revisões, sugestões e colaborações, mantendo a rastreabilidade de todas as contribuições.

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

Este projeto está sob a licença MIT.
