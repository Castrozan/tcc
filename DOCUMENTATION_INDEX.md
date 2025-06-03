# 📚 Índice de Documentação - TCC OpenAPI-MCP

> **Guia completo para navegação em toda a documentação do projeto**

---

## 🎯 **Documentação Principal**

### 📖 **Pesquisa Acadêmica**
| Documento           | Descrição                                            | Link                                       |
| ------------------- | ---------------------------------------------------- | ------------------------------------------ |
| **Artigo Completo** | Documento acadêmico final em PDF                     | [📄 article.pdf](article/article.pdf)       |
| **Artigo Fonte**    | Texto acadêmico em Markdown (editável)               | [📝 article.md](article/article.md)         |
| **Pré-Projeto**     | Proposta inicial: problema, objetivos, justificativa | [🎯 pre-projeto.md](pre-projeto.md)         |
| **Referências**     | Bibliografia completa em BibTeX                      | [📚 references.bib](article/references.bib) |

### 🔬 **Metodologia e Resultados**
| Seção do Artigo               | Conteúdo                                  | Páginas  |
| ----------------------------- | ----------------------------------------- | -------- |
| **Introdução**                | Contexto, problema de pesquisa, objetivos | p. 1-3   |
| **Procedimento Experimental** | Metodologia, materiais, métodos           | p. 4-8   |
| **Desenvolvimento**           | Implementação, arquitetura, componentes   | p. 9-15  |
| **Resultados e Discussões**   | Métricas validadas, análise empírica      | p. 16-20 |
| **Considerações Finais**      | Conclusões, limitações, trabalhos futuros | p. 21-23 |

---

## 🛠️ **Documentação Técnica**

### 🤖 **Componente 1: Gerador MCP Automático**
| Arquivo              | Descrição                           | Localização                                                  |
| -------------------- | ----------------------------------- | ------------------------------------------------------------ |
| **README Principal** | Documentação completa da ferramenta | [mcp-openapi-server/README.md](mcp-openapi-server/README.md) |
| **Código Fonte**     | Implementação do gerador            | [mcp-openapi-server/src/](mcp-openapi-server/src/)           |
| **Testes Unitários** | Validação de componentes            | [mcp-openapi-server/test/](mcp-openapi-server/test/)         |
| **Configuração**     | package.json, tsconfig, build       | [mcp-openapi-server/](mcp-openapi-server/)                   |

### 💬 **Componente 2: Cliente de Chat Multi-Servidor**
| Arquivo               | Descrição                        | Localização                                                    |
| --------------------- | -------------------------------- | -------------------------------------------------------------- |
| **README do Cliente** | Guia de uso e arquitetura        | [chat-client/README.md](chat-client/README.md)                 |
| **Interface Web**     | Frontend minimalista para testes | [chat-client/chat.html](chat-client/chat.html)                 |
| **Servidor Backend**  | Lógica de coordenação MCP        | [chat-client/backend-server.js](chat-client/backend-server.js) |
| **Testes E2E**        | Suite Playwright para validação  | [chat-client/tests/](chat-client/tests/)                       |
| **Resultados**        | Dados experimentais coletados    | [chat-client/test-results/](chat-client/test-results/)         |

### 🏭 **Componente 3: Aplicações de Teste**
| Sistema           | Descrição                             | Documentação                                                           | Código                                                       |
| ----------------- | ------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Equipamentos**  | API REST para gestão de equipamentos  | [equipments-dummy-app/README.md](equipments-dummy-app/README.md)       | [equipments-dummy-app/src/](equipments-dummy-app/src/)       |
| **Profissionais** | API REST para gestão de profissionais | [professionals-dummy-app/README.md](professionals-dummy-app/README.md) | [professionals-dummy-app/src/](professionals-dummy-app/src/) |

---

## 📊 **Dados e Resultados Experimentais**

### 🔢 **Métricas Quantitativas**
| Métrica                    | Resultado                      | Localização no Artigo | Dados Brutos                                                             |
| -------------------------- | ------------------------------ | --------------------- | ------------------------------------------------------------------------ |
| **Performance**            | 3.757ms médio (100% sucesso)   | Tabela 1, p. 16       | [performance-test-result.json](chat-client/performance-test-result.json) |
| **Experiência do Usuário** | 4.0/5.0 geral                  | Tabela 2, p. 17       | [ux-test-result.json](chat-client/ux-test-result.json)                   |
| **Segurança**              | 100% proteção (16/16 ataques)  | Tabela 3, p. 18       | [security-test-result.json](chat-client/security-test-result.json)       |
| **Conversão OpenAPI→MCP**  | 100% sucesso (10/10 endpoints) | Tabela 4, p. 19       | Código do gerador                                                        |

### 📈 **Visualizações e Diagramas**
| Figura       | Descrição                          | Localização                                                                                                            |
| ------------ | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Figura 1** | Interface padronizada de usuário   | [images/chat/chat-interface.jpg](article/images/chat/chat-interface.jpg)                                               |
| **Figura 2** | Arquitetura do sistema OpenAPI-MCP | [images/metodos/system-architecture.jpg](article/images/metodos/system-architecture.jpg)                               |
| **Figura 3** | Workflow de integração detalhado   | [images/metodos/workflow-integration.jpg](article/images/metodos/workflow-integration.jpg)                             |
| **Figura 4** | Arquitetura do gerador MCP         | [images/desenvolvimento/mcp-generator-architecture.jpg](article/images/desenvolvimento/mcp-generator-architecture.jpg) |

---

## 🔄 **Processo de Desenvolvimento**

### 📝 **Workflow Acadêmico**
| Etapa             | Ferramenta     | Arquivo                                  | Comando           |
| ----------------- | -------------- | ---------------------------------------- | ----------------- |
| **Escrita**       | Markdown       | [article.md](article/article.md)         | Editor de texto   |
| **Conversão**     | Pandoc + LaTeX | [Makefile](article/Makefile)             | `make pdf`        |
| **Bibliografia**  | BibTeX         | [references.bib](article/references.bib) | Gestão automática |
| **Versionamento** | Git            | Todo o projeto                           | `git commit`      |

### 🧪 **Validação Experimental**
| Teste             | Ferramenta       | Comando                             | Resultados                                 |
| ----------------- | ---------------- | ----------------------------------- | ------------------------------------------ |
| **E2E Frontend**  | Playwright       | `npm test` (⚠️ Configurado para Nix) | [test-results/](chat-client/test-results/) |
| **Performance**   | Custom scripts   | `npm run test:performance`          | JSON logs                                  |
| **Segurança**     | Red team scripts | `npm run test:security`             | Security logs                              |
| **UX**            | Custom scripts   | `npm run test:ux`                   | UX metrics                                 |
| **Unitários MCP** | Vitest           | `npm test`                          | Console output                             |

**⚠️ Nota sobre Testes**: Os testes E2E estão configurados para sistemas Nix. Para outros sistemas, instale o Playwright com `npx playwright install` antes de executar.

---

## 🔍 **Navegação por Tópicos**

### 🎯 **Se você quer entender...**

#### **...o problema de pesquisa:**
1. 📖 Leia: [Introdução do artigo](article/article.md#1-introdução)
2. 🎯 Confira: [Pré-projeto](pre-projeto.md)

#### **...a metodologia científica:**
1. 🔬 Estude: [Seção 2 - Procedimento Experimental](article/article.md#2-procedimento-experimental)
2. 📊 Veja: [Critérios de avaliação](article/article.md#222-critérios-de-avaliação-e-operacionalização-de-métricas)

#### **...a implementação técnica:**
1. 🛠️ Explore: [Seção 3 - Desenvolvimento](article/article.md#3-desenvolvimento)
2. 🤖 Teste: [mcp-openapi-server/](mcp-openapi-server/)
3. 💬 Use: [chat-client/](chat-client/)

#### **...os resultados obtidos:**
1. 📊 Analise: [Seção 4 - Resultados](article/article.md#4-resultados-e-discussões)
2. 📈 Veja dados: [test-results/](chat-client/test-results/)

#### **...como reproduzir:**
1. 🚀 Siga: [Guia de instalação](README.md#🚀-começando)
2. 🧪 Execute: [Comandos de teste](README.md#🧪-executando-os-testes)

---

## 📚 **Recursos de Pesquisa**

### 🔖 **Material de Referência**
| Recurso       | Descrição                            | Link                                       |
| ------------- | ------------------------------------ | ------------------------------------------ |
| **Bookmarks** | Links organizados da pesquisa        | [bookmarks.json](bookmarks/bookmarks.json) |
| **Citação**   | Formatos para referenciar o trabalho | [CITATION.md](CITATION.md)                 |

### 🌐 **Links Externos Importantes**
| Recurso           | Descrição                         | URL                                                   |
| ----------------- | --------------------------------- | ----------------------------------------------------- |
| **MCP Docs**      | Documentação oficial do protocolo | https://modelcontextprotocol.io/                      |
| **OpenAPI Spec**  | Especificação OpenAPI 3.0+        | https://spec.openapis.org/oas/v3.0.3                  |
| **Anthropic MCP** | Anúncio do protocolo              | https://www.anthropic.com/news/model-context-protocol |

---

## 🎓 **Para Acadêmicos e Pesquisadores**

### 📋 **Checklist de Validação**
- [ ] **Reprodutibilidade**: Todos os experimentos podem ser reproduzidos
- [ ] **Transparência**: Metodologia completamente documentada
- [ ] **Rigor**: Métricas objetivas e controle de variáveis
- [ ] **Limitações**: Claramente identificadas e discutidas
- [ ] **Trabalhos Futuros**: Direções específicas propostas

### 🔬 **Contribuições Científicas**
1. **Primeira validação sistemática** da integração OpenAPI-MCP
2. **Framework reproduzível** para avaliação de agentes conversacionais
3. **Evidências empíricas** sobre viabilidade técnica
4. **Metodologia experimental** adaptável para outras pesquisas

---

## 🚀 **Para Desenvolvedores**

### 💻 **Pontos de Entrada Técnicos**
| Interesse                | Comece Aqui                                                 | Próximos Passos                                          |
| ------------------------ | ----------------------------------------------------------- | -------------------------------------------------------- |
| **Usar a ferramenta**    | [README principal](README.md)                               | [Guia de instalação](README.md#🚀-começando)              |
| **Entender arquitetura** | [Documentação MCP](mcp-openapi-server/README.md)            | [Código fonte](mcp-openapi-server/src/)                  |
| **Executar testes**      | [Cliente de chat](chat-client/README.md)                    | [Testes E2E](chat-client/tests/)                         |
| **Contribuir**           | [Issues no GitHub](https://github.com/Castrozan/TCC/issues) | [Fork do projeto](https://github.com/Castrozan/TCC/fork) |

### 🔧 **Comandos Essenciais**
```bash
# Instalação completa do projeto
git clone https://github.com/Castrozan/TCC.git && cd TCC

# Executar gerador MCP OpenAPI
cd mcp-openapi-server && npm install && npm run build

# Executar cliente de chat
cd ../chat-client && npm install && npm run dev

# Executar aplicações de teste
cd ../equipments-dummy-app && npm install && npm run dev    # Porta 3000
cd ../professionals-dummy-app && npm install && npm run dev # Porta 3001

# Executar testes (sistema Nix - para outros, veja notas acima)
cd ../chat-client && npm test

# ⚠️ IMPORTANTE: Não há package.json raiz - cada componente deve ser 
# configurado individualmente conforme mostrado acima
```

---

## 📞 **Contato e Suporte**

### 👤 **Equipe**
- **Autor**: Lucas de Castro Zanoni (castro.lucas290@gmail.com)
- **Orientador**: Prof. Thyerri Fernandes Mezzari (thyerri.mezzari@satc.edu.br)

### 🐛 **Reportar Problemas**
- **Issues**: [GitHub Issues](https://github.com/Castrozan/TCC/issues)
- **Discussões**: [GitHub Discussions](https://github.com/Castrozan/TCC/discussions)

### 📄 **Licença**
Este projeto está sob licença MIT. Veja [LICENSE](LICENSE) para detalhes.

---

*Este índice é atualizado continuamente para refletir a evolução do projeto e facilitar a navegação na documentação.* 