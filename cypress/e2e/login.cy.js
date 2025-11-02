describe('Login flow', () => {
  /*it.only('exibe erro ao tentar login com dados inválidos', () => {
    const slow = 1000;
    // Mock do login com erro
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Usuário ou senha inválidos.' }
    }).as('loginInvalido');

    // Preenche o formulário de login com dados inválidos
    cy.get('#login-form input[name=username]', { timeout: 10000 }).type('usuario-invalido');
    cy.wait(slow);
    cy.get('#login-form input[name=password]', { timeout: 10000 }).type('senha-errada');
    cy.wait(slow);
    cy.get('#login-form button[type="submit"]', { timeout: 10000 }).contains('Entrar').click();
    cy.wait('@loginInvalido');
    cy.wait(slow);

    // Verifica se a mensagem de erro é exibida
    cy.get('#error-message', { timeout: 10000 }).should('be.visible').and('contain', 'Usuário ou senha inválidos');
  });
*/

  beforeEach(() => {
    cy.visit('/');

  });

  it('successfully logs in and shows main UI (mocked)', () => {
    // Mock da API configurado para SUCESSO (Status 200)
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' }
    }).as('loginSuccess');

    // USAR CREDENCIAIS VÁLIDAS JÁ QUE O MOCK É 200
    cy.get("input[name=username]").first().type('usuario-valido');
    cy.get("input[name=password]").first().type('senha-valida');
    //cy.screenshot('antes de clicar em entrar')
    cy.get('button').contains('Entrar').click();

    // DEVE ESTAR DESCOMENTADO para garantir que a requisição de login ocorreu
    cy.wait('@loginSuccess');

    // After login the main buttons should be visible
    cy.contains('Listar Serviços').should('be.visible'); // Isto deve passar agora
    cy.contains('Novo Serviço').should('be.visible');
  });


  it('successfully registers a new service after login (mocked)', () => {
    // 1. MOCK DO LOGIN
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' }
    }).as('loginSuccess');

    // 2. MOCK DO CADASTRO (Requisição POST disparada pelo botão "Cadastrar Serviço")
    cy.intercept('POST', '/api/servicos', {
      statusCode: 201,
      body: { message: 'Serviço criado com sucesso!', id: 100 }
    }).as('cadastroServico');

    // 3. MOCK DA LISTAGEM (Requisição GET que é chamada após o cadastro bem-sucedido)
    cy.intercept('GET', '/api/servicos', {
      statusCode: 200,
      body: [{ id: 100, cliente: 'Cliente Teste', descricao: 'Teste de Cypress', data: '2025-11-01', status: 'Pendente' }]
    }).as('listarServicos');

    // SIMULA O LOGIN
    cy.get("input[name=username]").first().type('usuario-valido');
    cy.get("input[name=password]").first().type('senha-valida');
    cy.get('button').contains('Entrar').click();
    cy.wait('@loginSuccess');

    // Clicar em "Novo Serviço" (Abre o formulário)
    cy.contains('Novo Serviço').click();
    cy.get('#cadastro-servico-form').should('be.visible');

    // Preencher o Formulário
    cy.get('#cadastro-servico-form input[name="cliente"]').type('Cliente Teste');
    cy.get('#cadastro-servico-form input[name="descricao"]').type('Teste de Cypress');
    cy.get('#cadastro-servico-form input[name="data"]').type('2025-11-01');
    cy.get('#cadastro-servico-form input[name="status"]').type('Pendente');

    // Clicar no botão "Cadastrar Serviço" (Submete o formulário e dispara a requisição POST)
    cy.get('#cadastro-servico-form button[type="submit"]').contains('Cadastrar Serviço').click();

    // Aguardar e validar as requisições
    cy.wait('@cadastroServico').its('request.body').should('deep.equal', {
      cliente: 'Cliente Teste',
      descricao: 'Teste de Cypress',
      data: '2025-11-01',
      status: 'Pendente'
    });
    cy.wait('@listarServicos');

    // Verificação final: A lista de serviços deve estar visível com o novo item
    cy.contains('Cliente Teste').should('be.visible');
    cy.contains('Teste de Cypress').should('be.visible');
  });
});



