import { useEffect, useState } from 'react';
import axios from 'axios';

function CategoriaIngreso() {
  const API = 'http://localhost:3001/categoria-ingreso';

  const [categorias, setCategorias] = useState<any[]>([]);
  const [nombre, setNombre] = useState('');
  const [editando, setEditando] = useState<number | null>(null);

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const obtenerCategorias = async () => {
    try {
      const res = await axios.get(API);
      setCategorias(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const guardarCategoria = async () => {
    try {
      if (!nombre.trim()) {
        alert('Ingrese un nombre');
        return;
      }

      if (editando) {
        await axios.patch(`${API}/${editando}`, {
          nombre,
        });
        alert('Categoría actualizada');
      } else {
        await axios.post(API, {
          nombre,
        }); 
        alert('Categoría creada');
      }

      setNombre('');
      setEditando(null);
      obtenerCategorias();
    } catch (error) {
      console.error(error);
      alert('Error al guardar');
    }
  };

  const editarCategoria = (categoria: any) => {
    setNombre(categoria.nombre);
    setEditando(categoria.id);
  };

  const eliminarCategoria = async (id: number) => {
    const confirmar = window.confirm('¿Eliminar esta categoría?');
    if (!confirmar) return;

    try {
      await axios.delete(`${API}/${id}`);
      obtenerCategorias();
    } catch (error) {
      console.error(error);
      alert('Error al eliminar');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Categorías de Ingreso</h1>

      {/* Tarjeta del Formulario */}
      <div style={styles.formCard}>
        <input
          type="text"
          placeholder="Ej. Salario, Ventas, Inversiones..."
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={styles.input}
        />

        <button 
          onClick={guardarCategoria}
          style={editando ? styles.btnUpdate : styles.btnCreate}
        >
          {editando ? 'Actualizar' : 'Crear Categoría'}
        </button>

        {editando && (
          <button
            onClick={() => {
              setEditando(null);
              setNombre('');
            }}
            style={styles.btnCancel}
          >
            Cancelar
          </button>
        )}
      </div>

      {/* Tabla de Datos */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Nombre de Categoría</th>
              <th style={styles.th_center}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(categorias) && categorias.length > 0 ? (
              categorias.map((categoria) => (
                <tr key={categoria.id} style={styles.tr}>
                  <td style={styles.td}><strong>#{categoria.id}</strong></td>
                  <td style={styles.td}>{categoria.nombre}</td>
                  <td style={styles.td_center}>
                    <button
                      onClick={() => editarCategoria(categoria)}
                      style={styles.btnEdit}
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => eliminarCategoria(categoria.id)}
                      style={styles.btnDelete}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={styles.noData}>
                  No hay categorías registradas aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// PALETA DE ESTILOS EN LINEA (UI/UX)
// ==========================================
const styles = {
  container: {
    padding: '30px',
    maxWidth: '850px',
    margin: '0 auto',
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  title: {
    color: '#2c3e50',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  formCard: {
    display: 'flex',
    gap: '12px',
    background: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)',
    marginBottom: '30px',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  btnCreate: {
    background: '#2ecc71', // Verde éxito para ingresos
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px',
    boxShadow: '0 2px 4px rgba(46, 204, 113, 0.3)',
  },
  btnUpdate: {
    background: '#3498db', // Azul para actualización
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px',
    boxShadow: '0 2px 4px rgba(52, 152, 219, 0.3)',
  },
  btnCancel: {
    background: '#95a5a6', // Gris neutral
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px',
  },
  tableContainer: {
    background: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    textAlign: 'left' as const,
  },
  th: {
    background: '#34495e',
    color: '#ffffff',
    padding: '14px 20px',
    fontWeight: '600',
    fontSize: '14px',
  },
  th_center: {
    background: '#34495e',
    color: '#ffffff',
    padding: '14px 20px',
    fontWeight: '600',
    fontSize: '14px',
    textAlign: 'center' as const,
  },
  tr: {
    borderBottom: '1px solid #eaeded',
  },
  td: {
    padding: '14px 20px',
    color: '#2c3e50',
    fontSize: '15px',
  },
  td_center: {
    padding: '14px 20px',
    textAlign: 'center' as const,
  },
  btnEdit: {
    background: '#f39c12', // Naranja constructivo
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    marginRight: '8px',
  },
  btnDelete: {
    background: '#e74c3c', // Rojo de alerta
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
  },
  noData: {
    padding: '30px',
    textAlign: 'center' as const,
    color: '#7f8c8d',
    fontSize: '15px',
  }
};

export default CategoriaIngreso;