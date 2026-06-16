import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AdminUsuarios() {
  const navigate = useNavigate();
  
  // Estados para ambas listas
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    cargarUsuarios();
    cargarLogs();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await api.get('/usuario');
      setUsuarios(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert('Tu sesión expiró o es inválida. Por favor, inicia sesión de nuevo.');
        navigate('/');
      } else if (error.response?.status === 403) {
        alert('No tienes permisos de Administrador para ver esta página.');
        navigate('/dashboard');
      } else {
        console.error("Error al cargar usuarios:", error);
      }
    }
  };

  const cargarLogs = async () => {
    try {
      const response = await api.get('/log-acceso');
      setLogs(response.data);
    } catch (error) {
      console.error("Error al cargar logs:", error);
    }
  };

  const eliminarUsuario = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

    try {
      await api.delete(`/usuario/${id}`);
      cargarUsuarios(); // Recargamos la lista tras eliminar
      cargarLogs();     // Recargamos los logs para capturar la acción si aplica
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert('Hubo un error al intentar eliminar al usuario.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Administración de Usuarios</h1>

      <button
        onClick={() => navigate('/dashboard')}
        style={{ 
          marginBottom: '20px', 
          padding: '10px 15px', 
          backgroundColor: '#3498db', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Volver al Dashboard
      </button>

      {/* TABLA DE USUARIOS */}
      <table
        border={1}
        cellPadding={10}
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: '#fff',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}
      >
        <thead style={{ backgroundColor: '#f4f6f9' }}>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                Cargando usuarios o no hay datos...
              </td>
            </tr>
          ) : (
            usuarios.map((usuario) => (
              <tr key={usuario.id} style={{ textAlign: 'center' }}>
                <td>{usuario.id}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.correo || 'N/A'}</td>
                <td>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: usuario.tipo_usuario === 'admin' ? '#e74c3c' : '#2ecc71',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}>
                    {usuario.tipo_usuario?.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: usuario.activo ? '#2ecc71' : '#95a5a6',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}>
                    {usuario.activo ? 'ACTIVO' : 'INACTIVO'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => eliminarUsuario(usuario.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* SEPARADOR Y SECCIÓN DE LOGS DE ACCESO */}
      <hr style={{ margin: '40px 0' }} />

      <h2>Logs de Acceso</h2>

      <table
        border={1}
        cellPadding={10}
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: '#fff',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}
      >
        <thead style={{ backgroundColor: '#f4f6f9' }}>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Evento</th>
            <th>IP</th>
            <th>Navegador</th>
            <th>Fecha</th>
          </tr>
        </thead>

        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                No se han registrado eventos de acceso aún...
              </td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log.id} style={{ textAlign: 'center' }}>
                <td>{log.id}</td>
                <td><strong>{log.usuario}</strong></td>
                <td>
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    fontWeight: 'bold',
                    fontSize: '13px'
                  }}>
                    {log.evento}
                  </span>
                </td>
                <td style={{ fontFamily: 'monospace' }}>{log.ip}</td>
                <td style={{ fontSize: '13px', color: '#555' }}>{log.navegador}</td>
                <td>{log.fechaHora ? new Date(log.fechaHora).toLocaleString() : 'N/A'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsuarios;