# Presentation Plan

## Editor guidelines
- This should be a exact copy of the content in the powerpoint presentation, so only content that should be in the presentation should be here.
- The presentation should be in portuguese.
- The presentation should be in the ABNT format.
- Slide definitions should be in the following format:
  - **Slide number: title**
    - **Title**
      - Title of the slide.
    - **Content (bullet points, images, tables, etc.):**
      - Bullet points example:
        - Sub-bullet point 1;
        - Sub-bullet point 2;
        - Sub-bullet point 3.
      - Images example:
        - ![Image description](images/image.png)
      - Tables example:
        | Header 1 | Header 2 |
        | -------- | -------- |
        | Data 1   | Data 2   |
    - **Why:**
      - Why the content is important.
    - **Speech script:**
      - Speech script for the slide.
    - **Speech instructions:**
      - Instructions on pronunciation, emphasis, timing, and delivery guidance.
- Bullet points should be in the following format (ending with semicolon and the last with a dot):
  - Sub-bullet point 1;
  - Sub-bullet point 2;
  - Sub-bullet point 3.

## Presentation

### **Slide 1: Capa**
- **Title**
  - TRANSFORMANDO APIS EM INTERFACES CONVERSACIONAIS: VALIDAÇÃO DA ABORDAGEM OPENAPI-MCP PARA AGENTES BASEADOS EM IA
- **Content (bullet points, images, tables, etc.):**
  - Orientando: Lucas de Castro Zanoni;
  - Orientador: Prof. Fernandes Mezzari;
  - Centro Universitário UniSATC;
  - Criciúma;
  - 2025.
- **Why:**
  - Apresentação padrão para identificar claramente o tópico e participantes.
- **Speech script:**
  - 
- **Speech instructions:**
  - 

### **Slide 2: Introdução**
- **Title**
  - Introdução
- **Content (bullet points, images, tables, etc.):**
  - **Contexto:** Crescente complexidade das interfaces digitais modernas (RAPP et al., 2018; KOCABALLI et al., 2019);
  - **Problema:** Barreiras de acessibilidade e usabilidade para usuários (LISTER et al., 2020; DENG et al., 2023);
  - **Oportunidade:** Ascensão dos modelos de linguagem (LLMs) como GPT-4 (OPENAI, 2022; ANTHROPIC, 2024);
  - **Potencial:** Interfaces conversacionais naturais para democratização tecnológica (FAST et al., 2017; GUO et al., 2024);
  - **Pergunta de pesquisa:** "Como a combinação OpenAPI e MCP pode facilitar a integração eficiente e segura de agentes conversacionais baseados em IA com sistemas web existentes?";
  - **Metodologia:** Validação experimental através de prova de conceito.
- **Why:**
  - Estabelece o contexto do problema, justifica a relevância da pesquisa, apresenta a oportunidade tecnológica e define claramente a pergunta de pesquisa e metodologia.
- **Speech script:**
  - Vivemos em uma era de crescente complexidade nas interfaces digitais. Como investigado por Rapp e colaboradores, os sistemas web modernos, embora poderosos, frequentemente criam barreiras significativas para os usuários, especialmente aqueles com necessidades especiais ou menor proficiência tecnológica. Conforme demonstrado por Lister e seus colegas, essas interfaces apresentam desafios significativos de acessibilidade, enquanto Deng destaca como a crescente complexidade da web dificulta o acesso pleno às suas funcionalidades. Paralelamente, testemunhamos uma revolução com a ascensão dos modelos de linguagem de grande escala, como o GPT-4 e outras versões que todos utilizamos, que consolidaram interfaces conversacionais como uma realidade robusta e eficaz. Como evidenciado por Fast e sua equipe, agentes conversacionais podem transformar tarefas complexas em interações naturais, e Guo demonstrou como estes sistemas podem melhorar significativamente a usabilidade em ambientes inteligentes. Esta convergência abre uma oportunidade única para democratizar o acesso a tecnologias complexas através de interfaces naturais em linguagem humana. Nossa pergunta central de pesquisa é: como a combinação da especificação OpenAPI com o protocolo MCP pode facilitar a integração eficiente e segura de agentes conversacionais baseados em IA com sistemas web existentes? Para responder a esta questão, desenvolvemos uma abordagem experimental rigorosa através de uma prova de conceito que validará a viabilidade técnica desta integração.
- **Speech instructions:**
  - Enfatizar "crescente complexidade" e "barreiras significativas" para destacar o problema. Pausar brevemente após mencionar cada autor para dar credibilidade às afirmações. Aumentar o tom na pergunta de pesquisa para destacar sua importância. Pronunciar os nomes dos autores claramente em ingles.

### **Slide 3: Objetivos**
- **Title**
  - Objetivos
- **Content (bullet points, images, tables, etc.):**
  - **Objetivo Geral:**
    - Investigar viabilidade técnica da abordagem OpenAPI-MCP para democratizar o acesso a sistemas WEB através de agentes conversacionais baseados em IA;
  - **Objetivos Específicos:**
    - Desenvolver um gerador automático de servidores MCP a partir de especificações OpenAPI 3.0+;
    - Implementar um client LLM chat capaz de gerenciar múltiplos servidores simultaneamente;
    - Validar experimentalmente a integração através de métricas de desempenho, segurança e usabilidade;
- **Why:**
  - Define claramente o escopo da pesquisa, estabelece objetivos mensuráveis e específicos, e demonstra a estrutura metodológica para validação experimental da hipótese central.
- **Speech script:**
  - Nossa pesquisa possui um objetivo geral ambicioso de investigar a viabilidade técnica da abordagem OpenAPI-MCP para democratizar o acesso a sistemas WEB. Esta democratização ocorre através da criação de agentes conversacionais baseados em inteligência artificial que permitem aos usuários interagir com sistemas complexos usando linguagem natural. Para alcançar este objetivo geral, definimos quatro objetivos específicos estruturados. Primeiro, desenvolver um gerador automático de servidores MCP a partir de especificações OpenAPI, eliminando a necessidade de desenvolvimento manual recorrente. Segundo, implementar um cliente de chat capaz de gerenciar múltiplos servidores MCP simultaneamente, demonstrando a viabilidade da orquestração distribuída. Terceiro, validar experimentalmente a integração através de métricas rigorosas de desempenho, segurança e usabilidade, garantindo avaliação científica objetiva. Por fim, estabelecer evidências preliminares convincentes que justifiquem investigações futuras mais aprofundadas, reconhecendo que este é um estudo inicial de validação conceitual que abrirá caminho para pesquisas mais abrangentes.
- **Speech instructions:**
  - Enfatizar "democratização" e "linguagem natural" como conceitos centrais. Pausar brevemente após cada objetivo específico numerado. Destacar "evidências preliminares" para contextualizar o escopo inicial da pesquisa.

### **Slide 4: Abordagem Teórica**
- **Title**
  - Abordagem Teórica
- **Content (bullet points, images, tables, etc.):**
  - **Interfaces Conversacionais:** Teoria de interação humano-computador e usabilidade (KOCABALLI et al., 2019; LISTER et al., 2020);
  - **Modelos de Linguagem:** Arquitetura Transformer e function calling (OPENAI, 2023; ANTHROPIC, 2024);
  - **Padronização de APIs:** Especificação OpenAPI 3.0+ para interoperabilidade (OpenAPI Initiative, 2023);
  - **Protocolo MCP:** Comunicação padronizada entre LLMs e sistemas externos (ANTHROPIC, 2024);
  - **Avaliação Experimental:** Frameworks de segurança e testes end-to-end (NIST, 2023; OWASP, 2025).
- **Why:**
  - Estabelece fundamentos teóricos sólidos que sustentam a pesquisa, demonstrando conhecimento das principais teorias e frameworks relevantes para validação científica da abordagem proposta.
- **Speech script:**
  - Nossa pesquisa fundamenta-se em cinco pilares teóricos principais que convergem para viabilizar a integração OpenAPI-MCP. Primeiro, nos baseamos na teoria de interfaces conversacionais e interação humano-computador, conforme estudado por Kocaballi e Lister, que demonstraram como essas interfaces podem melhorar significativamente a usabilidade e acessibilidade de sistemas complexos. Segundo, utilizamos os avanços em modelos de linguagem baseados na arquitetura Transformer, especialmente as capacidades de function calling desenvolvidas pela OpenAI e Anthropic, que permitem conversão automática de linguagem natural em chamadas de função estruturadas. Terceiro, adotamos a especificação OpenAPI como padrão para documentação e interoperabilidade de APIs, amplamente reconhecida pela indústria como solução robusta para contratos de interface. Quarto, implementamos o Model Context Protocol, um padrão emergente desenvolvido pela Anthropic que estabelece comunicação padronizada entre modelos de linguagem e sistemas externos, eliminando integrações customizadas. Por fim, aplicamos frameworks estabelecidos de avaliação experimental, incluindo diretrizes de segurança do NIST e OWASP para testes de robustez, além de metodologias de testes end-to-end que garantem validação científica rigorosa dos resultados obtidos.
- **Speech instructions:**
  - Enfatizar cada "pilar teórico" numerado para estruturar claramente a fundamentação. Pausar brevemente após mencionar cada framework/autor para dar credibilidade. Destacar "convergem" para mostrar integração teórica.

### **Slide 5: LLMs e Interfaces Conversacionais**
- **Title**
  - LLMs e Interfaces Conversacionais
- **Content (bullet points, images, tables, etc.):**
  - **Evolução Tecnológica:** BERT (2018) para compreensão textual, GPT-3 (2020) para capacidades generativas e few-shot learning;
  - **Arquitetura Transformer:** Base tecnológica que revolucionou o processamento de linguagem natural;
  - **Function Calling:** Conversão automática de linguagem natural em chamadas de funções estruturadas (GPT-4);
  - **Contexto Expandido:** Janelas de até 32.000 tokens para conversas prolongadas e processamento complexo;
  - **Interface Robusta:** Consolidação como interfaces conversacionais eficazes para integração com sistemas.
- **Why:**
  - Apresenta a evolução histórica e as capacidades técnicas fundamentais dos LLMs que tornam possível a abordagem OpenAPI-MCP, demonstrando como avanços específicos habilitaram interfaces conversacionais robustas.
- **Speech script:**
  - Os modelos de linguagem de grande escala passaram por uma evolução revolucionária nos últimos anos. O BERT, desenvolvido pelo Google em 2018, revolucionou a compreensão textual através de sua arquitetura transformer bidirecional, processando contexto em ambas as direções simultaneamente. O GPT-3, lançado em 2020, ampliou dramaticamente as capacidades generativas e introduziu o paradigma de aprendizado com poucos exemplos, conhecido como few-shot learning. Estas inovações baseiam-se na arquitetura Transformer, que se tornou a base tecnológica que revolucionou todo o processamento de linguagem natural. O GPT-4 trouxe uma capacidade fundamental para nossa pesquisa: o function calling, que permite conversão automática de instruções em linguagem natural em chamadas de funções estruturadas. Esta funcionalidade é essencial para nossa integração OpenAPI-MCP. A evolução dos contextos expandidos também é notável: enquanto o GPT-4 suporta até 32 mil tokens, os modelos mais recentes de 2025, como GPT-4.1, Claude-4-Sonnet e Gemini-2.5-Pro, já superam 120 mil tokens, permitindo processamento ainda mais complexo. Esses avanços consolidaram os LLMs como interfaces conversacionais robustas e eficazes, capazes de servir como ponte natural entre usuários e sistemas técnicos complexos.
- **Speech instructions:**
  - Enfatizar as datas (2018, 2020) para mostrar progressão temporal. Destacar "function calling" como conceito técnico crucial. Pausar após "Transformer" para dar ênfase à importância da arquitetura.

### **Slide 6: OpenAPI**
- **Title**
  - OpenAPI
- **Content (bullet points, images, tables, etc.):**
  - Padrão de documentação e interoperabilidade;
  - Esquemas de segurança e autenticação.
- **Why:**
  - 
- **Speech script:**
  - 

### **Slide 7: Model Context Protocol**
- **Title**
  - Model Context Protocol (MCP)
- **Content (bullet points, images, tables, etc.):**
  - Padrão aberto de comunicação padronizada;
  - Cliente-servidor para modelos de linguagem.
- **Why:**
  - 
- **Speech script:**
  - 

### **Slide 8: Critérios de Segurança e Usabilidade**
- **Title**
  - Critérios de Segurança e Usabilidade
- **Content (bullet points, images, tables, etc.):**
  - Red teaming e prompt injection;
  - Testes end-to-end com Playwright.
- **Why:**
  - 
- **Speech script:**
  - 

### **Slide 9: Metodologia**
- **Title**
  - Metodologia
- **Content (bullet points, images, tables, etc.):**
  - Revisão sistemática da literatura;
  - Desenvolvimento experimental estruturado (POC);
  - Testes automatizados para métricas objetivas.
- **Why:**
  - Delineia claramente o rigor metodológico sem repetir detalhes já apresentados.
- **Speech script:**
  - 

### **Slide 10: Arquitetura Geral**
- **Title**
  - Arquitetura Geral
- **Content (bullet points, images, tables, etc.):**
  - ![Diagrama da arquitetura de alto nível](images/metodos/system-architecture.jpg)
- **Why:**
  - Introduz visualmente a arquitetura principal, facilitando a compreensão da audiência.
- **Speech script:**
  - 

### **Slide 11: Gerador Automático MCP**
- **Title**
  - Gerador Automático MCP
- **Content (bullet points, images, tables, etc.):**
  - ![Diagrama da arquitetura de geração MCP](images/desenvolvimento/mcp-generator-architecture.jpg)
- **Why:**
  - Destaca claramente sua contribuição única.
- **Speech script:**
  - 

### **Slide 12: Cliente Multi-servidor MCP**
- **Title**
  - Cliente Multi-servidor MCP
- **Content (bullet points, images, tables, etc.):**
  - ![Diagrama mostrando descoberta dinâmica de servidores](images/chat/chat-server-configuration.jpg)
- **Why:**
  - Esclarece a complexidade de forma prática e compreensível.
- **Speech script:**
  - 

### **Slide 13: Interface Experimental**
- **Title**
  - Interface Experimental
- **Content (bullet points, images, tables, etc.):**
  - ![Screenshot da interface de chat](images/chat/chat-interface.jpg)
- **Why:**
  - Enfatiza visualmente a padronização experimental.
- **Speech script:**
  - 

### **Slide 14: Workflow da Interação**
- **Title**
  - Workflow da Interação
- **Content (bullet points, images, tables, etc.):**
  - ![Diagrama do workflow de integração](images/metodos/workflow-integration.jpg)
- **Why:**
  - Ajuda a audiência a compreender claramente como o sistema opera.
- **Speech script:**
  - 

### **Slide 15: Exemplo de Conversão OpenAPI→MCP**
- **Title**
  - Exemplo de Conversão OpenAPI→MCP
- **Content (bullet points, images, tables, etc.):**
  - ![Especificação OpenAPI](images/openapi-mcp/snippet-openapi-path-spec.jpg)
  - ![Ferramenta MCP correspondente](images/openapi-mcp/mcp-tool-format.jpg)
- **Why:**
  - Demonstração visual concreta do processo de conversão automática.
- **Speech script:**
  - 

### **Slide 16: Resultados de Performance**
- **Title**
  - Resultados de Performance
- **Content (bullet points, images, tables, etc.):**
  | Métrica                | Valor      |
  | ---------------------- | ---------- |
  | Tempo médio resposta   | ~3.7s      |
  | Taxa sucesso           | 100%       |
  | Tamanho médio resposta | ~312 chars |
- **Why:**
  - Apresentação clara dos resultados principais e transparência sobre limitações.
- **Speech script:**
  - 

### **Slide 17: Resultados de Segurança**
- **Title**
  - Resultados de Segurança
- **Content (bullet points, images, tables, etc.):**
  | Categoria de Ataque  | Taxa de Proteção |
  | -------------------- | ---------------- |
  | SQL Injection        | 100%             |
  | Command Injection    | 100%             |
  | Data Extraction      | 100%             |
  | Privilege Escalation | 100%             |
- **Why:**
  - Reforça a confiabilidade do sistema e rigor experimental.
- **Speech script:**
  - 

### **Slide 18: Resultados de Usabilidade**
- **Title**
  - Resultados de Usabilidade
- **Content (bullet points, images, tables, etc.):**
  | Métrica         | Pontuação |
  | --------------- | --------- |
  | Precisão        | 3.5       |
  | Clareza         | 4.0       |
  | Utilidade       | 4.3       |
  | Pontuação geral | 4.0       |
- **Why:**
  - Mostra avaliação empírica clara de métricas focadas no usuário.
- **Speech script:**
  - 

### **Slide 19: Discussão e Contribuições**
- **Title**
  - Discussão e Contribuições
- **Content (bullet points, images, tables, etc.):**
  - Conversão automática eficaz (100% endpoints);
  - Segurança básica robusta;
  - Experiência do usuário satisfatória;
  - Limitações destacadas: variabilidade desempenho, escala pequena.
- **Why:**
  - Consolida claramente os achados, preparando a audiência para considerações finais.
- **Speech script:**
  - 

### **Slide 20: Considerações Finais**
- **Title**
  - Considerações Finais
- **Content (bullet points, images, tables, etc.):**
  - Pergunta de pesquisa validada positivamente;
  - Conversão OpenAPI→MCP promissora e eficaz;
  - Democratização tecnológica via interfaces conversacionais;
  - Necessidade futura de testes mais abrangentes.
- **Why:**
  - Reitera resultados principais e reforça a mensagem central de forma sucinta.
- **Speech script:**
  - 

### **Slide 21: Referências Bibliográficas**
- **Title**
  - Referências Bibliográficas
- **Content (bullet points, images, tables, etc.):**
  - 
- **Why:**
  - Demonstra rigor acadêmico adequado sem sobrecarregar a audiência.
- **Speech script:**
  - 

### **Slide 22: Capa Final**
- **Title**
  - TRANSFORMANDO APIS EM INTERFACES CONVERSACIONAIS: VALIDAÇÃO DA ABORDAGEM OPENAPI-MCP PARA AGENTES BASEADOS EM IA
- **Content (bullet points, images, tables, etc.):**
  - Orientando: Lucas de Castro Zanoni;
  - Orientador: Prof. Fernandes Mezzari;
  - Centro Universitário UniSATC;
  - Criciúma;
  - 2025.
- **Why:**
  - Duplicação do slide de capa para formalidade acadêmica padrão.
- **Speech script:**
  - 
