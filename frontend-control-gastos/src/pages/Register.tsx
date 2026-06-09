import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Register() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const evaluarPassword = (pass: string) => {
    let puntos = 0;

    if (pass.length >= 8) puntos++;
    if (/[A-Z]/.test(pass)) puntos++;
    if (/[0-9]/.test(pass)) puntos++;
    if (/[^A-Za-z0-9]/.test(pass)) puntos++;

    if (puntos <= 1) {
      return {
        texto: 'Débil',
        color: 'red',
      };
    }

    if (puntos <= 3) {
      return {
        texto: 'Media',
        color: 'orange',
      };
    }

    return {
      texto: 'Fuerte',
      color: 'green',
    };
  };

  const registrar = async () => {
    try {
      await api.post('/auth/register', {
        nombre,
        correo,
        password,
      });

      alert('Usuario registrado');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Error al registrar');
    }
  };

  const fuerza = evaluarPassword(password);

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Registro</h1>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) =>
            setNombre(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) =>
            setCorreo(e.target.value)
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

        {password && (
          <p
            style={{
              color: fuerza.color,
              fontWeight: 'bold',
              marginTop: '5px',
            }}
          >
            Seguridad: {fuerza.texto}
          </p>
        )}

        <button onClick={registrar}>
          Registrarse
        </button>
      </div>
    </div>
  );
}

export default Register;