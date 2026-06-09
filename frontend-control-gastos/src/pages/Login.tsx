import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ReCAPTCHA from 'react-google-recaptcha';

function Login() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState<string | null>(null);

  const login = async () => {
    if (!captcha) {
      alert('Complete el CAPTCHA');
      return;
    }

    try {
      const response = await api.post('/auth/login', {
        nombre,
        password,
      });

      localStorage.setItem(
        'token',
        response.data.access_token
      );

      localStorage.setItem(
        'usuarioId',
        response.data.usuario.id
      );

      localStorage.setItem(
        'tipoUsuario',
        response.data.usuario.tipo_usuario
      );

      navigate('/dashboard');
    } catch (error: any) {
      console.log(error);
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <h1>FinanzIA</h1>

        <input
          type="text"
          placeholder="Usuario"
          value={nombre}
          onChange={(e) =>
            setNombre(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <div
          style={{
            marginTop: '15px',
            marginBottom: '15px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ReCAPTCHA
            sitekey="6Ld4zhUtAAAAAKzwz2EvUZvvrdBUDrM93kHYUSyu"
            onChange={(value) =>
              setCaptcha(value)
            }
          />
        </div>

        <button onClick={login}>
          Iniciar Sesión
        </button>

        <p
          style={{
            marginTop: '15px',
            cursor: 'pointer',
            color: '#2563eb',
          }}
          onClick={() => navigate('/register')}
        >
          Crear cuenta
        </p>

      </div>
    </div>
  );
}

export default Login;