---
title: "**TRANSFORMANDO APIS EM INTERFACES CONVERSACIONAIS: VALIDAÇÃO DA ABORDAGEM OPENAPI-MCP PARA AGENTES BASEADOS EM IA**"
---


<!-- ### Artigo em produção - Checklist de produção

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
  - [x] Desenvolvimento
  - [x] Resultados e discussão
  - [x] Considerações finais
  - [ ] Revisão após finalizar o artigo -->

**Lucas de Castro Zanoni**[^1]

**Thyerri Fernandes Mezzari**[^2]

Resumo: Este trabalho apresenta um estudo experimental preliminar de integração de agentes conversacionais baseados em IA a soluções web através da especificação OpenAPI combinada com o protocolo Model Context Protocol (MCP). A pesquisa investiga inicialmente como especificações OpenAPI podem ser automaticamente convertidas em servidores MCP, permitindo que modelos de linguagem de grande escala (LLMs) interajam de forma padronizada e segura com sistemas externos. Para garantir uma análise rigorosa e reprodutível, foi desenvolvida uma interface padronizada e definidos critérios objetivos, fundamentando-se em referências acadêmicas, guias de segurança, relatórios de mercado e documentações oficiais de provedores de modelos de linguagem. O estudo envolveu a implementação de uma prova de conceito que inclui um gerador automático de servidores MCP a partir de especificações OpenAPI, um cliente de chat capaz de gerenciar múltiplos servidores MCP simultaneamente, e aplicações de teste para validação da abordagem. Foram aplicados testes automatizados *end-to-end*, com ênfase em métricas de robustez, segurança (incluindo *red teaming* e injeção de *prompts*) e usabilidade dentro do escopo experimental definido. Os resultados indicam a viabilidade técnica inicial e eficácia da integração OpenAPI-MCP nos cenários testados, fornecendo uma análise fundamentada sobre os benefícios, desafios e limitações desta abordagem para a integração de agentes conversacionais baseados em IA em sistemas complexos. A pesquisa estabelece evidências preliminares convincentes sobre a possibilidade de grandes avanços na facilitação da integração entre sistemas existentes e LLMs, promovendo maior acessibilidade, usabilidade e democratização do acesso a tecnologias complexas, justificando investigações mais aprofundadas para validação em escala maior.

**Palavras-chave:** agente conversacional baseado em IA, integração de sistemas, inteligência artificial, OpenAPI, Model Context Protocol, segurança, usabilidade.

# 1 INTRODUÇÃO

A evolução das interfaces de usuário tem gerado uma diversidade de padrões de design e usabilidade, resultando frequentemente em barreiras para a plena acessibilidade e interação dos usuários com os sistemas digitais. Com o aumento da complexidade do frontend e a multiplicidade de paradigmas de interação, muitos usuários enfrentam dificuldades significativas para utilizar efetivamente as funcionalidades oferecidas pelas soluções web modernas [@RAPP201849] [@Kocaballi2019]. Nesse contexto, a ascensão dos Modelos de Linguagem de Grande Escala (LLMs), como os desenvolvidos por OpenAI, Anthropic e Google, tem impulsionado o desenvolvimento de agentes conversacionais baseados em IA mais avançados e adaptáveis [@openai2022instructgpt; @anthropic2024mcp]. Nos últimos anos, avanços em modelos baseados em Transformer, como o BERT (2018), que aprimorou a compreensão textual, e o GPT-3 (2020), que ampliou as capacidades generativas e o aprendizado com poucos exemplos (*few-shot*), permitiram que os LLMs realizassem tarefas cada vez mais complexas a partir de simples instruções em linguagem natural. Esses avanços consolidaram os LLMs como interfaces conversacionais robustas e eficazes para integração com sistemas.

Diante desse cenário, estudos recentes têm demonstrado que agentes conversacionais baseados em IA podem aprimorar significativamente a experiência do usuário ao simplificar interações com sistemas complexos [@fast2017irisconversationalagentcomplex]. Além disso, a implementação de interfaces baseadas em linguagem natural tem mostrado potencial para melhorar a usabilidade em contextos domésticos e inteligentes, reduzindo o tempo e o esforço necessários para completar tarefas complexas [@Guo2024Doppelganger]. Ademais, tais interfaces oferecem vantagens consideráveis em termos de acessibilidade, permitindo uma comunicação mais inclusiva e adaptável a usuários com diferentes necessidades especiais [@Lister2020AccessibleCU] [@Deng2023AMA]. Para que esses benefícios sejam efetivamente alcançados em soluções web, é fundamental avaliar as diferentes estratégias de integração desses agentes aos sistemas existentes.

Nesse sentido, este estudo investiga preliminarmente as possibilidades de democratização do acesso a sistemas técnicos complexos através da facilitação da integração entre sistemas existentes e LLMs para criar interações semelhantes a agentes conversacionais. A pesquisa examina especificamente a viabilidade da especificação OpenAPI combinada com o protocolo emergente MCP (Model Context Protocol) como uma solução promissora para esta integração. Esta abordagem permite que especificações OpenAPI sejam automaticamente convertidas em servidores MCP, criando uma ponte padronizada entre modelos de linguagem e sistemas externos. A solução será avaliada quanto a desempenho, segurança, facilidade de implementação e experiência do usuário, com foco específico na capacidade de gerenciar múltiplos servidores MCP simultaneamente e na eficácia da geração automática de código.

Considerando esse panorama tecnológico e as potencialidades demonstradas pelos LLMs, a problemática central desta pesquisa reside na questão: como a combinação da especificação OpenAPI com o protocolo MCP pode facilitar a integração eficiente e segura de agentes conversacionais baseados em IA com sistemas web existentes, contribuindo para a democratização do acesso a tecnologias complexas? Essa pergunta reflete a necessidade crescente de soluções padronizadas que reduzam a complexidade de integração e tornem sistemas especializados mais acessíveis através de interfaces conversacionais naturais, representando um passo significativo em direção à democratização tecnológica.

A relevância deste estudo evidencia-se pelo potencial transformador que os agentes conversacionais baseados em IA representam para a área de interação humano-computador. Ao implementar um sistema intermediário capaz de interpretar linguagem natural e traduzi-la em ações específicas dentro de um sistema, cria-se uma ponte que permite aos usuários interagir de forma mais intuitiva e natural com as tecnologias digitais. Esta abordagem tem o potencial de mitigar as barreiras impostas por interfaces complexas, contribuindo para uma maior inclusão digital e para a melhoria da experiência do usuário em diversos contextos de aplicação. O presente trabalho busca fornecer evidências iniciais desta possibilidade através de uma prova de conceito que demonstre a viabilidade técnica da integração OpenAPI-MCP e estabeleça fundamentos para desenvolvimentos futuros mais abrangentes.

Para responder adequadamente à questão de pesquisa formulada, este estudo requer uma metodologia experimental robusta que permita validar empiricamente a viabilidade da integração proposta. A abordagem metodológica descrita a seguir foi estruturada para fornecer evidências quantitativas e qualitativas sobre a eficácia da combinação OpenAPI-MCP, estabelecendo parâmetros objetivos de avaliação que garantam a validade científica dos resultados obtidos.

# 2 PROCEDIMENTO EXPERIMENTAL

Este estudo adota uma abordagem experimental estruturada em etapas sequenciais para investigar preliminarmente a viabilidade e eficácia da integração de agentes conversacionais baseados em IA a sistemas web através da especificação OpenAPI combinada com o protocolo Model Context Protocol (MCP). A pesquisa será examinada com base em uma prova de conceito prática, desenvolvida para validar sua viabilidade técnica inicial e avaliar objetivamente aspectos funcionais e não-funcionais da solução proposta dentro de um escopo experimental controlado.

É importante ressaltar que esta investigação constitui uma validação inicial da abordagem proposta, com o objetivo de demonstrar a possibilidade de grandes avanços na integração entre sistemas existentes e LLMs, utilizando OpenAPI-MCP como uma solução promissora. As limitações inerentes ao escopo de uma prova de conceito, incluindo o número restrito de sistemas testados e a profundidade limitada dos cenários avaliados, são reconhecidas como adequadas para o propósito de estabelecer evidências preliminares de viabilidade técnica.

Inicialmente, será conduzida uma revisão sistemática da literatura, consolidando conhecimentos científicos sobre integração OpenAPI-MCP e embasando teoricamente a fase experimental. Na sequência, a estratégia será implementada e testada por meio de uma prova de conceito abrangente, incluindo a) o desenvolvimento de um gerador automático de servidores MCP, b) um cliente de chat para gerenciamento de múltiplos servidores, c) aplicações de teste de ponta a ponta para validação da abordagem e d) geração de métricas de avaliação para medir desempenho, segurança, facilidade de implementação, manutenibilidade e experiência do usuário. 

Para assegurar resultados objetivos e reproduzíveis dentro do escopo experimental definido, os testes serão automatizados utilizando testes *end-to-end*, aplicando medidas de robustez e segurança (como testes de *red teaming* e proteção contra injeção de *prompts*) e avaliações qualitativas de usabilidade. Os resultados serão sistematicamente documentados e analisados, permitindo identificar desafios, vantagens e limitações intrínsecas à integração OpenAPI-MCP e demonstrando sua aplicabilidade prática inicial para diferentes contextos de uso. Esta metodologia busca estabelecer indicadores iniciais da eficácia da abordagem, reconhecendo que validações mais abrangentes serão necessárias para confirmação definitiva em ambientes empresariais complexos.

## 2.1 MATERIAIS

Para garantir a rigorosidade científica e a reprodutibilidade dos experimentos conduzidos neste estudo, foram selecionadas ferramentas específicas baseadas em critérios de rigor científico, reprodutibilidade e adequação aos objetivos de pesquisa. A seleção do Node.js como plataforma de desenvolvimento, do Playwright para testes automatizados *end-to-end* e do OpenAI GPT-4 para integração com modelos de linguagem baseou-se em sua comprovada capacidade para suportar a metodologia experimental proposta, permitindo validação objetiva da viabilidade da integração OpenAPI-MCP através de uma prova de conceito robusta e reproduzível.

### 2.1.1 PLATAFORMA DE DESENVOLVIMENTO

**Node.js (versão 20+)** foi selecionado como plataforma principal devido à sua arquitetura assíncrona orientada a eventos, essencial para aplicações que requerem processamento simultâneo de múltiplas requisições e integração eficiente com APIs de modelos de linguagem. A escolha foi fundamentada na comprovada capacidade da plataforma para gerenciar operações intensivas de IA e sua ampla adoção em projetos de integração com LLMs [@cherednichenko:hal-04545073; @RedHat2024LLMNode].

### 2.1.2 FERRAMENTAS DE TESTE E VALIDAÇÃO

**Playwright** foi utilizado para implementação de testes automatizados *end-to-end* (E2E), permitindo simulação precisa de interações do usuário e validação de funcionalidades em ambiente controlado. Para avaliação de segurança, foram implementadas técnicas de *red teaming* - testes adversários sistemáticos que simulam ataques de injeção de *prompts* e tentativas de *jailbreak*. O *Framework* de Gerenciamento de Riscos de IA do NIST [@oprea2023adversarial] e as diretrizes da OWASP [@john2025owasp] orientaram a definição dos cenários de teste, considerando que injeções de *prompt* representam ameaças críticas em sistemas LLM com acesso a dados sensíveis.

### 2.1.3 MODELOS DE LINGUAGEM UTILIZADOS

**OpenAI GPT-4** foi selecionado como modelo principal devido às suas capacidades avançadas de *function calling* - funcionalidade que permite interpretação de linguagem natural e conversão automática em chamadas de funções estruturadas. Modelos desta família suportam janelas de contexto extensas (até 32.000 tokens no GPT-4) [@openai2023gpt4], essenciais para manter conversas prolongadas e processar especificações OpenAPI complexas. A seleção baseou-se na performance comprovada em cenários de integração com sistemas externos e na disponibilidade de APIs robustas para desenvolvimento [@openai2023functioncalling].

### 2.1.4 FERRAMENTAS DE INTEGRAÇÃO

**OpenAPI 3.0+** foi utilizado como especificação padrão para definição de contratos de API, proporcionando documentação estruturada e interoperabilidade entre sistemas. Sua ampla adoção como padrão da indústria e capacidade de descrever esquemas de autenticação (OAuth, API Key, Bearer Token) tornam-no adequado para integração com agentes conversacionais [@OpenAPIInitiative2023].

**Model Context Protocol (MCP)** foi implementado como protocolo de comunicação entre modelos de linguagem e sistemas externos. Desenvolvido pela Anthropic e lançado como padrão aberto em novembro de 2024, o MCP oferece arquitetura cliente-servidor padronizada que elimina a necessidade de integrações personalizadas para cada fonte de dados [@anthropic2024mcp; @MCPDocs2024]. O advento deste protocolo possibilitou a interface de comunicação padronizada entre modelos de linguagem e sistemas externos, facilitando a integração e a interoperabilidade entre diferentes fontes de dados e modelos de linguagem.

## 2.2 MÉTODOS

Para assegurar a validade científica e a reprodutibilidade dos experimentos, foi fundamental estabelecer um controle rigoroso das variáveis experimentais. A implementação de uma interface padronizada constitui elemento metodológico essencial para eliminar diferenças de experiência do usuário que poderiam contaminar os resultados experimentais. Esta padronização garante que as diferenças observadas no desempenho sejam atribuíveis exclusivamente às tecnologias de integração testadas (OpenAPI-MCP), e não a variações na interface ou design de interação. Sem este controle experimental, seria impossível determinar se melhorias na usabilidade decorrem da abordagem proposta ou de fatores externos relacionados ao design da interface.

### 2.2.1 Interface Padronizada de Usuário

A interface comum consiste em uma aplicação web simples de chat, desenvolvida utilizando HTML e JavaScript. A interface foi projetada de forma minimalista, visando uma experiência consistente e objetiva, independentemente da abordagem utilizada para a integração.

#### 2.2.1.1 DESIGN DA INTERFACE

A interface é composta por uma seção principal que exibe o histórico de mensagens, onde as interações entre usuário e agente conversacional aparecem de forma intercalada: as mensagens do agente são exibidas à esquerda e as do usuário à direita, facilitando a distinção visual entre os participantes da conversa. Abaixo do histórico, há um campo de entrada de texto que permite ao usuário digitar e enviar novas mensagens. Esse layout possibilita ao usuário acompanhar facilmente todo o histórico da conversa e inserir novos *prompts* de maneira contínua e intuitiva.

![Interface web minimalista desenvolvida para testes padronizados da integração OpenAPI-MCP, mostrando área de histórico de mensagens intercaladas entre usuário (direita) e agente (esquerda), com campo de entrada inferior para novos comandos](images/chat/chat-interface.jpg)

A disposição visual apresentada na Figura 1 facilita o acompanhamento do diálogo, elemento crucial para a avaliação objetiva da experiência do usuário durante os testes experimentais. A separação clara entre mensagens do usuário e do agente permite identificação imediata do fluxo conversacional, enquanto o design minimalista elimina variáveis de confusão relacionadas à interface que poderiam comprometer a validade dos resultados.

#### 2.2.1.2 Comunicação com *Backend*

A comunicação entre *frontend* e *backend* será estabelecida por meio de uma API REST síncrona, simplificando o processo de envio e retorno de mensagens. Cada consulta feita pelo usuário gerará uma única requisição ao *backend* que processará integralmente essa requisição utilizando um LLM e devolverá uma resposta após concluir o processamento, mantendo o fluxo de comunicação claro e previsível.

### 2.2.2 Critérios de Avaliação e Operacionalização de Métricas

Para garantir uma avaliação científica rigorosa, foram definidos critérios objetivos de avaliação com métricas específicas quantitativas e qualitativas, operacionalizados através de instrumentação técnica precisa e metodologias de coleta padronizadas.

Os critérios de desempenho compreendem quatro métricas fundamentais. O tempo de resposta total é medido em milissegundos utilizando timestamps precisos via Performance API do navegador, fornecendo dados objetivos sobre a latência percebida pelo usuário final. A taxa de sucesso de operações é calculada como percentual de requisições bem-sucedidas versus falhas, com categorização sistemática de tipos de erro para identificação de padrões de falha. O *throughput* é quantificado como número de operações processadas por segundo em cenários de carga controlada, permitindo avaliação da capacidade de processamento simultâneo.

Os critérios de segurança focam na robustez contra ataques adversários e validação de entrada. A resistência a injeção de *prompts* é mensurada como percentual de tentativas maliciosas bloqueadas durante testes de *red teaming*, implementados conforme o Framework de Gerenciamento de Riscos de IA do NIST [@oprea2023adversarial] e as diretrizes da OWASP [@john2025owasp], considerando que injeções de *prompt* representam ameaças críticas em sistemas LLM com acesso a dados sensíveis.

Os critérios de usabilidade abrangem tanto aspectos quantitativos quanto qualitativos da experiência do usuário. O tempo de conclusão de tarefas é medido para operações CRUD padrão executadas via linguagem natural, proporcionando métricas objetivas de eficiência operacional. A curva de aprendizado é quantificada pelo número de tentativas necessárias para usuários completarem tarefas específicas, indicando a intuitividade da interface conversacional.

### 2.2.3 Arquitetura e Fluxo de Integração do Sistema

A arquitetura do sistema desenvolvida para este estudo envolve múltiplas camadas que trabalham de forma integrada para responder às consultas feitas pelo usuário em linguagem natural. Inicialmente, as consultas serão recebidas pela interface *web* e encaminhadas ao *backend*, onde o modelo de linguagem executará o processo de análise e interpretação.

![Arquitetura do sistema OpenAPI-MCP demonstrando o fluxo de dados entre interface web, backend Node.js, modelo de linguagem GPT-4, servidores MCP gerados automaticamente e APIs de sistemas externos](images/metodos/system-architecture.jpg)

Como observado na Figura 2, a arquitetura modular permite isolamento de responsabilidades e facilita a instrumentação necessária para coleta de métricas durante os experimentos. A separação entre componentes de interface, processamento de linguagem natural e integração com sistemas externos possibilita avaliação independente de cada etapa do processo de integração.

O fluxo completo de interação deverá ocorrer da seguinte maneira: ao receber uma consulta, o modelo de linguagem interpretará a intenção do usuário e utilizará a implementação de client MCP para utilizar as ferramentas geradas pelo gerador de ferramentas MCP (servers) para acessar sistemas *backend* via API REST conforme a especificação OpenAPI. Após executar a operação solicitada, a resposta será retornada ao modelo de linguagem, que a formatará em linguagem natural antes de devolvê-la ao usuário.

![Diagrama de workflow detalhado mostrando o processo de interpretação de linguagem natural, conversão em chamadas de função via MCP, execução de operações em sistemas backend e formatação de respostas conversacionais](images/metodos/workflow-integration.jpg)

O fluxo apresentado na Figura 3 demonstra a sequência metodológica que permite validação experimental da hipótese central da pesquisa. Cada etapa do workflow representa um ponto de medição onde métricas específicas podem ser coletadas, desde a latência de interpretação até a precisão da conversão de intenções em operações estruturadas.

### 2.2.5 Metodologia de Testes Automatizados *End-to-End*

A instrumentação e coleta de dados foram implementadas através de um conjunto integrado de ferramentas especializadas para garantir precisão e abrangência na captura de métricas. O Playwright Test Framework foi configurado para capturar métricas de performance via Performance API, proporcionando medições precisas de latência e throughput em condições reais de uso.

Esta metodologia de testes automatizados pretende garantir que os dados sejam resultado direto das características de implementação, e não de variações na experiência do usuário ou na forma de coleta de dados. A instrumentação detalhada permite análise reproduzível e comparação objetiva entre diferentes estratégias de integração, estabelecendo uma base empírica sólida para as conclusões científicas da pesquisa.

## 3. DESENVOLVIMENTO

A implementação da solução OpenAPI-MCP foi estruturada seguindo uma abordagem modular e integrada, compreendendo quatro componentes principais que trabalham em sinergia para demonstrar e validar a viabilidade da integração proposta. A arquitetura resultante engloba um gerador automático de servidores MCP a partir de especificações OpenAPI, um cliente de chat capaz de gerenciar múltiplos servidores MCP simultaneamente, aplicações de teste que simulam cenários reais de negócio, e uma suíte abrangente de testes automatizados para avaliação científica da solução.

### 3.1 Desafios Metodológicos e Decisões de Design

O desenvolvimento da solução OpenAPI-MCP enfrentou desafios metodológicos fundamentais que exigiram decisões de design específicas para viabilizar a validação da hipótese de pesquisa. O principal desafio metodológico identificado reside na padronização de integrações heterogêneas de APIs, problema que tradicionalmente demanda desenvolvimento manual extensivo e customizado para cada sistema [@OpenAPIInitiative2023]. Esta problemática constitui uma barreira significativa para a democratização de agentes conversacionais em ambientes corporativos, onde a diversidade de sistemas e protocolos de comunicação impede a implementação escalável de interfaces conversacionais.

#### 3.1.1 Gerador Automático de Servidores MCP: Abordagem Metodológica

Para abordar o desafio de padronização, foi desenvolvido um gerador automático de servidores MCP que representa o núcleo metodológico da contribuição científica proposta. A concepção desta ferramenta surge da necessidade de validar experimentalmente se especificações OpenAPI existentes podem ser sistematicamente convertidas em ferramentas utilizáveis por modelos de linguagem, eliminando a necessidade de desenvolvimento manual recorrente.

A arquitetura metodológica foi estruturada em três camadas funcionais para garantir separação de responsabilidades e facilitar a validação experimental. A primeira camada realiza análise sintática (*parsing*) de especificações OpenAPI 3.0+, responsável pela extração e validação de metadados de endpoints. A segunda camada executa mapeamento semântico MCP, que realiza a conversão inteligente de operações OpenAPI para ferramentas compreensíveis pelos modelos de linguagem. A terceira camada concentra-se na geração de código, produzindo servidores MCP funcionais em TypeScript com validação robusta de entrada e tratamento de erros.

Esta abordagem metodológica atende diretamente ao primeiro objetivo específico da pesquisa - *desenvolver um gerador automático de servidores MCP* - ao estabelecer um processo sistemático e reproduzível para conversão de especificações API em ferramentas de agentes conversacionais. A escolha da arquitetura em camadas fundamenta-se na necessidade de criar um processo de validação controlado, onde cada etapa pode ser independentemente verificada e os resultados podem ser objetivamente mensurados.

#### 3.1.2 Coordenação Multi-Servidor: Desafio de Orquestração Distribuída

O segundo desafio metodológico identificado relaciona-se à coordenação eficiente de múltiplos servidores MCP simultaneamente, problema que se enquadra teoricamente no domínio de sistemas distribuídos e coordenação de agentes [@anthropic2024mcp]. A complexidade emerge da necessidade de manter conexões ativas, descobrir dinamicamente capacidades disponíveis e rotear solicitações baseadas na análise semântica da intenção do usuário, tudo isso preservando a experiência conversacional natural.

A solução metodológica adotada implementa um sistema de coordenação baseado em *pool* de conexões com descoberta automática de ferramentas, criando um inventário dinâmico das funcionalidades acessíveis em cada servidor. O roteamento inteligente utiliza análise contextual para determinar qual servidor utilizar baseado nas ferramentas disponíveis e na natureza da solicitação, enquanto o mecanismo de agregação de resultados permite combinar informações de múltiplos servidores quando necessário.

A estratégia de coordenação multi-servidor implementa três mecanismos metodológicos fundamentais para validação experimental. O *pool* de conexões ativas mantém estado consistente com todos os servidores MCP configurados, permitindo medição precisa de latências e disponibilidade. O sistema de descoberta automática de ferramentas cria um inventário dinâmico das capacidades disponíveis, essencial para validação da escalabilidade da abordagem. O roteamento inteligente baseado em análise contextual da intenção do usuário permite avaliar objetivamente a precisão e eficiência da seleção automática de ferramentas.

A integração com modelos de linguagem através da funcionalidade de *function calling* da OpenAI estabelece uma ponte metodológica entre compreensão de linguagem natural e execução de ferramentas específicas. Esta abordagem permite validação experimental da hipótese de que agentes conversacionais podem efetivamente interpretar intenções complexas e traduzi-las em operações precisas em sistemas *backend*, constituindo elemento central para avaliação da usabilidade e eficácia da solução proposta.

### 3.2 Fundamentação Tecnológica e Metodológica

As decisões tecnológicas para implementação da prova de conceito foram fundamentadas em critérios de rigor científico, reprodutibilidade e adequação aos objetivos de pesquisa, segundo o detalhamento da seção de MATERIAIS. A seleção do Node.js como plataforma de desenvolvimento, do Playwright para testes automatizados *end-to-end* e do OpenAI GPT-4 para integração com modelos de linguagem baseou-se em sua comprovada capacidade para suportar a metodologia experimental proposta, permitindo validação objetiva da viabilidade da integração OpenAPI-MCP através de uma prova de conceito robusta e reproduzível.

### 3.3 Gerador Automático de Servidores MCP (mcp-openapi-server)

O gerador automático de servidores MCP representa a materialização metodológica do primeiro objetivo específico da pesquisa, constituindo a ferramenta central para validação da hipótese de que especificações OpenAPI podem ser sistematicamente convertidas em interfaces utilizáveis por agentes conversacionais. A abordagem metodológica adotada fundamenta-se na premissa de que a automação da geração de servidores elimina a variabilidade humana no processo de integração, permitindo avaliação objetiva da eficácia da conversão OpenAPI-MCP.

A estrutura metodológica implementada segue um processo sistemático de três etapas interdependentes. A primeira etapa realiza análise sintática (*parsing*) e validação rigorosa de especificações OpenAPI 3.0+, garantindo conformidade com padrões estabelecidos e extração precisa de metadados essenciais. A segunda etapa executa mapeamento semântico entre contratos OpenAPI e ferramentas MCP, preservando a integridade semântica das operações originais e adaptando-as para compreensão por modelos de linguagem. A terceira etapa concretiza a geração de código TypeScript funcional, produzindo servidores MCP operacionais com tratamento robusto de erros e validação automática de entrada.

Esta metodologia de geração automática permite validação experimental controlada, onde cada especificação OpenAPI processada constitui um caso de teste independente para avaliação da eficácia da conversão. O suporte implementado para múltiplos esquemas de autenticação (API Key, Bearer Token, OAuth) e todos os métodos HTTP fundamentais (GET, POST, PUT, DELETE, PATCH) garante cobertura abrangente dos cenários de integração típicos encontrados em ambientes corporativos reais, essencial para validação da aplicabilidade prática da abordagem proposta.

### 3.4 Cliente de Chat Multi-Servidor MCP

O cliente de chat multi-servidor constitui a implementação metodológica do segundo objetivo específico da pesquisa, desenvolvido como ferramenta de validação experimental para demonstrar a viabilidade prática da orquestração simultânea de múltiplos servidores MCP em ambiente conversacional. A concepção metodológica desta ferramenta fundamenta-se na necessidade de criar um ambiente controlado onde a capacidade de coordenação entre sistemas distribuídos possa ser sistematicamente testada e avaliada.

A arquitetura metodológica adotada implementa uma separação clara entre *frontend* e *backend* para facilitar a instrumentação e coleta de dados experimentais. O *frontend* minimalista, desenvolvido em HTML e JavaScript, garante consistência na experiência do usuário durante os testes, eliminando variáveis confusas relacionadas à interface que poderiam comprometer a validade dos resultados experimentais. O *backend*, implementado em Node.js com Express.js, concentra a lógica de coordenação e instrumentação necessária para o comportamento do sistema.

A estratégia de coordenação multi-servidor implementa três mecanismos metodológicos fundamentais para validação experimental. O *pool* de conexões ativas mantém estado consistente com todos os servidores MCP configurados, permitindo medição precisa de latências e disponibilidade. O sistema de descoberta automática de ferramentas cria um inventário dinâmico das capacidades disponíveis, essencial para validação da escalabilidade da abordagem. O roteamento inteligente baseado em análise contextual da intenção do usuário permite avaliar objetivamente a precisão e eficiência da seleção automática de ferramentas.

A integração com modelos de linguagem através da funcionalidade de *function calling* da OpenAI estabelece uma ponte metodológica entre compreensão de linguagem natural e execução de ferramentas específicas. Esta abordagem permite validação experimental da hipótese de que agentes conversacionais podem efetivamente interpretar intenções complexas e traduzi-las em operações precisas em sistemas *backend*, constituindo elemento central para avaliação da usabilidade e eficácia da solução proposta.

### 3.5 Estratégia de Validação Experimental através de Aplicações de Teste

Para garantir rigor científico na validação da abordagem proposta, foram desenvolvidas aplicações de teste que simulam cenários empresariais realistas, atendendo ao terceiro objetivo específico da pesquisa - *avaliar a solução através de testes sistemáticos*. A estratégia metodológica fundamenta-se na utilização de domínios de negócio distintos - gerenciamento de equipamentos industriais e gestão de recursos humanos - para demonstrar a versatilidade e aplicabilidade geral da integração OpenAPI-MCP em contextos heterogêneos.

A escolha metodológica por aplicações que exponham APIs RESTful completamente documentadas com especificações OpenAPI permite criar um ambiente controlado onde variáveis experimentais podem ser sistematicamente manipuladas e resultados objetivamente mensurados. Esta abordagem experimental garante que a validação ocorra em condições que refletem fielmente as complexidades encontradas em ambientes corporativos reais, sem comprometer a reprodutibilidade e controle necessários para avaliação científica rigorosa.

### 3.6 Metodologia de Validação Automatizada

A validação científica da solução implementa uma metodologia de testes automatizados estruturada para abordar múltiplas dimensões críticas da pesquisa: funcionalidade, segurança e usabilidade.

A abordagem de validação automatizada garante reprodutibilidade dos experimentos e elimina variabilidade humana na coleta de dados, elementos essenciais para estabelecer a validade científica dos resultados obtidos. Esta metodologia permite que pesquisadores futuros repliquem os experimentos sob condições idênticas, contribuindo para o avanço cumulativo do conhecimento na área de integração de agentes conversacionais em sistemas empresariais complexos.

Tendo estabelecido a fundamentação metodológica e implementado os componentes técnicos necessários, a etapa seguinte concentra-se na análise empírica dos resultados obtidos através da execução dos testes automatizados. A avaliação abrangente aborda múltiplas dimensões críticas para determinar a viabilidade prática da abordagem OpenAPI-MCP em cenários controlados.

## 4 RESULTADOS E DISCUSSÕES

A implementação da solução OpenAPI-MCP foi submetida a uma avaliação experimental abrangente através de testes automatizados *end-to-end*, fornecendo dados quantitativos objetivos que demonstram tanto a viabilidade técnica quanto a eficácia prática da abordagem proposta. Os resultados obtidos através da validação experimental desenvolvida oferecem evidências mensuráveis sobre a integração de agentes conversacionais baseados em IA em sistemas web, estabelecendo uma base empírica sólida para avaliação da solução.

## 4.1 Métricas de Performance

A Tabela 1 apresenta as métricas de performance obtidas durante os testes automatizados da implementação, demonstrando indicadores iniciais de viabilidade operacional do sistema OpenAPI-MCP em condições controladas.

**Tabela 1: Métricas de Performance - Implementação OpenAPI-MCP**

| Métrica                   | Valor Obtido   | Variação      | Observações                        |
| ------------------------- | -------------- | ------------- | ---------------------------------- |
| Tempo Resposta Médio (ms) | 3.757          | 1.335 - 5.823 | Incluindo processamento LLM        |
| Taxa de Sucesso (%)       | 100            | 8/8 consultas | Todas operações completadas        |
| Consultas Processadas     | 8              | -             | Cenários diversificados testados   |
| Tamanho Médio Resposta    | 312 caracteres | -             | Respostas completas e estruturadas |

Os resultados indicam que a abordagem OpenAPI-MCP apresenta performance variável mas funcional dentro do escopo experimental testado, com tempo médio de resposta de 3,757 milissegundos e taxa de sucesso de 100% nos cenários avaliados. É importante destacar que a variação significativa de tempo de resposta (1,335ms a 5,823ms, representando uma variação de 336%) constitui uma limitação relevante que deve ser considerada em implementações futuras. Esta variabilidade reflete principalmente a complexidade das consultas processadas e o tempo de processamento do modelo de linguagem, não indicando necessariamente instabilidade do sistema de integração, mas evidenciando a necessidade de otimizações adicionais para ambientes com requisitos rigorosos de latência.

Os dados obtidos sugerem que a integração OpenAPI-MCP é tecnicamente viável para cenários onde a precisão é prioritária em relação à velocidade consistente, fornecendo evidências iniciais promissoras para o desenvolvimento de soluções mais robustas.

## 4.2 Eficácia da Geração Automática de Servidores MCP

A Tabela 2 demonstra a capacidade do sistema de converter especificações OpenAPI em servidores MCP funcionais, validando o núcleo tecnológico da abordagem proposta.

**Tabela 2: Resultados da Conversão OpenAPI→MCP**

| Aspecto Testado       | Implementado                      | Taxa de Sucesso (%) | Observações                       |
| --------------------- | --------------------------------- | ------------------- | --------------------------------- |
| Métodos HTTP          | 5 (GET, POST, PUT, DELETE, PATCH) | 100                 | Cobertura completa CRUD           |
| Sistemas Integrados   | 2                                 | 100                 | Equipamentos e Profissionais      |
| Endpoints Convertidos | 10                                | 100                 | Conversão automática bem-sucedida |

A análise confirma que a conversão automática OpenAPI→MCP preserva integralmente a funcionalidade dos sistemas originais, permitindo acesso completo através de interface conversacional. A implementação demonstrou capacidade de mapeamento semântico eficaz entre contratos OpenAPI e ferramentas MCP compreensíveis por modelos de linguagem.

## 4.3 Avaliação de Experiência do Usuário

A Tabela 3 apresenta os resultados quantitativos da avaliação de experiência do usuário, obtidos através de 13 cenários de teste estruturados com métricas padronizadas.

**Tabela 3: Métricas de Experiência do Usuário (Escala 1-5)**

| Métrica de UX             | Pontuação Média | Desvio | Observações                        |
| ------------------------- | --------------- | ------ | ---------------------------------- |
| Precisão das Respostas    | 3,5             | ±0,5   | Interpretação correta de intenções |
| Clareza da Comunicação    | 4,0             | ±0,3   | Respostas bem estruturadas         |
| Utilidade das Informações | 4,3             | ±0,4   | Alto valor informacional           |
| Pontuação Geral           | 4,0             | ±0,3   | Experiência satisfatória           |
| Taxa de Sucesso           | 100%            | 13/13  | Todas consultas respondidas        |
| Tempo Médio Resposta      | 4.861 ms        | ±2.400 | Responsividade adequada            |

Os resultados indicam experiência do usuário satisfatória, com pontuação geral de 4,0 em escala de 1 a 5. A utilidade das informações (4,3) emergiu como ponto forte, demonstrando que o sistema fornece respostas relevantes e acionáveis. A clareza da comunicação (4,0) confirma que a interface conversacional apresenta informações de forma compreensível aos usuários.

## 4.4 Análise de Segurança

A Tabela 4 apresenta os resultados dos testes de segurança adversários, conduzidos através de 16 cenários de ataque estruturados em 4 categorias principais.

**Tabela 4: Resultados dos Testes de Segurança**

| Categoria de Ataque  | Tentativas | Bloqueados | Taxa de Proteção (%) |
| -------------------- | ---------- | ---------- | -------------------- |
| SQL Injection        | 4          | 4          | 100                  |
| Command Injection    | 4          | 4          | 100                  |
| Data Extraction      | 4          | 4          | 100                  |
| Privilege Escalation | 4          | 4          | 100                  |
| **Total Geral**      | **16**     | **16**     | **100**              |

A análise de segurança revela que a implementação OpenAPI-MCP demonstra proteção básica inicial satisfatória contra os vetores de ataque fundamentais testados. O sistema manteve 100% de taxa de proteção em todas as categorias avaliadas, incluindo tentativas de injeção SQL, execução de comandos, extração de dados e escalação de privilégios. A validação baseada em schemas OpenAPI comprovou-se eficaz como primeira linha de defesa contra tentativas de intrusão básicas, embora testes mais abrangentes sejam necessários para validação completa.

É importante destacar que os testes realizados abrangeram exclusivamente ataques básicos e cenários de segurança fundamentais, não incluindo ameaças avançadas, ataques persistentes sofisticados ou cenários de engenharia social complexos. Esta limitação na cobertura dos testes de segurança implica que implementações em ambientes de produção críticos requerem avaliação de segurança mais abrangente e rigorosa para garantir proteção adequada contra vetores de ataque mais elaborados.

Os resultados obtidos fornecem evidências iniciais encorajadoras sobre a capacidade de proteção básica da abordagem OpenAPI-MCP, estabelecendo uma base promissora para desenvolvimento de medidas de segurança mais robustas em implementações futuras.

## 4.5 Funcionalidade do Sistema Multi-Servidor

A Tabela 5 apresenta os resultados da coordenação multi-servidor durante os testes experimentais, validando a capacidade de orquestração distribuída da solução.

**Tabela 5: Resultados da Coordenação Multi-Servidor**

| Funcionalidade             | Resultado Alcançado | Eficácia (%) | Observações                       |
| -------------------------- | ------------------- | ------------ | --------------------------------- |
| Servidores MCP Simultâneos | 2                   | 100          | Equipamentos + Profissionais      |
| Ferramentas Descobertas    | 10                  | 100          | Detecção automática completa      |
| Roteamento Inteligente     | 13/13 consultas     | 100          | Seleção correta de servidor       |
| Consultas Multi-Sistema    | 3                   | 100          | Agregação de dados funcionando    |
| Disponibilidade Parcial    | Testado             | 100          | Funcionamento com falhas parciais |

Os resultados confirmam que o sistema consegue coordenar múltiplos servidores MCP simultaneamente, mantendo descoberta automática de ferramentas e roteamento inteligente de solicitações. A capacidade de agregação de dados entre sistemas diferentes foi validada através de consultas que requereram informações de ambos os domínios testados (equipamentos e profissionais).

## 4.6 Validação Experimental

Os resultados apresentados indicam que a abordagem OpenAPI-MCP é tecnicamente viável e operacionalmente eficaz para integração de agentes conversacionais baseados em IA com sistemas web existentes dentro do escopo experimental testado:

**Conversão Automática OpenAPI→MCP:** 100% dos casos testados (10/10 endpoints)  
**Gerenciamento Multi-Servidor:** 2 servidores coordenados simultaneamente com 100% eficácia  
**Integração LLM:** Taxa de sucesso de 100% na interpretação de intenções (13/13 consultas)  
**Robustez Operacional:** Sistema mantém funcionalidade durante cenários de falha testados  
**Segurança:** 100% de proteção contra 16 vetores de ataque básicos testados  
**Experiência do Usuário:** Pontuação 4,0/5,0 em satisfação geral  

A validação experimental demonstra preliminarmente que a especificação OpenAPI pode ser sistematicamente convertida em ferramentas utilizáveis por modelos de linguagem através do protocolo MCP, reduzindo significativamente a necessidade de desenvolvimento manual recorrente para cada nova integração nos cenários testados. A validação experimental inicial confirma que a abordagem oferece uma solução promissora para democratização de acesso a sistemas técnicos complexos através de interfaces conversacionais naturais, estabelecendo evidências convincentes sobre a possibilidade de grandes avanços na integração entre sistemas existentes e LLMs.

**Reprodutibilidade:** Todos os testes e dados estão disponíveis no repositório público github.com/castrozan/tcc, incluindo scripts de automação, configurações de ambiente e datasets utilizados nos experimentos, garantindo reprodutibilidade completa dos resultados obtidos.

# 5 CONSIDERAÇÕES FINAIS

Este estudo respondeu de forma positiva à questão central de pesquisa, demonstrando que a combinação da especificação OpenAPI com o protocolo MCP pode facilitar a integração de agentes conversacionais baseados em IA com sistemas web existentes, dentro do escopo experimental testado. A validação experimental desenvolvida validou a viabilidade técnica da abordagem através de uma implementação funcional que incluiu geração automática de servidores MCP, gerenciamento coordenado de múltiplos servidores e validação através de cenários de teste controlados.

## 5.1 Resposta à Pergunta de Pesquisa 

A pergunta central de pesquisa - *"como a combinação da especificação OpenAPI com o protocolo MCP pode facilitar a integração eficiente e segura de agentes conversacionais baseados em IA com sistemas web existentes?"* - foi respondida preliminarmente através de evidências quantitativas obtidas na validação experimental, estabelecendo indicadores iniciais promissores sobre a viabilidade da abordagem proposta.

Em relação à eficiência operacional, a abordagem demonstrou viabilidade técnica inicial no contexto experimental testado, como demonstrado na Seção 4.1, com performance variável mas funcional e taxa de sucesso completa nos cenários avaliados. A conversão automática OpenAPI→MCP obteve êxito completo nos endpoints testados, segundo o detalhamento da Seção 4.2, evidenciando uma redução substancial da necessidade de desenvolvimento manual para os casos de uso implementados dentro do escopo experimental.

Quanto aos aspectos de segurança, os resultados demonstraram proteção adequada inicial contra os vetores básicos testados, de acordo com o apresentado na Seção 4.4, com taxa de proteção completa nos tipos de ataques fundamentais avaliados. A validação através de schemas OpenAPI comprovou-se eficaz como primeira linha de defesa contra tentativas de intrusão básicas, embora testes mais abrangentes sejam necessários para validação completa.

No que concerne à integração funcional, o escopo experimental revelou coordenação eficiente entre sistemas simultâneos com eficácia completa, descoberta automática total das ferramentas disponíveis e roteamento inteligente preciso para todas as consultas direcionadas, como detalhado na Seção 4.5. A experiência do usuário foi avaliada positivamente, obtendo pontuação satisfatória nos cenários testados, segundo os dados da Seção 4.3.

## 5.2 Contribuições Científicas

A validação experimental confirma que a abordagem OpenAPI-MCP oferece uma solução tecnicamente viável para os cenários testados, estabelecendo evidências experimentais convincentes sobre a possibilidade de grandes avanços na facilitação da integração entre sistemas existentes e LLMs. Os resultados quantitativos obtidos (100% taxa de sucesso nas conversões, 4,0/5,0 satisfação do usuário, proteção completa contra vetores básicos de ataque testados) fornecem evidências empíricas iniciais de eficácia funcional que justificam otimismo quanto ao potencial da abordagem.

A contribuição científica principal reside na demonstração inicial de viabilidade conceitual e no estabelecimento de uma metodologia reproduzível para avaliação de integrações similares, criando uma base sólida para desenvolvimentos futuros. Esta pesquisa comprova que a integração entre especificações OpenAPI e o protocolo MCP constitui uma solução viável para transformar APIs tradicionais em interfaces acessíveis a agentes baseados em LLMs, oferecendo um caminho claro para a democratização tecnológica.

## 5.3 Limitações do Estudo

A aplicabilidade prática em larga escala está condicionada às limitações identificadas durante a validação experimental. A variabilidade significativa de performance (336% de variação nos tempos de resposta) constitui uma limitação relevante que deve ser considerada em implementações futuras, evidenciando a necessidade de otimizações adicionais para ambientes com requisitos rigorosos de latência.

O escopo restrito de validação experimental (2 servidores MCP, 21 operações totais, cenários controlados) representa uma limitação fundamental que impede generalização ampla dos resultados para ambientes empresariais complexos. Os testes de segurança abrangeram exclusivamente ataques básicos e cenários fundamentais, não incluindo ameaças avançadas, ataques persistentes sofisticados ou cenários de engenharia social complexos, implicando que implementações em ambientes de produção críticos requerem avaliação de segurança mais abrangente e rigorosa.

## 5.4 Implicações Práticas

A abordagem OpenAPI-MCP oferece uma direção promissora para democratização do acesso a sistemas técnicos complexos, representando um avanço significativo na redução da complexidade tradicionalmente associada à integração de agentes conversacionais em ambientes empresariais. Os resultados estabelecem evidências preliminares robustas de que é possível simplificar drasticamente o processo de criação de interfaces conversacionais para sistemas existentes, eliminando grande parte da necessidade de desenvolvimento customizado manual.

A integração demonstrou-se tecnicamente viável para cenários onde a precisão é prioritária em relação à velocidade consistente, fornecendo evidências iniciais promissoras para o desenvolvimento de soluções mais robustas. O sistema conseguiu coordenar múltiplos servidores MCP simultaneamente, mantendo descoberta automática de ferramentas e roteamento inteligente de solicitações, validando a aplicabilidade prática da orquestração distribuída em ambiente conversacional.

## 5.5 Trabalhos Futuros

Embora sejam necessárias expansões do escopo experimental e refinamentos técnicos antes de implementações empresariais de larga escala, os fundamentos estabelecidos demonstram inequivocamente a possibilidade de grandes avanços na área, justificando investimentos adicionais em pesquisa e desenvolvimento para exploração completa do potencial da abordagem proposta.

Investigações futuras devem abordar as limitações identificadas através de: (1) otimização de performance para redução da variabilidade de latência; (2) expansão da validação experimental para ambientes empresariais de maior escala e complexidade; (3) desenvolvimento de avaliações de segurança mais abrangentes, incluindo ameaças avançadas e cenários de ataque sofisticados; (4) análise de escalabilidade para coordenação de dezenas ou centenas de servidores MCP simultâneos; (5) desenvolvimento de métricas mais rigorosas para avaliação da experiência do usuário em contextos organizacionais diversificados.

## 5.6 Conclusão

A validação experimental inicial confirma que a abordagem oferece uma solução promissora para democratização de acesso a sistemas técnicos complexos através de interfaces conversacionais naturais, estabelecendo evidências convincentes sobre a possibilidade de grandes avanços na integração entre sistemas existentes e LLMs. **Reprodutibilidade:** Todos os testes e dados estão disponíveis no repositório público github.com/castrozan/tcc, incluindo scripts de automação, configurações de ambiente e datasets utilizados nos experimentos, garantindo reprodutibilidade completa dos resultados obtidos.

Os fundamentos metodológicos e técnicos estabelecidos nesta pesquisa criam uma base sólida para o desenvolvimento de soluções mais abrangentes e robustas, contribuindo para o avanço científico na área de integração de agentes conversacionais em sistemas empresariais complexos. A abordagem OpenAPI-MCP representa um passo significativo em direção à democratização tecnológica, oferecendo um caminho viável para tornar sistemas especializados mais acessíveis através de interfaces conversacionais naturais e intuitivas.

# REFERÊNCIAS

[^1]: Graduando em Engenharia de software no semestre letivo de 2025-1. E-mail: castro.lucas290@gmail.com
[^2]: Professor do Centro Universitário UniSATC E-mail: thyerri.mezzari@satc.edu.br
