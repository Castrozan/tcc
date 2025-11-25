# PITCH ECC - ChatBridge

## 🎬 **Fluxo do Pitch (5 min / até 10 slides)**

### 🔹 Slide 1 — Elevator Ride (0 – 0:30)

Gancho + Problema + Oportunidade

> "Implementar IA em cada sistema da Betha? O que vocês acham? Meses de desenvolvimento por sistema.
> Mas e se eu te disser que a gente pode implementar isso automaticamente e em minutos?"

---

### 🔹 Slide 2 — O Desafio Interno (0:30 – 1:00)

Mostrar a dor real da Betha e de seus clientes.

> "Nossos clientes — gestores e servidores municipais — trabalham com sistemas para completar tarefas complexas, como emitir nota fiscal, consultar tributos, aprovar documentos. Os servidores precisam navegar por dezenas de telas, clicar inúmeras vezes e aprender a usar cada sistema.
> E a gente sabe que a Betha tem um enorme ecossistema de aplicações, e ai que está o problema, pois integrá-las com IA do zero levaria meses de desenvolvimento, **por sistema**.
> Enquanto isso, empresas do mercado tech e as concorrentes diretos da Betha já anunciam 'soluções com IA'. Isso significa que estamos perdendo tempo e diferencial competitivo."

Visual: Diagrama mostrando múltiplos sistemas desconectados vs. tempo de integração tradicional.

---

### 🔹 Slide 3 — A Solução que Desenvolvemos (1:00 – 1:30)
Produto + Como funciona + Demo

> "Por esse motivo desenvolvemos um motor que lê as especificações OpenAPI dos sistemas da Betha e gera **automaticamente** agentes conversacionais.
> Em vez de meses de desenvolvimento, conectamos um sistema em **minutos**.
> E agora? Como nossos usuários vão interagir com o sistema em conjunto com o agente? Uma única conversa: 'Emita nota fiscal para fornecedor X'. O agente executa todas as etapas uma depois da outra, consultando múltiplos sistemas as vezes, pedindo mais informação para o usuário, informa o progresso em tempo real e conclui uma atividade.
> Como vocês puderam ver na demo." *(inserir gif demonstrando o app MAXIMIZADO)*

---

### 🔹 Slide 4 — O Mercado ea Oportunidade (1:30 – 2:00)

Contextualizar o mercado de IA e o posicionamento da Betha.

> "O mercado global de IA conversacional deve ultrapassar US$ 32 bilhões até 2030.
> No Brasil, o setor público representa uma fatia significativa desse mercado tech — e a Betha no top 1 do mercado GOV. Estamos perfeitamente posicionados.
> Nossos concorrentes diretos (IPM Sistemas, TOTVS, ELOTECH) estão também nesta corrida para implementar IA nos sistemas, mas com nossa solução automatizada, a Betha sai na frente com **diferencial competitivo real** em licitações e renovações. Todos os sistemas integrados com IA!"

Visual: Mercado de IA + posicionamento da Betha vs. concorrentes no setor público.

---

### 🔹 Slide 5 — O Modelo de Inovação Interna (2:00 – 2:30)

Mostrar como o projeto se sustenta e gera valor.

> A Betha aproveita toda infraestrutura, sistemas e conhecimento que já possui dos serviços e ecossistema, sem se preocupar com mais código ou times.
> O retorno vem de três frentes:
> 1. **Diferencial em licitações** — seremos os primeiros com IA nativa integrada entre todos os sistemas
> 2. **Redução de custos** — sem implementação nova, reaproveitamos tudo, isso resulta em menos suporte e menos treinamento
> 3. **Fidelização de clientes** — Transformamos a experiência do usuário com um agente que os ajuda a utilizar o sistema

Visual: Diagrama de valor gerado (diferencial competitivo + redução de custos + fidelização).

---

### 🔹 Slide 6 — Comparação com Alternativas (2:30 – 3:00)

Mostrar por que não usar soluções prontas do mercado.

> "Poderíamos contratar outras empresas para fazer integração com IA, Dialogflow, Power Virtual Agents ou Botpress.
> Mas essas soluções exigem configuração manual pesada, não entendem nossos sistemas, e custam caro em licenças externas.
> **Nossa vantagem:**
> - Automação completa: OpenAPI → agente conversacional em minutos
> - Conhecimento interno: entendemos os sistemas da Betha
> - Custo: investimento interno vs. licenças mensais externas
> - Compliance: dados sensíveis de prefeituras permanecem sob nosso controle (LGPD)"

Visual: Tabela comparativa com checkmarks mostrando nossas vantagens.

---

### 🔹 Slide 7 — Usuários e Impacto Real (3:00 – 3:30)

Mostrar quem se beneficia e como.

> "Três públicos se beneficiam diretamente:
> - **1. Servidores municipais:** Acessam informações rapidamente conversando, sem precisar dominar múltiplos sistemas.
> - **2. Gestores da Betha:** Ganham diferencial competitivo em vendas e licitações.
> - **3. Time de suporte:** Reduz chamados repetitivos, pois o assistente responde dúvidas comuns automaticamente.
> Estamos preparando a Betha para a **era da IA agentiva no setor público**."

Visual: Personas dos três públicos + benefícios.

---

### 🔹 Slide 8 — Tecnologia e Arquitetura (3:30 – 4:00)

Mostrar solidez técnica (importante para público técnico).

> "A solução é robusta e escalável:
> - **Gerador automático de agentes MCP** que lê OpenAPI e cria servidores conversacionais
> - **Cliente de chat multi-servidor** que orquestra múltiplos sistemas simultaneamente
> - **Integração nativa** com sistemas existentes da Betha (tributos, saúde, educação, etc.)
> Tudo desenvolvido com TypeScript, Node.js, protocolo MCP e modelos GPT."

Visual: Diagrama de arquitetura simplificado.

---

### 🔹 Slide 9 — Time de Intraempreendedorismo (4:00 – 4:30)

Apresentar a equipe e expertise.

> "Somos uma equipe multidisciplinar que uniu expertise técnica e visão de negócio:
> - **Bruno Dimon** – Arquitetura backend e integração de sistemas
> - **Douglas Kuerten** – Especialista em APIs e integrações empresariais
> - **Lucas Zanoni** – IA, agentes conversacionais e arquitetura de plataforma
> - **Joel Francisco** – Interface do usuário e experiência conversacional
> - **Vinicius Milanez** – Infraestrutura, deploy e operação
> Desenvolvemos, validamos e testamos o MVP que vocês acabaram de ver — tudo aproveitando o ecossistema da Betha."

---

### 🔹 Slide 10 — Próximos Passos e Visão de Futuro (4:30 – 5:00)

Visão + Roadmap + Call to Action

> "**Próximos passos:**
> 1. Piloto interno com sistemas da Betha (Studio aplicações, Documentos, Saúde)
> 2. Validação com clientes-piloto em 2 prefeituras parceiras
> 3. Expansão para todo ecossistema de sistemas da Betha em 2026
> **Nossa visão:** Tornar a Betha Sistemas a referência em **gestão municipal inteligente**, onde qualquer servidor pode acessar qualquer informação simplesmente conversando.
> A IA agentiva não é o futuro — é o presente. E a Betha pode estar na liderança.
