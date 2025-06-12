### **Slide 1: Cover Slide**

* **Content:**

  * Title: **TRANSFORMANDO APIS EM INTERFACES CONVERSACIONAIS: VALIDAÇÃO DA ABORDAGEM OPENAPI-MCP PARA AGENTES BASEADOS EM IA**
  * Orientando: **Lucas de Castro Zanoni**
  * Orientador: **Prof. Fernandes Mezzari**
  * Logo of your course and UniSATC.

* **Why:** Standard introduction to clearly identify your topic and participants.

---

### **Slide 2: Introdução**

* **Content (bullet points only):**

  * Crescente complexidade de interfaces digitais.
  * Dificuldade dos usuários em interagir com sistemas web.
  * Ascensão de modelos de linguagem (LLMs).
  * Pergunta de pesquisa:

    * “Como a combinação OpenAPI e MCP pode facilitar a integração de agentes conversacionais baseados em IA com sistemas web existentes?”
  * Metodologia científica experimental.

* **Why:** Sets clear context, justifies relevance, and explicitly states the research question and methodological approach.

---

### **Slide 3: Objetivos**

* **Content (bullet points only):**

  * **Objetivo Geral:**

    * Avaliar a viabilidade técnica da abordagem OpenAPI-MCP para integração de IA.
  * **Objetivos Específicos:**

    * Desenvolver gerador automático de servidores MCP.
    * Implementar cliente de chat multi-servidor MCP.
    * Avaliar desempenho, segurança e usabilidade da abordagem experimentalmente.

* **Why:** Provides a structured, concise overview of your goals, guiding audience expectations clearly.

---

### **Slide 4: Abordagem Teórica**

* **Content (bullet points):**

  * Interfaces conversacionais e LLMs (\[OpenAI, Anthropic, 2022-2024]).
  * Especificação OpenAPI (\[OpenAPI Initiative, 2023]).
  * Model Context Protocol (Anthropic, 2024).
  * Testes de segurança e usabilidade (\[NIST, OWASP, 2023-2025]).

* **Why:** Clearly lists theoretical concepts underpinning the research; brief and focused.

---

### **Slides 5-8: Fundamentação Teórica**

* **Slide 5 (LLMs e Interfaces Conversacionais):**

  * Avanço dos modelos (GPT-4, function calling, contexto expandido).
  * Impacto na interação humano-computador.

* **Slide 6 (OpenAPI):**

  * Padrão de documentação e interoperabilidade.
  * Esquemas de segurança e autenticação.

* **Slide 7 (Model Context Protocol):**

  * Padrão aberto de comunicação padronizada.
  * Cliente-servidor para modelos de linguagem.

* **Slide 8 (Critérios de Segurança e Usabilidade):**

  * Red teaming e prompt injection.
  * Testes end-to-end com Playwright.

* **Why:** Organizes key theoretical information into clear and manageable segments.

---

### **Slide 9: Metodologia**

* **Content (concise bullets):**

  * Revisão sistemática da literatura.
  * Desenvolvimento experimental estruturado (POC).
  * Testes automatizados para métricas objetivas.

* **Why:** Clearly outlines your methodological rigor without repeating previous details.

---

### **Slides 10-15: Desenvolvimento e Análise**

**Slide 10: Arquitetura Geral**

* **Image:** High-level architecture diagram.
* **Speech:** Briefly explain the roles of frontend, backend, MCP servers, GPT-4, and external APIs.
* **Why:** Visually introduces the main architecture, easing audience comprehension.

**Slide 11: Gerador Automático MCP**

* **Image:** Diagram of MCP generation architecture (Parser → Semantic Mapping → Tool Generation).
* **Speech:** Summarize steps of automatic generation and its significance for scalability.
* **Why:** Highlights your unique contribution clearly.

**Slide 12: Cliente Multi-servidor MCP**

* **Image:** Diagram showing dynamic server discovery and request routing.
* **Speech:** Explain briefly why dynamic coordination matters practically.
* **Why:** Clarifies complexity in a practical, understandable way.

**Slide 13: Interface Experimental**

* **Image:** Screenshot of chat interface used in experiments.
* **Speech:** Mention simplicity and consistency of interface as critical for fair tests.
* **Why:** Visually emphasizes experimental standardization.

**Slide 14: Workflow da Interação**

* **Image:** Workflow integration diagram showing user → LLM → MCP server → API and back.
* **Speech:** Briefly walk audience through typical request-response flow.
* **Why:** Helps audience grasp clearly how your system operates.

**Slide 15: Exemplo de conversão OpenAPI→MCP**

* **Image:** Side-by-side snippet of OpenAPI specification and corresponding MCP tool.
* **Speech:** Explain the conversion’s clarity and preservation of API semantics.
* **Why:** Concrete visual demonstration of automatic conversion process.

---

### **Slide 16: Resultados de Performance**

* **Content (Table simplified):**

  * Tempo médio resposta: \~3.7s, Taxa sucesso: 100%, Tamanho médio resposta: \~312 chars.
* **Speech:** Mention briefly performance variability, suggesting future optimization.
* **Why:** Clear presentation of key results and transparent about limitations.

---

### **Slide 17: Resultados Segurança**

* **Content (table):**

  * SQL Injection, Command Injection, Data Extraction, Privilege Escalation – 100% bloqueado.
* **Speech:** Highlight robustness of initial security measures and potential further testing.
* **Why:** Reinforces your system’s trustworthiness and experimental rigor.

---

### **Slide 18: Resultados de Usabilidade**

* **Content:**

  * Precisão (3.5), Clareza (4.0), Utilidade (4.3), Pontuação geral (4.0).
* **Speech:** Briefly note overall satisfactory user experience and areas of potential improvement.
* **Why:** Shows clear empirical evaluation of user-focused metrics.

---

### **Slide 19: Discussão e Contribuições**

* **Content:**

  * Conversão automática eficaz (100% endpoints).
  * Segurança básica robusta.
  * Experiência do usuário satisfatória.
  * Limitações destacadas: variabilidade desempenho, escala pequena.

* **Speech:** Summarize overall strengths and limitations, highlighting your main contribution.

* **Why:** Clearly consolidates your findings, preparing audience for final thoughts.

---

### **Slide 20: Considerações Finais**

* **Content (bullets):**

  * Pergunta de pesquisa validada positivamente.
  * Conversão OpenAPI→MCP promissora e eficaz.
  * Democratização tecnológica via interfaces conversacionais.
  * Necessidade futura de testes mais abrangentes.

* **Why:** Reiterates key results and reinforces your main message succinctly.

---

### **Slide 21: Referências Bibliográficas**

* **Content:** ABNT-formatted references (top \~4-5 most critical references).

* **Why:** Demonstrates proper academic rigor without overwhelming the audience.

---

### **Slide 22: Final Slide (Cover repeated)**

* Duplicate Slide 1 for standard academic formality.

---

### **General Image Notes:**

* All images should be clear, visually appealing, and simple enough to be quickly understood.
* Always explain briefly the visuals to connect clearly to your spoken points.
* Images must directly support your spoken narrative.

This comprehensive plan clearly outlines exactly what each slide must contain, the reason behind each element, and detailed guidance on integrating visual and spoken content effectively.
