import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [editando, setEditando] = useState(false);
  const [idCategoria, setIdCategoria] = useState<number | null>(null);

  const API = 'https://financiacompleto-3.onrender.com/categoria';

  // =========================
  // USUARIO LOGUEADO
  // =========================
  const usuarioId = localStorage.getItem('usuarioId');

  // =========================
  // OBTENER CATEGORIAS
  // =========================
  const obtenerCategorias = async () => {
    try {
      const response = await axios.get(API);
      setCategorias(response.data);
    } catch (error) {
      console.error(error);
      Swal.fire(
        'Error',
        'No se pudieron cargar categorías',
        'error'
      );
    }
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  // =========================
  // GUARDAR
  // =========================
  const guardarCategoria = async () => {
    try {
      if (editando) {
        await axios.patch(
          `${API}/${idCategoria}`,
          {
            nombre,
          }
        );

        Swal.fire(
          'Actualizado',
          'Categoría actualizada',
          'success'
        );
      } else {
        await axios.post(
          API,
          {
            nombre,
            usuarioId: Number(usuarioId),
          }
        );

        Swal.fire(
          'Correcto',
          'Categoría creada',
          'success'
        );
      }

      limpiarFormulario();
      obtenerCategorias();
    } catch (error) {
      console.error(error);
      Swal.fire(
        'Error',
        'No se pudo guardar',
        'error'
      );
    }
  };

  // =========================
  // EDITAR CATEGORIA (PROMPT)
  // =========================
  const editarCategoria = async (categoria: any) => {
    const nuevoNombre = prompt(
      'Nuevo nombre',
      categoria.nombre
    );

    if (!nuevoNombre) return;

    try {
      // Nota: Se usa ${API}/${categoria.id} porque la variable API ya contiene "/categoria"
      await axios.patch(
        `${API}/${categoria.id}`,
        {
          nombre: nuevoNombre,
        }
      );

      Swal.fire(
        'Actualizado',
        'Categoría actualizada',
        'success'
      );

      obtenerCategorias();
    } catch (error) {
      console.error(error);
      Swal.fire(
        'Error',
        'No se pudo actualizar',
        'error'
      );
    }
  };

  // =========================
  // ELIMINAR
  // =========================
  const eliminarCategoria = async (id: number) => {
    try {
      await axios.delete(
        `${API}/${id}`
      );

      Swal.fire(
        'Eliminado',
        'Categoría eliminada',
        'success'
      );

      obtenerCategorias();
    } catch (error) {
      console.error(error);
      Swal.fire(
        'Error',
        'No se pudo eliminar',
        'error'
      );
    }
  };

  // =========================
  // LIMPIAR
  // =========================
  const limpiarFormulario = () => {
    setNombre('');
    setEditando(false);
    setIdCategoria(null);
  };

  return (
    <div className="page">
      <h1>Categorías</h1>

      <div className="card">
        <input
          type="text"
          placeholder="Nombre categoría"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <button onClick={guardarCategoria}>
          {editando ? 'Actualizar' : 'Guardar'}
        </button>
      </div>

      <div className="tabla">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria: any) => (
              <tr key={categoria.id}>
                <td>{categoria.id}</td>
                <td>{categoria.nombre}</td>
                <td>
                  <div className="acciones">
                    <button
                      className="btn-editar"
                      onClick={() => editarCategoria(categoria)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarCategoria(categoria.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Categorias;