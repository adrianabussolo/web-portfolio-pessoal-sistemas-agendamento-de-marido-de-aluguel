import http from 'k6/http';
import { sleep } from 'k6';


export const options = {
  iterations: 1
};

export default function () {
  // Exibe a data atual no relatório
  const hoje = new Date().toLocaleString('pt-BR');
  console.log('Data do teste:', hoje);
  // teste aqui 
  const url = 'http://localhost:3000/auth/login';

  const payload = JSON.stringify({
    username: 'admin',
    password: 'admin123'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const resposta = http.post(url, payload, params);


  sleep(1);
  console.log(resposta);
}