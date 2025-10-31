let jwtToken = null;

function showError(message) {
  const errorDiv = document.getElementById('error-message');
  errorDiv.textContent = message;
  errorDiv.classList.remove('is-hidden');
}
function hideError() {
  document.getElementById('error-message').classList.add('is-hidden');
}

function showAuth() {
  document.getElementById('auth-section').innerHTML = `
    <div class="box">
      <h2 class="subtitle">Login</h2>
      <form id="login-form">
        <div class="field">
          <label class="label">Usuário</label>
          <div class="control">
            <input class="input" type="text" name="username" required>
          </div>
        </div>
        <div class="field">
          <label class="label">Senha</label>
          <div class="control">
            <input class="input" type="password" name="password" required>
          </div>
        </div>
        <button class="button is-primary" type="submit">Entrar</button>
      </form>
    </div>
    <div class="box">
      <h2 class="subtitle">Cadastro de Usuário</h2>
      <form id="register-form">
        <div class="field">
          <label class="label">Usuário</label>
          <div class="control">
            <input class="input" type="text" name="username" required>
          </div>
        </div>
        <div class="field">
          <label class="label">Senha</label>
          <div class="control">
            <input class="input" type="password" name="password" required>
          </div>
        </div>
        <button class="button is-link" type="submit">Cadastrar</button>
      </form>
    </div>
  `;
  document.getElementById('main-section').style.display = 'none';
  document.getElementById('login-form').onsubmit = async (e) => {
    e.preventDefault();
    hideError();
    const form = e.target;
    const username = form.username.value;
    const password = form.password.value;
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Falha no login');
      }
      const data = await res.json();
      jwtToken = data.token;
      showMain();
    } catch (err) {
      showError(err.message);
    }
  };
  document.getElementById('register-form').onsubmit = async (e) => {
    e.preventDefault();
    hideError();
    const form = e.target;
    const username = form.username.value;
    const password = form.password.value;
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Falha no cadastro');
      }
      showError('Usuário cadastrado com sucesso! Faça login.');
    } catch (err) {
      showError(err.message);
    }
  };
}

function showMain() {
  document.getElementById('auth-section').innerHTML = '';
  document.getElementById('main-section').style.display = '';
  document.getElementById('main-section').innerHTML = `
    <div class="buttons">
      <button class="button is-info" onclick="listServicos()">Listar Serviços</button>
      <button class="button is-success" onclick="showCadastroServico()">Novo Serviço</button>
      <button class="button is-light" onclick="logout()">Sair</button>
      <a class="button is-link" href="/docs" target="_blank">Documentação</a>
    </div>
    <div id="content"></div>
  `;
}

function logout() {
  jwtToken = null;
  showAuth();
}

async function listServicos() {
  hideError();
  const content = document.getElementById('content');
  content.innerHTML = '<progress class="progress is-small is-primary" max="100">Carregando...</progress>';
  try {
    const res = await fetch('/api/servicos', {
      headers: { 'Authorization': 'Bearer ' + jwtToken }
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erro ao listar serviços');
    }
    const servicos = await res.json();
    if (!Array.isArray(servicos) || servicos.length === 0) {
      content.innerHTML = '<p>Nenhum serviço encontrado.</p>';
      return;
    }
    content.innerHTML = `<table class="table is-fullwidth">
      <thead><tr><th>ID</th><th>Cliente</th><th>Descrição</th><th>Data</th><th>Status</th></tr></thead>
      <tbody>
        ${servicos.map(s => `<tr><td>${s.id}</td><td>${s.cliente}</td><td>${s.descricao}</td><td>${s.data}</td><td>${s.status}</td></tr>`).join('')}
      </tbody>
    </table>`;
  } catch (err) {
    showError(err.message);
    content.innerHTML = '';
  }
}

function showCadastroServico() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <form id="cadastro-servico-form">
      <div class="field">
        <label class="label">Cliente</label>
        <div class="control">
          <input class="input" type="text" name="cliente" required>
        </div>
      </div>
      <div class="field">
        <label class="label">Descrição</label>
        <div class="control">
          <input class="input" type="text" name="descricao" required>
        </div>
      </div>
      <div class="field">
        <label class="label">Data</label>
        <div class="control">
          <input class="input" type="date" name="data" required>
        </div>
      </div>
      <div class="field">
        <label class="label">Status</label>
        <div class="control">
          <input class="input" type="text" name="status" required>
        </div>
      </div>
      <button class="button is-success" type="submit">Cadastrar Serviço</button>
    </form>
  `;
  document.getElementById('cadastro-servico-form').onsubmit = async (e) => {
    e.preventDefault();
    hideError();
    const form = e.target;
    const cliente = form.cliente.value;
    const descricao = form.descricao.value;
    const data = form.data.value;
    const status = form.status.value;
    try {
      const res = await fetch('/api/servicos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwtToken
        },
        body: JSON.stringify({ cliente, descricao, data, status })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Erro ao cadastrar serviço');
      }
      listServicos();
    } catch (err) {
      showError(err.message);
    }
  };
}

document.addEventListener('DOMContentLoaded', showAuth);
