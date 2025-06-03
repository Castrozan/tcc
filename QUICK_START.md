# 🚀 Guia de Início Rápido - TCC OpenAPI-MCP

> **Comece a explorar o projeto em menos de 5 minutos**

---

## 🎯 Escolha seu Perfil

### 📖 **Sou Acadêmico/Pesquisador**
**Objetivo**: Entender a pesquisa, metodologia e contribuições científicas

#### ⚡ **Início Rápido (5 min)**
1. **📖 Leia o resumo**: [Artigo completo](article/article.pdf) - páginas 1-2
2. **🎯 Veja o problema**: [Pré-projeto](pre-projeto.md) - seção "PERGUNTA-PROBLEMA"
3. **📊 Confira resultados**: [README principal](README.md#📊-resultados-de-pesquisa)

#### 🔍 **Aprofundamento (15 min)**
1. **🔬 Metodologia**: [Seção 2 do artigo](article/article.md#2-procedimento-experimental)
2. **📈 Métricas**: [Tabelas de resultados](article/article.md#4-resultados-e-discussões)
3. **🔮 Trabalhos futuros**: [Considerações finais](article/article.md#5-considerações-finais)

#### 📚 **Estudo Completo (1h)**
- **📄 Artigo completo**: [article.pdf](article/article.pdf) (23 páginas)
- **📚 Referências**: [references.bib](article/references.bib) (50+ fontes)
- **📋 Índice completo**: [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)

---

### 💻 **Sou Desenvolvedor**
**Objetivo**: Entender a implementação técnica e usar as ferramentas

#### ⚡ **Teste Imediato (5 min)**
```bash
# Clone e teste rapidamente
git clone https://github.com/Castrozan/TCC.git
cd TCC/mcp-openapi-server

# Use via NPX (sem instalação local)
npx @ivotoby/openapi-mcp-server \
  --api-base-url https://jsonplaceholder.typicode.com \
  --openapi-spec https://jsonplaceholder.typicode.com/openapi.json
```

#### 🛠️ **Instalação Local (10 min)**
```bash
# 1. Instale dependências
cd TCC
npm install

# 2. Teste o gerador MCP
cd mcp-openapi-server
npm run build
npm test

# 3. Execute o cliente de chat
cd ../chat-client
npm run dev
# Acesse: http://localhost:5500
```

#### 🧪 **Desenvolvimento Completo (30 min)**
1. **🏗️ Arquitetura**: [README técnico](mcp-openapi-server/README.md)
2. **💬 Cliente**: [Chat client guide](chat-client/README.md)
3. **🧪 Testes**: Execute `npm test` em cada componente
4. **📖 API**: Explore [dummy apps](equipments-dummy-app/) como exemplo

---

### 🔬 **Sou Pesquisador em IA**
**Objetivo**: Avaliar a abordagem OpenAPI-MCP e reproduzir experimentos

#### ⚡ **Visão Geral (5 min)**
1. **🎯 Hipótese central**: [Introdução](article/article.md#1-introdução)
2. **🔬 Metodologia**: [Procedimento experimental](article/article.md#2-procedimento-experimental)
3. **📊 Validação**: [Resumo de resultados](README.md#🏆-principais-contribuições-científicas)

#### 🧪 **Reprodução de Experimentos (20 min)**
```bash
# 1. Clone o ambiente experimental
git clone https://github.com/Castrozan/TCC.git
cd TCC

# 2. Execute testes automatizados
cd chat-client
npm install
npm test  # Testes E2E com Playwright

# 3. Veja os dados coletados
ls test-results/
cat performance-test-result.json
cat ux-test-result.json  
cat security-test-result.json
```

#### 📈 **Análise Aprofundada (1h)**
1. **📊 Dados brutos**: [test-results/](chat-client/test-results/)
2. **🔍 Código experimental**: [tests/](chat-client/tests/)
3. **📋 Framework**: [Critérios de avaliação](article/article.md#222-critérios-de-avaliação-e-operacionalização-de-métricas)
4. **🔮 Extensões**: [Trabalhos futuros](article/article.md#52-limitações-e-trabalhos-futuros)

---

### 🏢 **Sou Profissional/Empresa**
**Objetivo**: Avaliar aplicabilidade prática e potencial comercial

#### ⚡ **Avaliação Executiva (5 min)**
1. **🎯 Valor de negócio**: [README - Impacto esperado](README.md#🌟-impacto-esperado)
2. **📊 ROI técnico**: [Resultados validados](README.md#✅-resultados-experimentais-validados)
3. **⚖️ Limitações**: [Considerações finais](article/article.md#52-limitações-e-trabalhos-futuros)

#### 🔧 **Prova de Conceito (15 min)**
```bash
# Teste com sua própria API
npx @ivotoby/openapi-mcp-server \
  --api-base-url https://sua-api.com \
  --openapi-spec https://sua-api.com/docs/openapi.json \
  --headers "Authorization:Bearer SEU_TOKEN"

# Configure com Claude Desktop
# Veja: README.md seção "Integrando com Claude Desktop"
```

#### 📋 **Análise de Viabilidade (30 min)**
1. **🏗️ Arquitetura**: [System architecture](article/images/metodos/system-architecture.jpg)
2. **🔒 Segurança**: [Análise de segurança](article/article.md#43-análise-de-segurança)
3. **⚡ Performance**: [Métricas de performance](article/article.md#41-métricas-de-performance)
4. **💰 Custos**: Avalie complexidade vs. automação obtida

---

## 🎓 **Para Orientadores e Avaliadores**

### 📋 **Checklist de Avaliação Rápida**
- [ ] **Problema relevante?** → [Introdução](article/article.md#1-introdução)
- [ ] **Metodologia rigorosa?** → [Seção 2](article/article.md#2-procedimento-experimental)
- [ ] **Implementação funcional?** → [Testes E2E](chat-client/tests/)
- [ ] **Resultados válidos?** → [Seção 4](article/article.md#4-resultados-e-discussões)
- [ ] **Contribuições claras?** → [Considerações finais](article/article.md#5-considerações-finais)

### 🔍 **Pontos de Validação**
1. **📊 Reprodutibilidade**: Todos os comandos documentados funcionam
2. **📈 Dados**: Resultados coletados automaticamente e salvos em JSON
3. **🔬 Controle**: Variáveis experimentais identificadas e controladas
4. **📚 Literatura**: 50+ referências acadêmicas relevantes
5. **🔮 Futuro**: Direções de pesquisa específicas e viáveis

---

## 🤔 **Dúvidas Frequentes**

### **❓ "É só um protótipo ou funciona de verdade?"**
✅ **Funciona**: 100% dos testes automatizados passam, APIs reais integradas, métricas objetivas coletadas.

### **❓ "Qual o diferencial científico?"**
🔬 **Primeiro estudo sistemático** de integração OpenAPI-MCP com validação experimental rigorosa.

### **❓ "Posso usar em produção?"**
⚠️ **Prova de conceito**: Validado em cenários controlados. Para produção, considere limitações identificadas.

### **❓ "Como citar este trabalho?"**
📚 **BibTeX Format**:
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

## 📞 **Precisa de Ajuda?**

### 🆘 **Suporte Rápido**
- **🐛 Bug/Erro**: [GitHub Issues](https://github.com/Castrozan/TCC/issues)
- **💬 Discussão**: [GitHub Discussions](https://github.com/Castrozan/TCC/discussions)
- **📧 Contato direto**: castro.lucas290@gmail.com

### 📚 **Recursos Adicionais**
- **📋 Índice completo**: [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)
- **🔧 Guias técnicos**: [mcp-openapi-server/README.md](mcp-openapi-server/README.md)
- **🧪 Detalhes de teste**: [chat-client/README.md](chat-client/README.md)

---

## 🎯 **Próximos Passos Sugeridos**

### **Se gostou do projeto:**
1. ⭐ **Star no GitHub** para acompanhar atualizações
2. 🔄 **Fork** para experimentar suas próprias modificações
3. 💬 **Compartilhe** com colegas interessados em IA conversacional
4. 📚 **Cite** em trabalhos relacionados

### **Se quer contribuir:**
1. 📖 **Leia** o [índice de documentação](DOCUMENTATION_INDEX.md)
2. 🔍 **Explore** o [código fonte](mcp-openapi-server/src/)
3. 🧪 **Execute** os [testes](chat-client/tests/)
4. 💡 **Sugira** melhorias via [Issues](https://github.com/Castrozan/TCC/issues)

---

*Este guia é atualizado conforme feedback dos usuários. Sugestões são bem-vindas!* 