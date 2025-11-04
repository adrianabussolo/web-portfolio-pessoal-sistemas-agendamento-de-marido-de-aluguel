import http from 'k6/http';
import { sleep } from 'k6';


export const options = {
  iterations: 30
  };

export default function () {
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