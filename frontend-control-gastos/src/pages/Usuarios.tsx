import { useEffect, useState } from 'react';

import api from '../services/api';

import MainLayout from '../layouts/MainLayout';

function Usuarios() {

  const [usuarios, setUsuarios] = useState([]);

  const [idEditar, setIdEditar] = useState<number | null>(null);

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');

  const obtenerUsuarios = async () => {

    const response = await api.get('/usuario');

    setUsuarios(response.data);
  };

  useEffect(() => {

    obtenerUsuarios();

  }, []);

  const limpiarFormulario = () => {

    setNombre('');
    setCorreo('');
    setPassword('');
    setTipoUsuario('');

    setIdEditar(null);
  };

  const crearUsuario = async () => {

    try {

      await api.post('/usuario', {

        nombre,
        correo,
        password,
        tipo_usuario: tipoUsuario,
      });

      alert('Usuario creado');

      limpiarFormulario();

      obtenerUsuarios();

    } catch (error) {

      console.error(error);

      alert('Error al crear usuario');
    }
  };

  const actualizarUsuario = async () => {

    try {

      await api.patch(`/usuario/${idEditar}`, {

        nombre,
        correo,
        password,
        tipo_usuario: tipoUsuario,
      });

      alert('Usuario actualizado');

      limpiarFormulario();

      obtenerUsuarios();

    } catch (error) {

      console.error(error);

      alert('Error al actualizar');
    }
  };

  const editarUsuario = (usuario: any) => {

    setIdEditar(usuario.id);

    setNombre(usuario.nombre);
    setCorreo(usuario.correo);
    setTipoUsuario(usuario.tipo_usuario);

    setPassword('');
  };

  const eliminarUsuario = async (id: number) => {

    try {

      await api.delete(`/usuario/${id}`);

      alert('Usuario eliminado');

      obtenerUsuarios();

    } catch (error) {

      console.error(error);

      alert('Error al eliminar');
    }
  };

  return (

    <MainLayout>

      <h1>Usuarios</h1>

      <div className="formulario">

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
            value={tipoUsuario}
            onChange={(e) =>
              setTipoUsuario(e.target.value)
            }
            >

            <option value="cliente">
              Cliente
            </option>

            <option value="admin">
              Admin
            </option>

        </select>

        {

          idEditar ? (

            <button onClick={actualizarUsuario}>
              Actualizar
            </button>

          ) : (

            <button onClick={crearUsuario}>
              Crear Usuario
            </button>

          )
        }

      </div>

      <table>

        <thead>

          <tr>

            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Tipo</th>
            <th>Acciones</th>

          </tr>

        </thead>

        <tbody>

          {usuarios.map((usuario: any) => (

            <tr key={usuario.id}>

              <td>{usuario.id}</td>

              <td>{usuario.nombre}</td>

              <td>{usuario.correo}</td>

              <td>{usuario.tipo_usuario}</td>

              <td>

                <button
                  className="btn-edit"
                  onClick={() =>
                    editarUsuario(usuario)
                  }
                >
                  Editar
                </button>

                <button
                  className="btn-delete"
                  onClick={() =>
                    eliminarUsuario(usuario.id)
                  }
                >
                  Eliminar
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </MainLayout>
  );
}

export default Usuarios;