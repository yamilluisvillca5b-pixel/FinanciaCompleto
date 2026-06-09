import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function RangoControl() {
  const API = 'https://financiacompleto-3.onrender.com';
  const usuarioId = localStorage.getItem('usuarioId');

  const [rangos, setRangos] = useState([]);

  
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [presupuestoInicial, setPresupuestoInicial] = useState('');

 
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [editFechaInicio, setEditFechaInicio] = useState('');
  const [editFechaFin, setEditFechaFin] = useState('');
  const [editPresupuestoInicial, setEditPresupuestoInicial] = useState('');

  
  const obtenerRangos = async () => {
    try {
      const response = await axios.get(`${API}/rango-control`);
      
      const misRangos = response.data.filter((r: any) => r.usuario?.id == usuarioId);
      setRangos(misRangos);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerRangos();
  }, []);

  
  const crearRango = async () => {
    try {
      await axios.post(`${API}/rango-control`, {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        presupuesto_inicial: Number(presupuestoInicial),
        id_usuario: Number(usuarioId),
      });

      Swal.fire('Correcto', 'Rango creado', 'success');
      limpiarFormulario();
      obtenerRangos();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo crear', 'error');
    }
  };


  const eliminarRango = async (id: number) => {
    try {
      await axios.delete(`${API}/rango-control/${id}`);
      Swal.fire('Eliminado', 'Rango eliminado', 'success');
      obtenerRangos();
    } catch (error) {
      console.error(error);
    }
  };

  
  const seleccionarParaEditar = (rango: any) => {
    setIdEditando(rango.id);
    setEditFechaInicio(rango.fecha_inicio);
    setEditFechaFin(rango.fecha_fin);
    setEditPresupuestoInicial(rango.presupuesto_inicial);
  };


  const guardarEdicion = async () => {
    try {
      await axios.patch(`${API}/rango-control/${idEditando}`, {
        fecha_inicio: editFechaInicio,
        fecha_fin: editFechaFin,
        presupuesto_inicial: Number(editPresupuestoInicial),
      });

      Swal.fire('Actualizado', 'Rango actualizado', 'success');
      setIdEditando(null);
      obtenerRangos();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo actualizar', 'error');
    }
  };

  const limpiarFormulario = () => {
    setFechaInicio('');
    setFechaFin('');
    setPresupuestoInicial('');
  };

  return (
    <div className="page">
      <h1>Control de Rangos</h1>

      {/* FORMULARIO */}
      {!idEditando ? (
        <div className="card">
          <h3>Crear Nuevo Rango</h3>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
          <input
            type="number"
            placeholder="Presupuesto inicial"
            value={presupuestoInicial}
            onChange={(e) => setPresupuestoInicial(e.target.value)}
          />
          <button onClick={crearRango}>Guardar</button>
        </div>
      ) : (
       
        <div className="card edit-card" style={{ borderColor: '#3498db', backgroundColor: '#f4f9fd' }}>
          <h3>Modificando Rango #{idEditando}</h3>
          <input
            type="date"
            value={editFechaInicio}
            onChange={(e) => setEditFechaInicio(e.target.value)}
          />
          <input
            type="date"
            value={editFechaFin}
            onChange={(e) => setEditFechaFin(e.target.value)}
          />
          <input
            type="number"
            placeholder="Nuevo presupuesto"
            value={editPresupuestoInicial}
            onChange={(e) => setEditPresupuestoInicial(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button onClick={guardarEdicion} style={{ backgroundColor: '#3498db' }}>Actualizar</button>
            <button onClick={() => setIdEditando(null)} style={{ backgroundColor: '#95a5a6' }}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="tabla">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Presupuesto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rangos.map((rango: any) => (
              <tr key={rango.id}>
                <td>{rango.id}</td>
                <td>{rango.fecha_inicio}</td>
                <td>{rango.fecha_fin}</td>
                <td>Bs. {rango.presupuesto_inicial}</td>
                <td>
                  {/*  estilo*/}
                  <button 
                    onClick={() => seleccionarParaEditar(rango)}
                    style={styles.btnEdit}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => eliminarRango(rango.id)}
                    style={styles.btnDelete}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


const styles = {
  btnEdit: {
    background: '#f39c12', 
    color: '#ffffff',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    marginRight: '8px',
    boxShadow: '0 2px 4px rgba(243, 156, 18, 0.2)',
  },
  btnDelete: {
    background: '#e74c3c', 
    color: '#ffffff',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    boxShadow: '0 2px 4px rgba(231, 76, 60, 0.2)',
  }
};

export default RangoControl;