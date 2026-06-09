import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function Gastos() {
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [categoriaId, setCategoriaId] = useState('');

  const API = 'http://localhost:3001';

  
  const usuarioId = localStorage.getItem('usuarioId');

  const obtenerGastos = async () => {
    try {
      const response = await axios.get(`${API}/gasto`);
      setGastos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  
  const obtenerCategorias = async () => {
    try {
      const response = await axios.get(`${API}/categoria`);
      setCategorias(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerGastos();
    obtenerCategorias();
  }, []);

 
  const crearGasto = async () => {
    try {
      await axios.post(`${API}/gasto`, {
        descripcion,
        monto: Number(monto),
        fecha,
        id_categoria: Number(categoriaId),
        id_usuario: Number(usuarioId),
      });

      Swal.fire('Correcto', 'Gasto creado', 'success');
      limpiarFormulario();
      obtenerGastos();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo crear', 'error');
    }
  };

  
  const editarGasto = async (gasto: any) => {
    const nuevaDescripcion = prompt('Nueva descripción', gasto.descripcion);

    if (!nuevaDescripcion) return;

    try {
      await axios.patch(`${API}/gasto/${gasto.id}`, {
        descripcion: nuevaDescripcion,
      });

      Swal.fire('Actualizado', 'Gasto actualizado', 'success');
      obtenerGastos();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo actualizar', 'error');
    }
  };

  const eliminarGasto = async (id: number) => {
    try {
      await axios.delete(`${API}/gasto/${id}`);
      Swal.fire('Eliminado', 'Gasto eliminado', 'success');
      obtenerGastos();
    } catch (error) {
      console.error(error);
    }
  };


  const limpiarFormulario = () => {
    setDescripcion('');
    setMonto('');
    setFecha('');
    setCategoriaId('');
  };

  return (
    <div className="page">
      <h1>Gastos</h1>

      <div className="card">
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
        >
          <option value="">Seleccione categoría</option>
          {categorias.map((categoria: any) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>

        <button onClick={crearGasto}>Guardar</button>
      </div>

      <div className="tabla">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {gastos.map((gasto: any) => (
              <tr key={gasto.id}>
                <td>{gasto.id}</td>
                <td>{gasto.descripcion}</td>
                <td>{gasto.monto}</td>
                <td>{gasto.fecha}</td>
                <td>
                  <div className="acciones">
                    <button className="btn-editar" onClick={() => editarGasto(gasto)}>
                      Editar
                    </button>
                    <button className="btn-eliminar" onClick={() => eliminarGasto(gasto.id)}>
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

export default Gastos;