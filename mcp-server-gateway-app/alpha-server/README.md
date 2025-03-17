# Partner Mock Application

Este projeto contém uma aplicação configurada como mock para demonstrar a utilização do serviço de gateway. A definição da aplicação pode ser encontrada em `./partner-mock-application`. Ela disponibiliza endpoints para autenticação e para simular uma aplicação genérica do parceiro.

## Funcionamento

1. **Autenticação**: A aplicação mock possui um endpoint para autenticação, onde as credenciais são geradas e retornadas.
2. **Simulação de Aplicação do Parceiro**: A aplicação mock simula uma aplicação genérica do parceiro, respondendo às requisições redirecionadas pelo gateway em qualquer path para simular multiplos endpoints.

## Execução

Ao executar ambas as aplicações (gateway e mock), é possível realizar uma requisição para o gateway em qualquer path (`localhost:3000`). O gateway redirecionará a requisição para a aplicação mock (`localhost:3001`), anexando as credenciais de autenticação obtidas no processo de autenticação.

## Retorno da Requisição

A aplicação mock retornará o status da requisição e os dados recebidos ao processar a requisição redirecionada pelo gateway.
