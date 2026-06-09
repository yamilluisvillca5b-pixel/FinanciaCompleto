import { useState } from 'react';
import axios from 'axios';

function App() {

  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {

    try {

      const response = await axios.post(
        'https://financiacompleto-3.onrender.com/auth/login',
        {
          nombre,
          password,
        }
      );

      console.log(response.data);

      alert('Login correcto');

      localStorage.setItem(
        'token',
        response.data.access_token
      );

    } catch (error) {

      console.error(error);

      alert('Credenciales incorrectas');
    }
  };

  return (
    <div style={{ padding: '30px' }}>

      <h1>Login</h1>

      <input
        type="text"
        placeholder="Usuario"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={login}>
        Iniciar sesión
      </button>

    </div>
  );
}

export default App;