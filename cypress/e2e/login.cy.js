
beforeEach(() => {
   cy.visit('/');
   cy.wait(2000);
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
  body: [
    { id: 100, cliente: 'Cliente Teste1', descricao: 'Troca de instalação elétrica', data: '2025-11-01', status: 'Pendente' },
    { id: 101, cliente: 'Cliente Teste2', descricao: 'Troca de chuveiro', data: '2025-12-01', status: 'Concluído' }
  ]
}).as('listarServicos');
  
  
  // SIMULA O LOGIN
  cy.get("input[name=username]").first().type('admin');
  cy.get("input[name=password]").first().type('admin123');
  cy.get('button').contains('Entrar').click();
  cy.wait('@loginSuccess');

  // Clicar em "Novo Serviço" (Abre o formulário)
  cy.contains('Novo Serviço').click();
  cy.get('#cadastro-servico-form').should('be.visible');

  // Preencher o Formulário
  cy.get('#cadastro-servico-form input[name="cliente"]').type('Cliente Teste1');
  cy.get('#cadastro-servico-form input[name="descricao"]').type('Troca de instalação elétrica');
  cy.get('#cadastro-servico-form input[name="data"]').type('2025-11-01');
  cy.get('#cadastro-servico-form input[name="status"]').type('Pendente');

   
  // --- Segundo cadastro ---
  cy.contains('Novo Serviço').click();
  //cy.get('#cadastro-servico-form').should('be.visible');
  cy.get('#cadastro-servico-form input[name="cliente"]').type('Cliente Teste2');
  cy.get('#cadastro-servico-form input[name="descricao"]').type('Troca de chuveiro');
  cy.get('#cadastro-servico-form input[name="data"]').type('2025-12-01');
  cy.get('#cadastro-servico-form input[name="status"]').type('Concluído');
 

  // Clicar no botão "Cadastrar Serviço" (Submete o formulário e dispara a requisição POST)
  cy.get('#cadastro-servico-form button[type="submit"]').contains('Cadastrar Serviço').click();


  cy.wait('@listarServicos');

    // Verificação final: a lista de serviços deve estar visível com os dois itens
  //cy.wait('@listarServicos');
  cy.contains('Cliente Teste1').should('be.visible');
  cy.contains('Troca de instalação elétrica').should('be.visible');
  cy.contains('Cliente Teste2').should('be.visible');
  cy.contains('Troca de chuveiro').should('be.visible');
});

 




