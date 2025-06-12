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
  - **Padrão da Indústria:** Especificação OpenAPI 3.0+ amplamente adotada para documentação estruturada de APIs RESTful (OpenAPI Initiative, 2023);
  - **Interoperabilidade:** Facilita integração entre sistemas heterogêneos através de contratos de interface padronizados;
  - **Esquemas de Segurança:** Suporte nativo para OAuth, API Key e Bearer Token, essencial para agentes conversacionais;
  - **Documentação Estruturada:** Formato legível por máquina que permite geração automática de ferramentas de integração;
  - **Base da Conversão:** Fundamento técnico para transformação automática em servidores MCP funcionais.
- **Why:**
  - Demonstra por que OpenAPI é a escolha técnica ideal para a pesquisa, destacando características específicas que viabilizam a conversão automática para MCP e integração com agentes conversacionais.
- **Speech script:**
  - A especificação OpenAPI representa um dos pilares fundamentais da nossa abordagem de integração. A OpenAPI ou mais conhecido Swagger, consolidou-se como padrão da indústria para documentação estruturada de APIs RESTful, sendo amplamente adotada por empresas e desenvolvedores globalmente. Sua importância para nossa pesquisa reside em características técnicas específicas que a tornam ideal para integração com agentes conversacionais. Primeiro, OpenAPI oferece interoperabilidade excepcional, facilitando a integração entre sistemas heterogêneos através de contratos de interface padronizados que definem precisamente como diferentes sistemas podem se comunicar. Segundo, sua documentação estruturada em formato legível por máquina permite geração automática de ferramentas de integração, característica fundamental que viabiliza nosso gerador automático de servidores MCP. Por fim, OpenAPI serve como base técnica sólida para a conversão automática que desenvolvemos, onde especificações existentes são sistematicamente transformadas em servidores MCP funcionais, eliminando desenvolvimento manual recorrente.
- **Speech instructions:**
  - Enfatizar "padrão da indústria" para destacar a legitimidade técnica. Pausar após enumerar cada característica ("Primeiro", "Segundo", "Por fim") para estruturar claramente os benefícios. Destacar "geração automática" como conceito central da pesquisa.

### **Slide 7: Model Context Protocol**
- **Title**
  - Model Context Protocol (MCP)
- **Content (bullet points, images, tables, etc.):**
  - **Padrão Aberto:** Desenvolvido pela Anthropic e lançado em novembro de 2024 como protocolo de comunicação padronizada (ANTHROPIC, 2024);
  - **Arquitetura Cliente-Servidor:** Conecta servidores MCP a clientes (aplicações de chat) que gerenciam a integração com LLMs;
  - **Conversão de Ferramentas:** Cliente converte ferramentas MCP para funcionalidade de function calling dos modelos de linguagem;
  - **Interoperabilidade:** Facilita integração entre diferentes fontes de dados e aplicações cliente sem desenvolvimento customizado;
  - **Fundamento da Pesquisa:** Base técnica que viabiliza a conversão automática OpenAPI→MCP e coordenação multi-servidor.
- **Why:**
  - Explica o protocolo MCP como inovação recente que tornou possível a abordagem da pesquisa, destacando como sua arquitetura padronizada resolve o problema histórico de integrações customizadas entre chats com LLMs e sistemas externos.
- **Speech script:**
  - O Model Context Protocol representa uma inovação fundamental que tornou nossa pesquisa possível. Desenvolvido pela Anthropic e lançado como padrão aberto em novembro de 2024, o MCP surgiu para resolver um problema histórico na integração de aplicações conversacionais com sistemas externos. Antes do MCP, cada integração entre uma aplicação cliente e uma fonte de dados externa requeria desenvolvimento customizado específico de funções, criando barreiras significativas para a integração com sistemas. O MCP introduz uma arquitetura cliente-servidor padronizada onde servidores MCP se conectam a clientes - em nosso caso, a aplicação de chat - que gerenciam a integração com os modelos de linguagem. O cliente é responsável por converter as ferramentas MCP para a funcionalidade de function calling dos LLMs, criando uma ponte padronizada entre sistemas externos e capacidades conversacionais. Esta arquitetura é revolucionária porque permite que qualquer aplicação cliente compatível possa interagir com qualquer servidor MCP sem modificações específicas, facilitando a integração entre diferentes fontes de dados e aplicações sem necessidade de desenvolvimento customizado para cada combinação. Para nossa pesquisa, o MCP serve como fundamento técnico essencial que viabiliza tanto a conversão automática de especificações OpenAPI em servidores MCP funcionais quanto a coordenação eficiente de múltiplos servidores simultaneamente através de nossa aplicação cliente.
- **Speech instructions:**
  - Enfatizar "novembro de 2024" para destacar o quão recente e inovador é o protocolo. Pausar após "problema histórico" para dar ênfase ao desafio que o MCP resolve. Destacar "aplicação cliente" e "conversão de ferramentas" como conceitos centrais da arquitetura.

### **Slide 8: Critérios de Segurança e Usabilidade**
- **Title**
  - Critérios de Segurança e Usabilidade
- **Content (bullet points, images, tables, etc.):**
  - **Segurança - Red Teaming:** Testes adversários incluindo SQL injection, command injection, data extraction e privilege escalation (NIST, 2023; OWASP, 2025);
  - **Resistência a Prompt Injection:** Mensuração de tentativas maliciosas bloqueadas durante testes sistemáticos de segurança;
  - **Usabilidade Quantitativa:** Tempo de conclusão de tarefas CRUD via linguagem natural e curva de aprendizado;
  - **Usabilidade Qualitativa:** Precisão, clareza e utilidade das respostas em escala 1-5;
  - **Testes End-to-End:** Playwright para automação e coleta objetiva de métricas reproduzíveis.
- **Why:**
  - Estabelece os critérios científicos rigorosos para validação experimental, demonstrando como aspectos críticos de segurança e experiência do usuário são mensurados objetivamente para garantir validade científica dos resultados.
- **Speech script:**
  - Para garantir validação experimental rigorosa, estabelecemos critérios objetivos de avaliação em duas dimensões críticas: segurança e usabilidade. Na dimensão de segurança, implementamos uma abordagem abrangente de red teaming baseada nos frameworks do NIST e OWASP, reconhecidos internacionalmente como padrões para avaliação de segurança em sistemas de IA. Nossos testes adversários incluem quatro categorias principais: SQL injection para testar robustez contra manipulação de banco de dados, command injection para verificar proteção contra execução de comandos do sistema, data extraction para avaliar resistência à extração não autorizada de informações sensíveis, e privilege escalation para validar proteção contra tentativas de elevação de privilégios. Especial atenção foi dada à resistência a prompt injection, uma ameaça crítica específica para sistemas LLM, onde mensuramos o percentual de tentativas maliciosas efetivamente bloqueadas. Na dimensão de usabilidade, adotamos métricas tanto quantitativas quanto qualitativas. Quantitativamente, medimos tempo de conclusão de tarefas CRUD executadas via linguagem natural e analisamos a curva de aprendizado dos usuários. Qualitativamente, avaliamos três aspectos fundamentais em escala de 1 a 5: precisão das respostas em relação à intenção do usuário, clareza na estruturação das informações, e utilidade prática para tomada de decisão. Toda essa instrumentação é operacionalizada através de testes end-to-end automatizados com Playwright, garantindo coleta objetiva e reproduzível de métricas que fundamentam cientificamente nossas conclusões.
- **Speech instructions:**
  - Enfatizar "validação experimental rigorosa" e "critérios objetivos" para destacar o rigor científico. Pausar após enumerar cada categoria de ataque para dar clareza. Destacar "NIST e OWASP" como autoridades reconhecidas. Enfatizar "reproduzível" como característica essencial da metodologia científica.

### **Slide 9: Metodologia**
- **Title**
  - Metodologia
- **Content (bullet points, images, tables, etc.):**
  - **Abordagem Experimental:** Estruturada em etapas sequenciais para validação da viabilidade técnica OpenAPI-MCP;
  - **Revisão Sistemática:** Consolidação de conhecimentos científicos sobre integração OpenAPI-MCP;
  - **Prova de Conceito:** Desenvolvimento de gerador automático MCP, cliente multi-servidor e aplicações de teste;
  - **Validação Rigorosa:** Testes automatizados end-to-end com Playwright para métricas objetivas e reproduzíveis;
  - **Critérios Científicos:** Avaliação de desempenho, segurança (red teaming) e usabilidade em ambiente controlado.
- **Why:**
  - Estabelece o rigor metodológico científico necessário para validação experimental da hipótese, demonstrando como a pesquisa garante resultados objetivos e reproduzíveis através de instrumentação técnica precisa.
- **Speech script:**
  - Nossa metodologia foi estruturada para garantir rigor científico e reprodutibilidade dos resultados experimentais. Adotamos uma abordagem experimental estruturada em etapas sequenciais, começando com uma revisão sistemática da literatura para consolidar conhecimentos científicos sobre integração OpenAPI-MCP e embasar teoricamente nossa fase experimental. O núcleo da metodologia consistiu no desenvolvimento de uma prova de conceito abrangente, incluindo quatro componentes principais: primeiro, um gerador automático de servidores MCP a partir de especificações OpenAPI; segundo, um cliente de chat capaz de gerenciar múltiplos servidores simultaneamente; terceiro, aplicações de teste de ponta a ponta para validação da abordagem; e quarto, geração de métricas de avaliação para medir desempenho, segurança e experiência do usuário. Para assegurar resultados objetivos e reproduzíveis, implementamos validação rigorosa através de testes automatizados end-to-end utilizando Playwright, permitindo simulação realista das interações do usuário com coleta automática de dados. Estabelecemos critérios científicos específicos para avaliação em três dimensões críticas: desempenho através de métricas de tempo de resposta e taxa de sucesso, segurança através de testes de red teaming, e usabilidade através de métricas quantitativas e qualitativas em escala padronizada. Esta metodologia buscou estabelecer indicadores iniciais da eficácia da abordagem dentro de um escopo experimental controlado, reconhecendo que validações mais abrangentes serão necessárias para confirmação definitiva em ambientes empresariais complexos.
- **Speech instructions:**
  - Enfatizar "rigor científico" e "reprodutibilidade" como pilares metodológicos fundamentais. Pausar após enumerar cada componente da prova de conceito ("primeiro", "segundo", "terceiro", "quarto") para dar clareza estrutural. Destacar "Playwright" como ferramentas e frameworks reconhecidos. Enfatizar "escopo experimental controlado" para contextualizar as limitações do estudo.

### **Slide 10: Arquitetura Geral**
- **Title**
  - Arquitetura Geral
- **Content (bullet points, images, tables, etc.):**
  - ![Diagrama da arquitetura de alto nível](images/metodos/system-architecture.jpg)
- **Why:**
  - Demonstra visualmente como os componentes da solução OpenAPI-MCP se integram para formar um sistema coeso, facilitando a compreensão da audiência sobre a complexidade técnica e a elegância da solução proposta.
- **Speech script:**
  - A arquitetura geral do nosso sistema foi projetada seguindo princípios de modularidade e separação de responsabilidades para garantir escalabilidade e manutenibilidade. Como podemos observar no diagrama, nossa solução é estruturada em múltiplas camadas que trabalham de forma integrada para responder às consultas feitas pelo usuário em linguagem natural. O fluxo de dados inicia na interface web minimalista, desenvolvida especificamente para nossos testes experimentais, que captura as consultas do usuário e as encaminha para o backend implementado em Node.js. Este backend atua como orquestrador central, gerenciando a comunicação com o modelo de linguagem GPT-4, que por sua vez utiliza sua capacidade de function calling para interpretar a intenção do usuário e determinar quais ferramentas MCP devem ser utilizadas. Os servidores MCP, gerados automaticamente a partir das especificações OpenAPI, servem como ponte padronizada entre o modelo de linguagem e os sistemas externos, executando as operações solicitadas via APIs REST conforme as especificações OpenAPI originais. A arquitetura modular permite isolamento completo de responsabilidades, onde cada componente pode ser instrumentado, testado e mantido de forma independente, facilitando tanto o desenvolvimento quanto a operação em ambiente de produção. Esta separação é fundamental para nossa validação experimental, pois permite controle rigoroso das variáveis e coleta objetiva de métricas de performance, segurança e usabilidade em cada camada do sistema.
- **Speech instructions:**
  - Referir-se ao diagrama durante toda a explicação, apontando para os componentes conforme mencionados. Enfatizar "modularidade" e "separação de responsabilidades" como princípios arquiteturais fundamentais. Pausar após descrever cada camada do fluxo de dados para dar clareza. Destacar "function calling" e "especificações OpenAPI" como tecnologias-chave. Enfatizar "validação experimental" para conectar com os objetivos da pesquisa.

### **Slide 11: Gerador Automático MCP**
- **Title**
  - Gerador Automático MCP
- **Content (bullet points, images, tables, etc.):**
  - ![Diagrama da arquitetura de geração MCP](images/desenvolvimento/mcp-generator-architecture.jpg)
- **Why:**
  - Demonstra visualmente o núcleo metodológico da contribuição científica proposta, mostrando como especificações OpenAPI são sistematicamente convertidas em servidores MCP funcionais através de três camadas funcionais bem definidas.
- **Speech script:**
  - O gerador automático de servidores MCP representa o núcleo metodológico da nossa contribuição científica, desenvolvido para abordar o principal desafio de padronização de integrações heterogêneas de APIs. Como podemos observar no diagrama, a arquitetura foi estruturada em três camadas funcionais distintas, cada uma com responsabilidades bem definidas que contribuem para a conversão sistemática de especificações OpenAPI em servidores MCP funcionais. A primeira camada, denominada Análise Sintática ou Parsing, é responsável pela extração e validação rigorosa de metadados de endpoints a partir de especificações OpenAPI 3.0+, incluindo validação de conformidade com o padrão estabelecido, resolução de referências dollar-ref e preparação dos dados para processamento subsequente. A segunda camada, Mapeamento Semântico MCP, realiza a conversão inteligente de operações OpenAPI para ferramentas compreensíveis pelos modelos de linguagem, preservando a semântica original das operações enquanto adiciona metadados necessários para o protocolo MCP, como informações de roteamento e validação de parâmetros. A terceira camada, Geração de Ferramentas MCP, materializa o processo através da produção de servidores MCP armazenados em memória, prontos para serem utilizados por clientes MCP. Esta abordagem metodológica atende diretamente ao nosso primeiro objetivo específico de desenvolver um gerador automático de servidores MCP, estabelecendo um processo sistemático e reproduzível para conversão de especificações API em ferramentas de agentes conversacionais. A escolha da arquitetura em camadas fundamentou-se na necessidade de criar um processo de validação controlado, onde cada etapa pode ser independentemente verificada e os resultados podem ser objetivamente mensurados, garantindo a integridade semântica completa da operação OpenAPI original.
- **Speech instructions:**
  - Referir-se constantemente ao diagrama, apontando para cada camada conforme mencionada. Enfatizar "núcleo metodológico" e "contribuição científica" para destacar a importância. Pausar após descrever cada camada ("primeira camada", "segunda camada", "terceira camada") para dar clareza estrutural. Destacar "sistemático e reproduzível" como características científicas fundamentais. Pronunciar "dollar-ref" em inglês para "$ref". Enfatizar "integridade semântica" como garantia técnica crucial.

### **Slide 12: Cliente Multi-servidor MCP**
- **Title**
  - Cliente Multi-servidor MCP
- **Content (bullet points, images, tables, etc.):**
  - ![Configuração do cliente de chat possibilitando a adição de novos servidores MCP](images/chat/chat-server-configuration.jpg)
- **Why:**
  - Demonstra visualmente a implementação metodológica do segundo objetivo específico da pesquisa, mostrando como a orquestração simultânea de múltiplos servidores MCP é viabilizada através de descoberta automática, roteamento inteligente e configuração dinâmica em ambiente conversacional.
- **Speech script:**
  - O cliente de chat multi-servidor representa a implementação metodológica do nosso segundo objetivo específico, desenvolvido como ferramenta de validação experimental para demonstrar a viabilidade prática da orquestração simultânea de múltiplos servidores MCP em ambiente conversacional. Como podemos observar na interface de configuração, enfrentamos um desafio metodológico fundamental relacionado à coordenação eficiente de múltiplos servidores MCP simultaneamente, problema que se enquadra teoricamente no domínio de sistemas distribuídos e coordenação de agentes. A complexidade emergiu da necessidade de manter conexões ativas, descobrir dinamicamente capacidades disponíveis e rotear solicitações baseadas na análise semântica da intenção do usuário, tudo isso preservando a experiência conversacional natural. Nossa solução metodológica implementou um sistema de coordenação baseado em descoberta automática de ferramentas, criando um inventário dinâmico das funcionalidades acessíveis em cada servidor. O roteamento inteligente utiliza análise contextual para determinar qual servidor utilizar baseado nas ferramentas disponíveis e na natureza da solicitação, enquanto o mecanismo de agregação de resultados permite combinar informações de múltiplos servidores quando necessário. A arquitetura de configuração foi concebida para proporcionar flexibilidade operacional através de mecanismos dinâmicos de adição e remoção de servidores, eliminando a necessidade de reinicialização do sistema durante modificações na topologia de serviços. Como ilustrado na interface, usuários podem especificar comandos de execução e variáveis de ambiente através de interface gráfica intuitiva, facilitando a integração de novos serviços à medida que são descobertos ou desenvolvidos. A arquitetura suporta visualização em tempo real do estado dos servidores ativos, possibilitando monitoramento contínuo da saúde do sistema e identificação proativa de potenciais problemas de conectividade.
- **Speech instructions:**
  - Referir-se constantemente à interface de configuração mostrada no diagrama. Enfatizar "segundo objetivo específico" para conectar com os objetivos da pesquisa. Pausar após "sistemas distribuídos e coordenação de agentes" para destacar a complexidade teórica. Destacar "descoberta automática" e "roteamento inteligente" como inovações técnicas centrais. Enfatizar "flexibilidade operacional" e "dinâmicos" para mostrar as vantagens práticas da solução. Apontar para elementos específicos da interface conforme mencionados.

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
