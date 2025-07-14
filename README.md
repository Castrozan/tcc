# TCC - Transformando APIs em Interfaces Conversacionais

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Castrozan/tcc)  <-- Converse com o projeto

> **Validação da Abordagem OpenAPI-MCP para Agentes Baseados em IA**  
> *Trabalho de Conclusão de Curso - Engenharia de Software*  
> **Autor:** Lucas de Castro Zanoni | **Orientador:** Thyerri Fernandes Mezzari  
> **Instituição:** Centro Universitário UniSATC

## 🤖 Como Funciona o Sistema?

* O usuário escreve algo como “quero buscar o equipamento 123”.
* O modelo de linguagem entende a intenção.
* A intenção é convertida pelo modelo de linguagem em chamadas de função.
* A chamada de função é convertida em chamada de ferramentas MCP.
* O cliente via protocolo MCP chama as ferramentas correspondentes a intenção do usuároo.
* Nos servidores MCP a chamada é transformada em uma requisição HTTP real com base na especificação SWAGGER da aplicação destino.
* A resposta da API é formatada e enviada de volta ao modelo de linguagem que interpreta e responde, como se fosse um bate-papo.

## 🎥 Demonstração

<video src="https://github.com/user-attachments/assets/37c8237f-6cad-467e-9adf-053319d673b0" controls style="max-width: 100%; height: auto;">
  Seu navegador não suporta o vídeo.  
  <a href="demonstracao.mp4">Clique aqui para baixar o vídeo</a>.
</video>

## 📖 Navegação Rápida

| 🎯 **Seu Objetivo**          | 📋 **Comece Aqui**                                                      | ⏱️ **Tempo** |
| --------------------------- | ---------------------------------------------------------------------- | ----------- |
| **Entender a pesquisa**     | [📚 Guia Rápido - Acadêmico](QUICK_START.md#📖-sou-acadêmicopesquisador) | 5-15 min    |
| **Usar a ferramenta**       | [💻 Guia Rápido - Desenvolvedor](QUICK_START.md#💻-sou-desenvolvedor)    | 5-10 min    |
| **Reproduzir experimentos** | [🔬 Guia Rápido - Pesquisador](QUICK_START.md#🔬-sou-pesquisador-em-ia)  | 20 min      |
| **Avaliar comercialmente**  | [🏢 Guia Rápido - Empresa](QUICK_START.md#🏢-sou-profissionalempresa)    | 15 min      |
| **Navegar documentação**    | [📚 Índice Completo](DOCUMENTATION_INDEX.md)                            | Referência  |

---

## 📖 Sobre a Pesquisa

Este TCC investiga como **especificações OpenAPI podem ser automaticamente convertidas em servidores MCP** (Model Context Protocol), permitindo que modelos de linguagem de grande escala (LLMs) interajam com sistemas existentes através de **interfaces conversacionais naturais**.

### 🎯 Problema de Pesquisa
> *"Como a combinação da especificação OpenAPI com o protocolo MCP pode facilitar a integração eficiente e segura de agentes conversacionais baseados em IA com sistemas web existentes, contribuindo para a democratização do acesso a tecnologias complexas?"*

### 🎯 Principais Objetivos
- **Desenvolver** um gerador automático de servidores MCP a partir de especificações OpenAPI
- **Implementar** um cliente de chat capaz de gerenciar múltiplos servidores MCP simultaneamente
- **Validar** a abordagem através de testes experimentais rigorosos
- **Avaliar** desempenho, segurança e experiência do usuário

---

## 🏆 Principais Contribuições Científicas

### ✅ Resultados Experimentais Validados

| **Métrica**                     | **Resultado**                   | **Observações**               |
| ------------------------------- | ------------------------------- | ----------------------------- |
| **Conversão OpenAPI→MCP**       | 100% sucesso (10/10 endpoints)  | Automação completa            |
| **Taxa de Sucesso Operacional** | 100% (8/8 consultas)            | Robustez funcional            |
| **Experiência do Usuário**      | 4.0/5.0                         | Satisfação geral              |
| **Proteção de Segurança**       | 100% (16/16 ataques bloqueados) | Resistência a ataques básicos |
| **Tempo de Resposta Médio**     | 3.757ms                         | Variação: 1.335-5.823ms       |

### 🔬 Inovações Técnicas
1. **Geração Automática de Ferramentas MCP**: Conversão sistemática OpenAPI→MCP
2. **Orquestração Multi-Servidor**: Coordenação inteligente de múltiplos servidores MCP
3. **Integração Padronizada**: Ponte entre LLMs e APIs existentes
4. **Metodologia Reproduzível**: Framework experimental com métricas objetivas

---

## 🏗️ Arquitetura da Solução

```mermaid
graph TB
    UI[Interface do Usuário]
    CI[Chat Interface]
    AC[Agente Conversacional]
    LLM[LLM]
    AI[Analisador de Intenção]
    VR[Validador de Requisição]
    FR[Formatador de Resposta]
    
    CamInt[Camada de Integração]
    MCP[Servidor MCP]
    
    Backend[Sistemas de Backend]
    APIs[APIs Externas]
    
    UI --> CI
    CI --> AC
    AC -.-> |Consulta do Usuário| LLM
    LLM -.-> |Resposta em Linguagem Natural| AC
    LLM --> |Intenção Estruturada| AI
    AI --> VR
    VR -.-> |Requisição Validada| CamInt
    LLM --> |Resposta Formatada| FR
    FR --> AC
    
    CamInt --> MCP
    MCP --> |Requisição HTTP| Backend
    Backend --> APIs
    APIs -.-> |Resultado da Operação| Backend
    Backend -.-> MCP
    MCP -.-> CamInt
```

### 🧩 Componentes Principais

#### 1. **Gerador Automático de Servidores MCP** (`mcp-openapi-server/`)
- **Análise Sintática**: Parser e validação de especificações OpenAPI 3.0+
- **Mapeamento Semântico**: Conversão inteligente OpenAPI → ferramentas MCP
- **Geração de Ferramentas**: Criação automática de servidores MCP funcionais
- **Transporte Dual**: Suporte para stdio e HTTP

#### 2. **Cliente de Chat Multi-Servidor** (`chat-client/`)
- **Interface Minimalista**: Design padronizado para testes objetivos
- **Coordenação Distribuída**: Gerenciamento de múltiplos servidores MCP
- **Descoberta Automática**: Identificação dinâmica de ferramentas disponíveis
- **Testes E2E**: Suite completa com Playwright

#### 3. **Aplicações de Teste** (`equipments-dummy-app/` & `professionals-dummy-app/`)
- **APIs RESTful**: Implementações com Hono.js, TypeScript e PostgreSQL
- **Documentação OpenAPI**: Especificações completas para validação
- **Cenários Reais**: Simulação de sistemas empresariais

#### 4. **Framework de Validação**
- **Testes Automatizados**: Métricas de performance, segurança e UX
- **Red Teaming**: Testes adversários para validação de segurança
- **Instrumentação**: Coleta objetiva de dados experimentais

---

## 📚 Documentação Acadêmica

### 📄 Artigo Completo
- **[📖 Artigo Principal](article/article.pdf)** - Documento completo em PDF
- **[📝 Fonte Markdown](article/article.md)** - Texto fonte em Markdown
- **[📚 Referências](article/references.bib)** - Bibliografia em BibTeX

### 📋 Documentação de Pesquisa
- **[🎯 Pré-Projeto](pre-projeto.md)** - Objetivos, problema e justificativa
- **[📖 Notas de Desenvolvimento](notes.md)** - Anotações e ideias durante o desenvolvimento
- **[💡 Ideias de Tema](theme-ideas.md)** - Processo de escolha e refinamento do tema
- **[🔖 Bookmarks](bookmarks/bookmarks.json)** - Links de pesquisa organizados

### 🔬 Metodologia Científica
- **Abordagem Experimental**: Validação empírica com controle de variáveis
- **Métricas Objetivas**: Performance, segurança e experiência do usuário
- **Testes Reproduzíveis**: Framework automatizado para validação
- **Análise Estatística**: Dados quantitativos com intervalos de confiança

---

## 🔄 Workflow de Desenvolvimento Acadêmico

### 📝 Por que este Workflow?

Este TCC foi desenvolvido seguindo um **workflow orientado a código e versionamento**, com várias vantagens:

1. **📚 Versionamento Completo**: Todo conteúdo (código + texto acadêmico) versionado com Git
2. **✍️ Markdown + LaTeX**: Facilidade de escrita + poder de formatação acadêmica
3. **🔗 Gestão de Referências**: BibTeX para consistência bibliográfica
4. **⚙️ Automação**: Scripts para conversão Markdown → LaTeX → PDF
5. **🔧 Integração**: Código e documentação no mesmo repositório
6. **🔁 Reprodutibilidade**: Qualquer pessoa pode reproduzir o ambiente
7. **👥 Colaboração**: Formato texto facilita revisões e sugestões

---

## 📁 Estrutura do Projeto

```
TCC/
├── 📄 README.md                     # Este arquivo
├── 📄 pre-projeto.md                # Proposta inicial da pesquisa
├── 📄 CITATION.md                   # Formatos de citação
├── 📄 DOCUMENTATION_INDEX.md        # Índice completo da documentação
├── 📄 QUICK_START.md                # Guias de início rápido
├── 📄 RESEARCH_SUMMARY.md           # Resumo executivo da pesquisa
├── 🛠️ Makefile                     # Comandos de automação
│
├── 📚 article/                      # Documentação acadêmica
│   ├── 📖 article.md               # Artigo principal (fonte)
│   ├── 📄 article.pdf              # Artigo final compilado
│   ├── 📚 references.bib           # Referências bibliográficas
│   ├── 🖼️ images/                  # Figuras e diagramas
│   └── ⚙️ Makefile                 # Compilação LaTeX
│
├── 🤖 mcp-openapi-server/          # Gerador automático MCP
│   ├── 📦 package.json             # Dependências e scripts
│   ├── 🔧 src/                     # Código fonte
│   ├── 🧪 test/                    # Testes unitários
│   └── 📖 README.md                # Documentação técnica
│
├── 💬 chat-client/                  # Cliente multi-servidor
│   ├── 🌐 chat.html                # Interface web
│   ├── ⚙️ backend-server.js        # Servidor backend
│   ├── 📦 package.json             # Scripts específicos do sistema
│   ├── 🧪 tests/                   # Testes E2E (Playwright)
│   └── 📊 test-results/            # Resultados experimentais
│
├── 🏭 equipments-dummy-app/         # App teste - Equipamentos
│   ├── 📦 package.json             # Scripts e dependências
│   └── 🔧 src/                     # API REST Hono.js + TypeScript
│
├── 👥 professionals-dummy-app/      # App teste - Profissionais  
│   ├── 📦 package.json             # Scripts e dependências
│   └── 🔧 src/                     # API REST Hono.js + TypeScript
│
└── 🔖 bookmarks/                    # Pesquisa organizada
    ├── 📚 bookmarks.json           # Links de referência
    └── 💾 save-bookmarks.sh        # Script de backup
```

---

## 📚 Citação Acadêmica

### 📄 **BibTeX Format**
```bibtex
@mastersthesis{zanoni2025openapi,
  title = {Transformando APIs em Interfaces Conversacionais: Validação da Abordagem OpenAPI-MCP para Agentes Baseados em IA},
  author = {Zanoni, Lucas de Castro},
  school = {Centro Universitário UniSATC},
  year = {2025},
  type = {Trabalho de Conclusão de Curso},
  program = {Engenharia de Software},
  address = {Criciúma, SC, Brasil},
  url = {https://github.com/Castrozan/TCC}
}
```

📋 **Outros formatos** (ABNT, APA, IEEE): [CITATION.md](CITATION.md)

---

## 👤 Autor & Contato

**Lucas de Castro Zanoni**  
📧 castro [dot] lucas290 [at] gmail [dot] com  
🐙 [@Castrozan](https://github.com/Castrozan)  
🎓 Graduando em Engenharia de Software - UniSATC

**Orientador**: Prof. Thyerri Fernandes Mezzari  
📧 thyerri [dot] mezzari [at] satc [dot] edu [dot] br

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.
