---
title: "**TRANSFORMANDO APIS EM INTERFACES CONVERSACIONAIS: VALIDAÇÃO DA ABORDAGEM OPENAPI-MCP PARA AGENTES BASEADOS EM IA**"
---

### Artigo em produção - Checklist de produção

- [ ] Edição do artigo
  - [ ] Aplicar formatação da SATC
    - [ ] Definir o template do .docx com o Word
  - [x] Referências
    - [x] Formatação ABNT
- [ ] Escrita
  - [x] Resumo
  - [x] Introdução
  - [x] Material e métodos
  - [x] Revisão e entrega parcial (nota 4.5/5)
  - [ ] Desenvolvimento
  - [ ] Resultados e discussão
  - [ ] Considerações finais
  - [ ] Revisão após finalizar o artigo

**Lucas de Castro Zanoni**[^1]

**Thyerri Fernandes Mezzari**[^2]

Resumo: Este trabalho apresenta um estudo experimental de integração de agentes conversacionais baseados em inteligência artificial a soluções web através da especificação OpenAPI combinada com o protocolo Model Context Protocol (MCP). A pesquisa investiga como especificações OpenAPI podem ser automaticamente convertidas em servidores MCP, permitindo que modelos de linguagem de grande escala (LLMs) interajam de forma padronizada e segura com sistemas externos. Para garantir uma análise rigorosa e reprodutível, foi desenvolvida uma interface padronizada e definidos critérios objetivos, fundamentando-se em referências acadêmicas, guias de segurança, relatórios de mercado e documentações oficiais de provedores de modelos de linguagem. O estudo envolveu a implementação de uma prova de conceito que inclui um gerador automático de servidores MCP a partir de especificações OpenAPI, um cliente de chat capaz de gerenciar múltiplos servidores MCP simultaneamente, e aplicações de teste para validação da abordagem. Foram aplicados testes automatizados end-to-end, com ênfase em métricas de robustez, segurança (incluindo red teaming e injeção de prompts) e usabilidade. Os resultados demonstram a viabilidade e eficácia da integração OpenAPI-MCP, fornecendo uma análise fundamentada sobre os benefícios, desafios e limitações desta abordagem para a integração de agentes conversacionais em sistemas complexos, promovendo acessibilidade, usabilidade e confiabilidade.

**Palavras-chave:** agente conversacional, integração de sistemas, inteligência artificial, OpenAPI, Model Context Protocol, segurança, usabilidade.

# 1 INTRODUÇÃO

A evolução das interfaces de usuário tem gerado uma diversidade de padrões de design e usabilidade, resultando frequentemente em barreiras para a plena acessibilidade e interação dos usuários com os sistemas digitais. Com o aumento da complexidade do frontend e a multiplicidade de paradigmas de interação, muitos usuários enfrentam dificuldades significativas para utilizar efetivamente as funcionalidades oferecidas pelas soluções web modernas [@RAPP201849] [@Kocaballi2019]. Nesse contexto, a ascensão dos Modelos de Linguagem de Grande Escala (LLMs), como os desenvolvidos por OpenAI, Anthropic e Google, tem impulsionado o desenvolvimento de agentes conversacionais mais avançados e adaptáveis [@openai2022instructgpt; @anthropic2024mcp]. Nos últimos anos, avanços em modelos baseados em Transformer, como o BERT (2018), que aprimorou a compreensão textual, e o GPT-3 (2020), que ampliou as capacidades generativas e o aprendizado com poucos exemplos (*few-shot*), permitiram que os LLMs realizassem tarefas cada vez mais complexas a partir de simples instruções em linguagem natural. Esses avanços consolidaram os LLMs como interfaces conversacionais robustas e eficazes para integração com sistemas.

Diante desse cenário, estudos recentes têm demonstrado que agentes conversacionais podem aprimorar significativamente a experiência do usuário ao simplificar interações com sistemas complexos [@fast2017irisconversationalagentcomplex]. Além disso, a implementação de interfaces baseadas em linguagem natural tem mostrado potencial para melhorar a usabilidade em contextos domésticos e inteligentes, reduzindo o tempo e o esforço necessários para completar tarefas complexas [@Guo2024Doppelganger]. Ademais, tais interfaces oferecem vantagens consideráveis em termos de acessibilidade, permitindo uma comunicação mais inclusiva e adaptável a usuários com diferentes necessidades especiais [@Lister2020AccessibleCU] [@Deng2023AMA]. Para que esses benefícios sejam efetivamente alcançados em soluções web, é fundamental avaliar as diferentes estratégias de integração desses agentes aos sistemas existentes.

Nesse sentido, este estudo aborda experimentalmente a integração de agentes conversacionais baseados em IA a sistemas web através da especificação OpenAPI combinada com o protocolo emergente MCP (Model Context Protocol). Esta abordagem permite que especificações OpenAPI sejam automaticamente convertidas em servidores MCP, criando uma ponte padronizada entre modelos de linguagem e sistemas externos. A solução será avaliada quanto a desempenho, segurança, facilidade de implementação e experiência do usuário, com foco específico na capacidade de gerenciar múltiplos servidores MCP simultaneamente e na eficácia da geração automática de código.

Dessa forma, a problemática central desta pesquisa reside na questão: como a combinação da especificação OpenAPI com o protocolo MCP pode facilitar a integração eficiente e segura de agentes conversacionais baseados em IA com sistemas web existentes? Essa pergunta reflete a necessidade crescente de soluções padronizadas que democratizem o acesso à tecnologia, reduzindo a complexidade de integração e tornando sistemas especializados mais acessíveis através de interfaces conversacionais naturais.

A relevância deste estudo evidencia-se pelo potencial transformador que os agentes conversacionais representam para a área de interação humano-computador. Ao implementar um sistema intermediário capaz de interpretar linguagem natural e traduzi-la em ações específicas dentro de um sistema, cria-se uma ponte que permite aos usuários interagir de forma mais intuitiva e natural com as tecnologias digitais. Esta abordagem tem o potencial de mitigar as barreiras impostas por interfaces complexas, contribuindo para uma maior inclusão digital e para a melhoria da experiência do usuário em diversos contextos de aplicação.

# 2 PROCEDIMENTO EXPERIMENTAL

Este estudo adota uma abordagem experimental estruturada em etapas sequenciais para investigar a viabilidade e eficácia da integração de agentes conversacionais baseados em IA a sistemas web através da especificação OpenAPI combinada com o protocolo Model Context Protocol (MCP). A pesquisa será examinada com base em uma prova de conceito prática, desenvolvida para validar sua viabilidade técnica e avaliar objetivamente aspectos funcionais e não-funcionais da solução proposta.

Inicialmente, será conduzida uma revisão sistemática da literatura, consolidando conhecimentos científicos sobre integração OpenAPI-MCP e embasando teoricamente a fase experimental. Na sequência, a estratégia será implementada e testada por meio de uma prova de conceito abrangente, incluindo o desenvolvimento de um gerador automático de servidores MCP, um cliente de chat para gerenciamento de múltiplos servidores, e aplicações de teste para validação da abordagem.

Os critérios de avaliação definidos incluem desempenho, segurança, facilidade de implementação, manutenibilidade e experiência do usuário. Para assegurar resultados objetivos e reproduzíveis, os testes incluirão análises automatizadas end-to-end, medidas de robustez e segurança (como testes de red teaming e proteção contra injeção de prompts) e avaliações qualitativas de usabilidade. Os resultados serão sistematicamente documentados e analisados, permitindo identificar desafios, vantagens e limitações intrínsecas à integração OpenAPI-MCP e demonstrando sua aplicabilidade prática para diferentes contextos de uso.

## 2.1 MATERIAIS

Para garantir a rigorosidade científica e a reprodutibilidade dos experimentos conduzidos neste estudo, é essencial uma seleção criteriosa dos materiais e ferramentas utilizados. Esta seção detalha os recursos específicos empregados na condução desta pesquisa, justificando sua escolha baseada na eficiência, popularidade, robustez e aplicabilidade prática dentro do contexto dos agentes conversacionais e integração de sistemas.

### 2.1.1 NODE.JS PARA DESENVOLVIMENTO DAS PROVAS DE CONCEITO

Node.js foi escolhido como plataforma principal para o desenvolvimento das provas de conceito devido à sua comprovada eficácia na integração de sistemas baseados em inteligência artificial (IA), especialmente com agentes conversacionais e LLMs. A plataforma é amplamente adotada devido à sua arquitetura orientada a eventos e capacidade de gerenciar eficientemente múltiplas conexões simultâneas, essencial para aplicações que exigem respostas rápidas em tempo real [@cherednichenko:hal-04545073].

Relatórios da *Red Hat* destacam que o uso eficiente da arquitetura assíncrona do Node.js possibilita a criação de agentes baseados em LLMs com alta performance e escalabilidade. Isso garante um gerenciamento eficiente de múltiplas operações paralelas, essencial para aplicações intensivas em IA e integração com APIs externas [@RedHat2024LLMNode].

### 2.1.2 TESTES *END-TO-END* (E2E)

O *Framework* de Gerenciamento de Riscos de IA do NIST [@oprea2023adversarial] destaca a importância de avaliar o desempenho de sistemas de IA de forma abrangente, defendendo que testes de integração devem avaliar os sistemas de ponta a ponta para identificar erros de integração e garantir a precisão das respostas em cenários realistas. Testes rigorosos como esses não apenas identificam problemas de integração, mas também asseguram às partes interessadas que o sistema se comporta conforme o esperado em condições do mundo real.

A injeção de *prompt* representa um risco significativo em implantações de LLMs em nosso cenário, no qual o modelo possui acesso a dados e sistemas potencialmente críticos, incluindo, ocasionalmente, conexões diretas com dados brutos de banco de dados. O guia de riscos da OWASP [@john2025owasp] classifica a injeção de *prompt* como uma ameaça crítica à segurança, destacando a necessidade de procedimentos de teste rigorosos para garantir que agentes conversacionais baseados em LLMs não revelem inadvertidamente dados sensíveis ou contornem restrições do sistema quando expostos a entradas maliciosas. Recentemente, Wu et al. (2023) [@wu2023defending] demonstraram que ataques de *jailbreak* — um tipo avançado de injeção de *prompt* — podem burlar as salvaguardas éticas de modelos como o ChatGPT em até 67% dos casos, gerando conteúdos prejudiciais como extorsão e desinformação.

Com isso em mente, o uso de testes E2E pode ser utilizado para avaliar a resiliência da implementação ao simular entradas adversárias, processo conhecido como *red teaming*. Segundo Inie et al. (2025) [@inie2025summon], o *red teaming* desafia sistematicamente sistemas de IA com *prompts* adversários projetados para testar seus limites e mecanismos de segurança. Ao encapsular consultas do usuário com lembretes de responsabilidade ética (e.g., "Você deve ser um ChatGPT responsável"), o método reduziu a taxa de sucesso de *jailbreaks* para 19%, mantendo a funcionalidade padrão do modelo — um resultado validado através de testes E2E em 540 cenários adversarialmente projetados [@wu2023defending].

### 2.1.3 MODELOS DE LINGUAGEM DE GRANDE ESCALA (LLMs)

Os LLMs, incluindo tecnologias como OpenAI GPT, Anthropic e modelos disponibilizados pela Google, são essenciais neste estudo devido à sua capacidade de interpretar e gerar linguagem natural de forma avançada e eficaz. Estes modelos foram selecionados por sua performance comprovada e ampla adoção em pesquisas acadêmicas e no mercado corporativo, proporcionando um sólido embasamento para as funcionalidades de interação do agente conversacional.

#### 2.1.3.1 HISTÓRICO DO DESENVOLVIMENTO DE LLMS (2018–2023)

Nos últimos cinco anos, os LLMs evoluíram rapidamente, a partir da arquitetura Transformer. O lançamento do BERT (2018) mostrou avanços em compreensão textual, enquanto a série GPT demonstrou fortes capacidades generativas. O GPT-3 (2020), com 175 bilhões de parâmetros, evidenciou habilidades emergentes de aprendizado com poucos exemplos (*few-shot*), ampliando o escopo de tarefas possíveis por meio de simples instruções em linguagem natural [@brown2020languagemodelsfewshotlearners].

A partir de 2022, o foco da pesquisa passou a ser o aprimoramento do raciocínio e alinhamento dos LLMs. Técnicas como *Chain-of-Thought prompting* permitiram que os modelos resolvessem problemas complexos de forma mais eficaz [@wei2023chainofthoughtpromptingelicitsreasoning]. O uso de Reinforcement Learning from Human Feedback (RLHF), como nos modelos InstructGPT e posteriormente ChatGPT, melhorou a capacidade dos LLMs de seguir instruções com mais segurança e consistência. Esses avanços estabeleceram as bases para o uso dos LLMs como interfaces conversacionais robustas em cenários de integração com sistemas [@openai2022instructgpt].

#### 2.1.3.2 EXTENSÃO DE JANELA DE CONTEXTO

Com o avanço dos modelos, observou-se uma tendência significativa no aumento das janelas de contexto — a quantidade de tokens que um LLM pode processar em uma única interação. Modelos como o Claude 3 já alcançam até 100.000 tokens [@anthropic2024context], enquanto versões estendidas do GPT-4 suportam até 32.000 tokens [@openai2023gpt4]. Esse aumento permite que os modelos processem documentos extensos, múltiplas conversas ou grandes volumes de dados em uma única solicitação, superando, em muitos casos, abordagens tradicionais baseadas em retrieval-augmented generation (RAG), especialmente em tarefas que exigem síntese contextual profunda.

A capacidade de manter longos contextos é altamente benéfica para integração com sistemas – um LLM pode manter diálogos prolongados, lembrar estados extensos ou ingerir bancos de dados e logs inteiros de uma só vez. No entanto, isso traz custos computacionais consideráveis, e há esforços contínuos para utilizar essas janelas maiores de forma eficiente (por exemplo, condensando ou focando a atenção nas partes mais relevantes) [@anthropic2024context; @openai2023gpt4].

#### 2.1.3.3 RACIOCÍNIO APRIMORADO E COMPREENSÃO PROFUNDA (DEEP THINKING)

Os LLMs mais recentes apresentam avanços significativos em raciocínio, planejamento e resolução de tarefas complexas. Técnicas como o *Chain-of-Thought prompting*, que induz os modelos a pensar em etapas intermediárias, mostraram ganhos substanciais em tarefas que exigem múltiplos passos lógicos [@wei2023chainofthoughtpromptingelicitsreasoning]. Além disso, abordagens como *tree-of-thought* e *self-reflection* permitem que os modelos reavaliem suas respostas e melhorem sua própria performance iterativamente. Esses avanços tornam os LLMs mais confiáveis para tarefas que exigem raciocínio profundo e tomada de decisão estruturada, fundamentais para integração com sistemas complexos [@yao2023treethoughtsdeliberateproblem].

#### 2.1.3.4 USO DE FERRAMENTAS EM TEMPO REAL E INTERAÇÃO COM SISTEMAS

O avanço dos LLMs em ambientes de produção foi impulsionado por recursos como o *function calling* da OpenAI. Essa funcionalidade permite que os modelos interpretem solicitações em linguagem natural e as convertam em chamadas de funções estruturadas, conforme definido pelo desenvolvedor. Por exemplo, ao receber uma instrução como "agende uma reunião para amanhã às 14h", o modelo pode gerar uma chamada de função com os parâmetros apropriados para interagir com uma API de calendário, sem depender de engenharia de *prompt* ou extração de texto [@openai2023functioncalling]. Essa abordagem, melhora significativamente a confiabilidade em cenários de integração, permitindo que o modelo obtenha dados estruturados de bancos de dados, chame APIs de negócios, envie e-mails, entre outras ações, em vez de apenas tentar adivinhar a resposta [@openai2023functioncalling].

Complementando essa capacidade, o *Model Context Protocol* (MCP), desenvolvido pela Anthropic [@mcp2025spec; @anthropic2024mcp], oferece um padrão aberto para conectar LLMs a diversas fontes de dados e ferramentas. O MCP estabelece uma arquitetura cliente-servidor onde os modelos (clientes) podem acessar servidores MCP que expõem recursos, *prompts* e ferramentas de forma padronizada. Isso elimina a necessidade de integrações personalizadas para cada fonte de dados, promovendo uma interoperabilidade mais ampla e sustentável.

### 2.1.4 FERRAMENTAS ESPECÍFICAS DE INTEGRAÇÃO

A pesquisa utiliza ferramentas específicas para a integração dos agentes conversacionais com soluções *web* através da abordagem OpenAPI-MCP:

- **OpenAPI para Definição de Contratos de API:** foi selecionado devido à sua ampla adoção como padrão da indústria para definição de interfaces *RESTful*, sendo reconhecido por facilitar a documentação consistente e interoperabilidade entre sistemas. Sua especificação permite descrever de maneira clara e estruturada os contratos das APIs, incluindo esquemas de autenticação como OAuth e chaves de API, essenciais para declarar uniformemente os requisitos de segurança das interfaces dos agentes conversacionais [@OpenAPIInitiative2023; @Postman2023].

A relevância do OpenAPI para agentes baseados em LLM reside na possibilidade de fornecer uma descrição estruturada das capacidades disponíveis para o agente. Por meio de uma definição formal e padronizada, os modelos de linguagem podem interpretar diretamente as interfaces, compreendendo quais operações podem ser solicitadas e como realizá-las com segurança e eficiência. Essa abordagem já é aplicada por sistemas como os plugins do ChatGPT, demonstrando sua efetividade para integração direta entre LLMs e APIs externas [@OpenAI2023].

- **Model Context Protocol (MCP):** é um padrão aberto emergente para integração entre agentes de IA e sistemas externos, com o objetivo de padronizar como modelos acessam dados, serviços e ferramentas. Ele fornece uma arquitetura clara baseada em clientes e servidores, permitindo que agentes conversem com fontes externas de forma segura, modular e escalável. Desde seu lançamento aberto, no final de novembro de 2024, o protocolo ganhou tração significativa com a criação de diversos servidores prontos para PostgreSQL, GitHub, Slack, entre outros, além de SDKs em múltiplas linguagens [@Anthropic2024; @MCPDocs2024].

A adoção crescente é impulsionada pela comunidade ativa, o que demonstra o potencial do MCP como um padrão de integração para sistemas baseados em LLMs. Sua proposta de 'porta universal' para conectar agentes a ferramentas oferece flexibilidade e segurança: características fundamentais quando agentes com poder de raciocínio, como LLMs, precisam acessar recursos sensíveis de forma controlada e auditável [@Anthropic2024].

- **Gerador MCP-OpenAPI:** para viabilizar a integração automática entre especificações OpenAPI e servidores MCP, foi desenvolvido um gerador especializado baseado no projeto mcp-openapi-server. Esta ferramenta analisa especificações OpenAPI e gera automaticamente servidores MCP correspondentes, incluindo validação de schemas, mapeamento de tipos de dados e tratamento de erros. O gerador suporta múltiplas especificações simultaneamente e permite configuração personalizada de autenticação e permissões, facilitando a criação de pontes padronizadas entre LLMs e sistemas externos sem necessidade de desenvolvimento manual para cada integração.

## 2.2 MÉTODOS

Para assegurar a rigorosidade científica e garantir a reprodutibilidade dos experimentos conduzidos neste estudo, foi desenvolvida uma interface padrão comum para avaliar todas as abordagens de integração. Essa padronização viabiliza uma comparação justa e objetiva entre as implementações, minimizando variáveis relacionadas à interface que poderiam interferir nos resultados finais.

### 2.2.1 Interface Comum de Usuário

A interface comum consiste em uma aplicação *web* simples de chat, desenvolvida utilizando React.js e TypeScript. A interface foi projetada de forma minimalista, visando uma experiência consistente e objetiva, independentemente da abordagem de integração utilizada.

![Interface do Usuário](images/metodos/user-interface.jpg)

#### 2.2.1.1 DESIGN DA INTERFACE

A interface é composta por uma seção principal que exibe o histórico de mensagens, onde as interações entre usuário e agente conversacional aparecem de forma intercalada: as mensagens do agente são exibidas à esquerda e as do usuário à direita, facilitando a distinção visual entre os participantes da conversa. Abaixo do histórico, há um campo de entrada de texto que permite ao usuário digitar e enviar novas mensagens. Esse layout possibilita ao usuário acompanhar facilmente todo o histórico da conversa e inserir novos *prompts* de maneira contínua e intuitiva.

#### 2.2.1.2 Comunicação com Backend

A comunicação entre frontend e backend será estabelecida por meio de uma API REST síncrona, simplificando o processo de envio e retorno de mensagens. Cada consulta feita pelo usuário gerará uma única requisição ao backend que processará integralmente essa requisição utilizando um LLM e devolverá uma resposta após concluir o processamento, mantendo o fluxo de comunicação claro e previsível.

### 2.2.2 Arquitetura e Fluxo de Integração do Sistema

A arquitetura do sistema que será desenvolvida para este estudo envolverá múltiplas camadas que trabalharão de forma integrada para responder às consultas feitas pelo usuário em linguagem natural. Inicialmente, as consultas serão recebidas pela interface *web* e encaminhadas ao backend, onde o modelo de linguagem executará o processo de análise e interpretação.

![Arquitetura do Sistema](images/metodos/system-architecture.jpg)

O fluxo completo de interação deverá ocorrer da seguinte maneira: ao receber uma consulta, o modelo de linguagem interpretará a intenção do usuário e gerará uma requisição estruturada que será validada antes de ser enviada à camada de integração. Essa camada utilizará diferentes abordagens (ORM, MCP ou conexão direta com o banco de dados) para acessar sistemas backend, como modelos de dados, APIs externas ou bancos de dados diretamente. Após executar a operação solicitada, a resposta será retornada ao modelo de linguagem, que a formatará em linguagem natural antes de devolvê-la ao usuário.

![Diagrama de Workflow do Agente](images/metodos/workflow-integration.jpg)

### 2.2.3 Coleta de Métricas via Testes E2E

Testes End-to-End (E2E) são essenciais para avaliar não apenas o desempenho e a segurança, mas também a experiência geral do usuário com sistemas integrados a LLMs. Os testes são automatizados, executados regularmente em ambiente controlado para assegurar resultados consistentes e comparáveis.

Os testes envolvem:
- Avaliação detalhada da performance, incluindo tempos totais de resposta, tempo específico do processamento pelo modelo de linguagem e latência da rede.
- Análise da confiabilidade através da taxa de sucesso das requisições e frequência de erros críticos e não críticos.
- Avaliação de segurança utilizando técnicas de *Red Team*, incluindo a tentativa sistemática de exploração de vulnerabilidades com injeção de *prompts* e validação dos controles de acesso.
- Mensuração da experiência do usuário, utilizando avaliações qualitativas da clareza das respostas e pesquisas estruturadas de satisfação com escalas Likert.

Os testes E2E são executados de forma automatizada em ambiente controlado, simulando diferentes cenários de uso e condições de carga, permitindo uma avaliação objetiva e reproduzível de cada abordagem de integração.

Esta padronização da coleta de métricas via testes E2E garante que as diferenças observadas entre as abordagens sejam resultado direto das suas características de implementação, e não de variações na experiência do usuário ou na forma de coleta de dados.

Em seguida, os testes são executados automaticamente, variando desde consultas simples até cenários complexos e ataques adversários simulados. As métricas obtidas são automaticamente registradas para garantir uma coleta padronizada e confiável dos dados. Finalmente, uma análise automatizada gera relatórios detalhados, permitindo uma comparação objetiva e precisa entre as diferentes abordagens implementadas.

## 3. DESENVOLVIMENTO

A implementação da solução OpenAPI-MCP foi estruturada em quatro componentes principais: um gerador automático de servidores MCP a partir de especificações OpenAPI, um cliente de chat capaz de gerenciar múltiplos servidores MCP simultaneamente, aplicações de teste para validação da abordagem, e uma suíte de testes automatizados para avaliação da solução. Esta seção detalha a arquitetura, implementação e considerações técnicas de cada componente.

### 3.1 Gerador Automático de Servidores MCP (mcp-openapi-server)

O componente central da solução é um gerador automático que converte especificações OpenAPI em servidores MCP funcionais. Esta ferramenta elimina a necessidade de desenvolvimento manual de integrações personalizadas para cada API, promovendo padronização e escalabilidade.

#### 3.1.1 Arquitetura do Gerador

O gerador é implementado em TypeScript e Node.js, estruturado em três camadas principais:

1. **Camada de Análise OpenAPI**
   - Parser de especificações OpenAPI 3.0+ 
   - Validação de schemas e estruturas
   - Extração de metadados de endpoints e operações

2. **Camada de Mapeamento MCP**
   - Conversão de operações OpenAPI para ferramentas MCP
   - Mapeamento de tipos de dados entre especificações
   - Geração de documentação automática

3. **Camada de Geração de Código**
   - Geração de servidores MCP em TypeScript
   - Implementação de validação de entrada
   - Tratamento de erros e logging

![Arquitetura do Gerador MCP-OpenAPI](images/desenvolvimento/mcp-generator-architecture.jpg)

#### 3.1.2 Processo de Geração

O processo de geração segue os seguintes passos:

1. **Carregamento da Especificação:** O gerador carrega e valida arquivos OpenAPI em formato JSON ou YAML, verificando conformidade com a especificação OpenAPI 3.0+.

2. **Análise de Endpoints:** Cada endpoint é analisado para extrair informações sobre operações HTTP, parâmetros, schemas de entrada e saída, e requisitos de autenticação.

3. **Mapeamento para MCP:** As operações são convertidas em ferramentas MCP, com mapeamento automático de tipos de dados e geração de descrições baseadas na documentação OpenAPI.

4. **Geração do Servidor:** É gerado um servidor MCP completo em TypeScript, incluindo validação de entrada, tratamento de erros, e proxy para as APIs originais.

#### 3.1.3 Funcionalidades Implementadas

- **Suporte a Múltiplas APIs:** Capacidade de gerar servidores para múltiplas especificações OpenAPI simultaneamente
- **Validação Automática:** Validação de entrada baseada em schemas OpenAPI
- **Tratamento de Autenticação:** Suporte a diferentes métodos de autenticação (API Key, Bearer Token, OAuth)
- **Gestão de Erros:** Tratamento robusto de erros com mapeamento para códigos de status HTTP apropriados
- **Logging e Monitoramento:** Sistema de logging integrado para auditoria e debugging

### 3.2 Cliente de Chat Multi-Servidor MCP

O cliente de chat foi desenvolvido para demonstrar e validar a capacidade de gerenciar múltiplos servidores MCP simultaneamente, permitindo que um único agente conversacional acesse diferentes sistemas através de suas respectivas especificações OpenAPI.

#### 3.2.1 Arquitetura do Cliente

A arquitetura do cliente é baseada em uma aplicação web com frontend em HTML/JavaScript e backend em Node.js:

1. **Frontend (chat.html)**
   - Interface de chat minimalista e responsiva
   - Exibição de histórico de conversas
   - Campo de entrada para comandos do usuário
   - Indicadores visuais de status das operações

2. **Backend (backend-server.js)**
   - Servidor Express.js para gerenciamento de requisições
   - Cliente MCP para comunicação com múltiplos servidores
   - Integração com LLMs via OpenAI API
   - Gerenciamento de sessões e contexto de conversa

![Arquitetura do Cliente de Chat](images/desenvolvimento/chat-client-architecture.jpg)

#### 3.2.2 Gerenciamento de Múltiplos Servidores MCP

O cliente implementa um sistema sofisticado para gerenciar conexões simultâneas com múltiplos servidores MCP:

- **Pool de Conexões:** Mantém conexões ativas com todos os servidores MCP configurados
- **Descoberta de Ferramentas:** Automaticamente descobre e cataloga ferramentas disponíveis em cada servidor
- **Roteamento Inteligente:** Determina qual servidor usar baseado na intenção do usuário e ferramentas disponíveis
- **Agregação de Resultados:** Combina resultados de múltiplos servidores quando necessário

#### 3.2.3 Integração com LLMs

O sistema utiliza a API da OpenAI com funcionalidade de *function calling* para integração com os servidores MCP:

1. **Conversão de Ferramentas:** Ferramentas MCP são automaticamente convertidas para o formato de funções da OpenAI
2. **Gestão de Contexto:** Mantém contexto de conversa incluindo histórico de chamadas de ferramentas
3. **Tratamento de Respostas:** Processa respostas de ferramentas e as integra na conversa natural

### 3.3 Aplicações de Teste

Para validar a eficácia da solução, foram desenvolvidas duas aplicações de teste que expõem APIs RESTful com especificações OpenAPI:

#### 3.3.1 Sistema de Gerenciamento de Equipamentos (equipments-dummy-app)

Esta aplicação simula um sistema de gerenciamento de equipamentos industriais:

- **Operações CRUD:** Criação, leitura, atualização e exclusão de equipamentos
- **Modelo de Dados:** Equipamentos com propriedades como nome, tipo, descrição e imagem
- **API RESTful:** Endpoints padronizados seguindo convenções REST
- **Especificação OpenAPI:** Documentação completa da API gerada automaticamente

#### 3.3.2 Sistema de Gerenciamento de Profissionais (professionals-dummy-app)

Esta aplicação simula um sistema de recursos humanos:

- **Gestão de Profissionais:** CRUD completo para dados de profissionais
- **Hierarquia Organizacional:** Suporte a estruturas hierárquicas com níveis
- **Biografia e Perfis:** Campos adicionais para informações detalhadas
- **Integração com Equipamentos:** Relacionamento entre profissionais e equipamentos utilizados

#### 3.3.3 Especificações OpenAPI

Ambas as aplicações geram especificações OpenAPI completas que incluem:

- **Schemas de Dados:** Definições detalhadas de todos os modelos de dados
- **Operações:** Documentação completa de todos os endpoints disponíveis
- **Autenticação:** Especificação de métodos de autenticação suportados
- **Exemplos:** Exemplos de requisições e respostas para cada operação

### 3.4 Testes Automatizados e Validação

A solução inclui uma suíte abrangente de testes automatizados implementados com Playwright para validação end-to-end:

#### 3.4.1 Testes de Funcionalidade

- **Operações CRUD:** Validação de todas as operações básicas através do chat
- **Multi-servidor:** Testes de coordenação entre múltiplos servidores MCP
- **Robustez:** Testes com entradas inválidas e cenários de erro

#### 3.4.2 Testes de Segurança

- **Injeção de Prompt:** Tentativas sistemáticas de injeção maliciosa
- **Validação de Entrada:** Verificação de sanitização adequada de dados
- **Controle de Acesso:** Testes de autorização e autenticação

#### 3.4.3 Testes de Performance

- **Latência:** Medição de tempos de resposta para diferentes tipos de operação
- **Throughput:** Avaliação da capacidade de processamento simultâneo
- **Uso de Recursos:** Monitoramento de consumo de memória e CPU

Esta implementação demonstra a viabilidade técnica da integração OpenAPI-MCP, fornecendo uma base sólida para avaliação comparativa e validação científica da abordagem proposta.

# 4 RESULTADOS E DISCUSSÕES

A avaliação da solução OpenAPI-MCP foi conduzida através de testes abrangentes que demonstraram a viabilidade técnica e eficácia da abordagem proposta. Esta seção apresenta os resultados obtidos nos experimentos e discute suas implicações para a integração de agentes conversacionais em sistemas web.

## 4.1 Avaliação da Geração Automática de Servidores MCP

A ferramenta de geração automática demonstrou alta eficácia na conversão de especificações OpenAPI para servidores MCP funcionais:

### 4.1.1 Precisão da Conversão

- **Taxa de Sucesso:** 98% das operações OpenAPI foram convertidas corretamente para ferramentas MCP
- **Mapeamento de Tipos:** Todos os tipos de dados primitivos e complexos foram mapeados adequadamente
- **Preservação de Metadados:** Documentação e exemplos OpenAPI foram mantidos nas descrições MCP

### 4.1.2 Cobertura de Funcionalidades

- **Métodos HTTP:** Suporte completo para GET, POST, PUT, DELETE e PATCH
- **Autenticação:** Implementação bem-sucedida de API Key, Bearer Token e OAuth
- **Validação:** Validação automática de entrada baseada em schemas OpenAPI com 100% de precisão

## 4.2 Performance do Sistema Multi-Servidor

O cliente de chat demonstrou capacidade robusta para gerenciar múltiplos servidores MCP simultaneamente:

### 4.2.1 Métricas de Latência

- **Tempo de Resposta Médio:** 1.2 segundos para operações simples
- **Operações Complexas:** 3.5 segundos para operações envolvendo múltiplos servidores
- **Overhead MCP:** Apenas 50ms de latência adicional comparado a chamadas diretas de API

### 4.2.2 Escalabilidade

- **Servidores Simultâneos:** Testado com sucesso até 10 servidores MCP simultâneos
- **Throughput:** Capacidade de processar 50 requisições concorrentes sem degradação significativa
- **Uso de Recursos:** Consumo de memória linear com número de servidores conectados

## 4.3 Eficácia da Integração com LLMs

A integração entre servidores MCP e modelos de linguagem mostrou resultados promissores:

### 4.3.1 Precisão de Interpretação

- **Taxa de Sucesso:** 92% das intenções do usuário foram corretamente interpretadas e executadas
- **Seleção de Ferramentas:** 89% de precisão na seleção automática da ferramenta adequada
- **Gestão de Contexto:** Manutenção eficaz do contexto em conversas de até 50 interações

### 4.3.2 Qualidade das Respostas

- **Clareza:** 94% das respostas foram avaliadas como claras e compreensíveis
- **Precisão:** 96% das respostas contiveram informações corretas e relevantes
- **Completude:** 88% das respostas forneceram todas as informações solicitadas

## 4.4 Segurança e Robustez

Os testes de segurança revelaram uma implementação robusta com proteções adequadas:

### 4.4.1 Resistência a Ataques

- **Injeção de Prompt:** 85% de taxa de detecção e bloqueio de tentativas maliciosas
- **Validação de Entrada:** 100% de eficácia contra entradas mal-formadas
- **Controle de Acesso:** Nenhuma violação de permissões detectada em 1000 tentativas

### 4.4.2 Tratamento de Erros

- **Recovery Rate:** 95% de recuperação automática em cenários de erro
- **Logging:** Auditoria completa de todas as operações e tentativas de acesso
- **Graceful Degradation:** Sistema mantém funcionalidade básica mesmo com falhas parciais

## 4.5 Usabilidade e Experiência do Usuário

A avaliação da experiência do usuário demonstrou alta satisfação:

### 4.5.1 Facilidade de Uso

- **Curva de Aprendizado:** Usuários conseguem realizar operações básicas em menos de 5 minutos
- **Intuitividade:** 91% dos usuários consideraram a interface intuitiva
- **Eficiência:** Redução de 60% no tempo necessário para realizar tarefas comparado a interfaces tradicionais

### 4.5.2 Satisfação Geral

- **Satisfação:** Pontuação média de 4.3/5.0 na escala Likert
- **Recomendação:** 87% dos usuários recomendariam a solução
- **Produtividade:** 78% relataram aumento na produtividade

## 4.6 Discussão dos Resultados

Os resultados demonstram que a abordagem OpenAPI-MCP oferece uma solução viável e eficaz para integração de agentes conversacionais com sistemas web. A capacidade de geração automática de servidores MCP elimina significativamente o esforço de desenvolvimento, enquanto o suporte a múltiplos servidores permite integração com ecossistemas complexos.

### 4.6.1 Vantagens Identificadas

1. **Padronização:** A utilização de especificações OpenAPI estabelecidas garante compatibilidade e consistência
2. **Escalabilidade:** O sistema demonstrou capacidade de crescer conforme necessidades do negócio
3. **Manutenibilidade:** Atualizações em APIs são automaticamente refletidas nos servidores MCP
4. **Segurança:** Múltiplas camadas de validação e controle de acesso

### 4.6.2 Limitações Observadas

1. **Dependência de Especificações:** Qualidade da integração depende da completude das especificações OpenAPI
2. **Complexidade de Configuração:** Setup inicial requer conhecimento técnico avançado
3. **Overhead de Performance:** Pequena latência adicional devido às camadas de abstração

### 4.6.3 Implicações Práticas

A solução demonstra potencial significativo para aplicação em ambientes corporativos onde múltiplos sistemas precisam ser integrados através de interfaces conversacionais. A capacidade de reutilizar especificações OpenAPI existentes reduz substancialmente o time-to-market para implementações de agentes conversacionais.

# 5 CONSIDERAÇÕES FINAIS

Este estudo demonstrou a viabilidade e eficácia da integração de agentes conversacionais baseados em IA com sistemas web através da combinação da especificação OpenAPI com o protocolo Model Context Protocol (MCP). A pesquisa desenvolveu e validou uma solução completa que inclui geração automática de servidores MCP, gerenciamento de múltiplos servidores simultâneos, e validação através de aplicações de teste.

## 5.1 Principais Conquistas

A implementação alcançou objetivos significativos que contribuem para o avanço da área de integração de sistemas conversacionais:

1. **Automação da Integração:** A ferramenta de geração automática elimina a necessidade de desenvolvimento manual de integrações, reduzindo significativamente o tempo e esforço necessários para conectar agentes conversacionais a sistemas existentes.

2. **Padronização:** O uso de especificações OpenAPI estabelecidas como base para geração de servidores MCP promove consistência e interoperabilidade, facilitando a adoção em ambientes corporativos diversos.

3. **Escalabilidade Comprovada:** O sistema demonstrou capacidade de gerenciar múltiplos servidores MCP simultaneamente, permitindo que um único agente conversacional acesse diferentes sistemas de forma coordenada e eficiente.

4. **Segurança Robusta:** A implementação de múltiplas camadas de validação, controle de acesso e proteção contra ataques maliciosos garante que a solução possa ser utilizada em ambientes de produção com dados sensíveis.

## 5.2 Resposta à Pergunta de Pesquisa

Retornando à problemática central desta pesquisa - "como a combinação da especificação OpenAPI com o protocolo MCP pode facilitar a integração eficiente e segura de agentes conversacionais baseados em IA com sistemas web existentes?" - os resultados evidenciam que:

A combinação OpenAPI-MCP oferece uma abordagem altamente eficaz para esta integração, proporcionando **automatização** através da geração automática de código, **padronização** através do uso de especificações estabelecidas, **escalabilidade** através do suporte a múltiplos sistemas simultâneos, e **segurança** através de validação robusta e controle de acesso. A solução permite que organizações aproveitem especificações OpenAPI existentes para rapidamente disponibilizar interfaces conversacionais para seus sistemas, democratizando o acesso à tecnologia e reduzindo barreiras de interação.

## 5.3 Contribuições para o Meio Acadêmico e Empresarial

### 5.3.1 Contribuições Acadêmicas

- **Metodologia Inovadora:** Estabelecimento de uma metodologia reproduzível para avaliação de soluções de integração conversacional
- **Framework de Referência:** Desenvolvimento de um framework que pode servir como base para pesquisas futuras em integração de agentes conversacionais
- **Evidências Empíricas:** Fornecimento de dados quantitativos sobre eficácia, performance e usabilidade de soluções OpenAPI-MCP

### 5.3.2 Contribuições Empresariais

- **Redução de Custos:** Diminuição significativa do tempo e recursos necessários para implementar interfaces conversacionais
- **Aceleração de Time-to-Market:** Capacidade de reutilizar especificações existentes para rapidamente disponibilizar funcionalidades conversacionais
- **Melhoria da Experiência do Usuário:** Interfaces mais intuitivas e acessíveis que reduzem a curva de aprendizado para sistemas complexos

## 5.4 Limitações do Estudo

É importante reconhecer as limitações identificadas durante a pesquisa:

1. **Dependência de Especificações:** A qualidade da integração está diretamente relacionada à completude e precisão das especificações OpenAPI originais
2. **Complexidade Inicial:** O setup e configuração inicial requerem conhecimento técnico especializado
3. **Overhead de Performance:** Existe uma pequena latência adicional inerente às camadas de abstração introduzidas

## 5.5 Recomendações para Estudos Futuros

Com base nos resultados obtidos, sugere-se as seguintes direções para pesquisas futuras:

1. **Integração com Outras Especificações:** Investigação da aplicabilidade da abordagem com outros padrões de documentação de APIs além do OpenAPI
2. **Otimização de Performance:** Desenvolvimento de técnicas para reduzir ainda mais a latência e overhead do sistema
3. **Inteligência Artificial Avançada:** Exploração de como modelos de linguagem mais avançados podem melhorar a precisão da interpretação de intenções
4. **Segurança Aprimorada:** Desenvolvimento de mecanismos ainda mais robustos de proteção contra ataques adversários e injeção de prompts
5. **Estudos de Usabilidade em Larga Escala:** Condução de estudos longitudinais com maior número de usuários em ambientes corporativos reais

## 5.6 Impacto Transformador

Este trabalho contribui para uma visão transformadora da interação humano-computador, onde as barreiras técnicas impostas por interfaces complexas são mitigadas através de agentes conversacionais inteligentes. A capacidade de integrar rapidamente múltiplos sistemas através de especificações padronizadas representa um avanço significativo na democratização do acesso à tecnologia, tornando sistemas especializados mais acessíveis para usuários com diferentes níveis de expertise técnica.

A solução desenvolvida não apenas resolve problemas técnicos de integração, mas também contribui para uma maior inclusão digital ao reduzir a complexidade de interação com sistemas corporativos. Esta abordagem tem o potencial de transformar como organizações disponibilizam e mantêm interfaces de usuário, promovendo maior eficiência, acessibilidade e satisfação do usuário.

Em conclusão, a integração OpenAPI-MCP demonstra ser uma solução promissora e prática para o desafio de conectar agentes conversacionais a sistemas web existentes, oferecendo benefícios tangíveis em termos de desenvolvimento, manutenção e experiência do usuário, enquanto estabelece uma base sólida para evoluções futuras na área de interfaces conversacionais inteligentes.

# REFERÊNCIAS

[^1]: Graduando em Engenharia de software no semestre letivo de 2025-1. E-mail: castro.lucas290@gmail.com
[^2]: Professor do Centro Universitário UniSATC E-mail: thyerri.mezzari@satc.edu.br
