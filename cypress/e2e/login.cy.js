describe('Login flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('shows error message when login fails (mocked)', () => {
    // Mock the API returning 401
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Credenciais inválidas' }
    }).as('loginFail');
   
    // CORRIGIDO: Descomentado para que o teste execute a ação de login
    cy.get("input[name=username]").type('usuario-invalido');
    cy.get("input[name=password]").type('senha-invalida');
    cy.get('button').contains('Entrar').click();

    // CORRIGIDO: Descomentado para aguardar a resposta mockada e fazer a asserção
    cy.wait('@loginFail');

    cy.get('#error-message').should('be.visible').and('contain', 'Credenciais inválidas');
  });

  it('successfully logs in and shows main UI (mocked)', () => {
    // Mock the API returning a token
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' }
    }).as('loginSuccess');
    
    // CORRIGIDO: "texto" não é um comando Cypress válido, o comando correto é "type"
    cy.get("input[name=username]").type('usuario'); 
    cy.get("input[name=password]").type('senha');
    cy.get('button').contains('Entrar').click();

    // CORRIGIDO: Descomentado para aguardar a resposta mockada
    cy.wait('@loginSuccess');

    // After login the main buttons should be visible
    // CORRIGIDO: Descomentado para verificar o primeiro botão
    cy.contains('Listar Serviços').should('be.visible'); 
    cy.contains('Novo Serviço').should('be.visible');
  });
});
//******** TESTE 01