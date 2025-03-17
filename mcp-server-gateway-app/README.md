# Documentação **mcp-server-gateway-app**

## **Índice**

- [Documentação **mcp-server-gateway-app**](#documentação-mcp-server-gateway-app)
  - [**Índice**](#índice)
  - [**Visão Geral**](#visão-geral)
  - [**Funcionamento Geral**](#funcionamento-geral)
    - [**Diagrama de Sequência**](#diagrama-de-sequência)
  - [**Demonstraçao de funcionamento**](#demonstraçao-de-funcionamento)
  - [**Execução**](#execução)
    - [**Requisitos**](#requisitos)
  - [**Testes**](#testes)

---

## **Visão Geral**

O projeto **mcp-server-gateway-app** é uma aplicação **Node.js** que atua como conector entre o MCP client em formato de um LLM generalista, neste caso Claude Desktop, e um ecossistema de MCP servers.

O MCP server gateway é responsável por:

- Registrar e gerenciar MCP servers.
- Gerenciar o acesso do usuário a interface do LLM (MCP client).
<!-- TODO: implement authorization for users -->
<!-- - Permitir a definição personalizada de autenticação e autorização de usuários ao LLM (MCP client). -->
- Lidar com as credenciais de acesso do MCP client para o MCP server.

---

## **Funcionamento Geral**

1. Ao acessar o Claude Desktop, o usuário tem acesso a serie de mcp servers registrados no gateway.
2. O usuário pode cadastrar um novo mcp server no gateway.
3. O usuário pode editar um mcp server já cadastrado no gateway.
4. O usuário pode deletar um mcp server já cadastrado no gateway.

### **Diagrama de Sequência**

![Diagrama de Sequência](notfound.png)

---

## **Demonstraçao de funcionamento**

Em ../mcp há um exemplo de implementação do MCP client com Claude Desktop.

A aplicação do gateway deve lidar com o arquivo de configuração do MCP client, que se encontra em `../mcp/claude-desktop-config.json`, gerenciando crud de mcp servers.

---

## **Execução**

### **Requisitos**

- **Node.js** versão **22**
- **npm** versão **10**

1. **Instale as dependências**:
    ```bash
    npm install
    ```
2. **Build e execução** em produção:
    ```bash
    npm run build
    npm start
    ```

---

## **Testes**

Este projeto utiliza **Jest** e **Supertest** para testes unitários e de integração.  
Para executa-los, utilize:

```bash
npm run test
```
