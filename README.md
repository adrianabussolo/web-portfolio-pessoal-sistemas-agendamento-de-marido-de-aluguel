## Testes de carga com k6


1. Instale o k6:
   - Siga as instruções oficiais: https://grafana.com/docs/k6/latest/using-k6/installation/

2. Execute os testes usando o terminal Git Bash:
   ```bash
   k6 run tests/login.test.js
   ```

3. Para gerar o dashboard web:
   ```bash
   K6_WEB_DASHBOARD=true k6 run tests/login.test.js
   ```

### Exemplo de payload para login
```json
{
  "username": "admin",
  "password": "admin123"
}
```
Endpoint: `POST http://localhost:3000/auth/login`
# Sistema de Agendamento de Marido de Aluguel

Aplicação web para agendamento de serviços de marido de aluguel.

## Funcionalidades
- Login de usuários (JWT)
- Cadastro e listagem de serviços
- Integração com API backend (definida em `resources/swagger.yaml`)
- Documentação interativa via Swagger UI
- Frontend em HTML/CSS com Bulma
- Mensagens de erro customizadas

## Como rodar
1. Instale as dependências:
   ```
   npm install
   ```
2. Inicie a aplicação web:
   ```
   npm start
   ```

Acesse em [http://localhost:4000](http://localhost:4000)
A API backend deve estar rodando em [http://localhost:3000](http://localhost:3000).

Acesse a documentação da API em [http://localhost:4000/docs](http://localhost:4000/docs)


## Testes end-to-end com Cypress

1. Instale o Cypress como dependência de desenvolvimento (uma vez):

```powershell
npm install --save-dev cypress
```

2. Abra a interface interativa do Cypress:

```powershell
npm run cy:open
```

3. Rodar testes em modo headless:

```powershell
npm run cy:run
```

Observações:
- Os testes esperam que a aplicação web esteja rodando em `http://localhost:4000`.
- O exemplo criado em `cypress/e2e/login.cy.js` usa `cy.intercept` para simular respostas da API. Para testar com a API real, remova ou ajuste os intercepts no teste e garanta que o backend em `http://localhost:3000` implemente as rotas `/auth/login` e `/auth/register`.

