import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function Ingresos() {
  const API = 'https://financiacompleto-3.onrender.com';

  const usuarioId = localStorage.getItem('usuarioId');

  const [ingresos, setIngresos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [idCategoriaIngreso, setIdCategoriaIngreso] = useState('');


  const obtenerIngresos = async () => {
    try {
      const response = await axios.get(`${API}/ingreso`);
      setIngresos(response.data);
    } catch (error) {
      console.error(error);
    }
  };


  const obtenerCategorias = async () => {
    try {
      const response = await axios.get(`${API}/categoria-ingreso`);
      setCategorias(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerIngresos();
    obtenerCategorias();
  }, []);

 
  const crearIngreso = async () => {
    try {
      await axios.post(`${API}/ingreso`, {
        descripcion,
        monto: Number(monto),
        fecha,
        id_usuario: Number(usuarioId),
        id_categoria_ingreso: Number(idCategoriaIngreso),
      });

      Swal.fire('Correcto', 'Ingreso creado', 'success');

      limpiarFormulario();
      obtenerIngresos();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo crear', 'error');
    }
  };


  const editarIngreso = async (ingreso: any) => {
   
    const opcionesCategorias = categorias
      .map((cat: any) => `
        <option value="${cat.id}" ${cat.id === ingreso.id_categoria_ingreso ? 'selected' : ''}>
          ${cat.nombre}
        </option>
      `)
      .join('');

   
    const { value: formValues } = await Swal.fire({
      title: 'Editar Ingreso',
      html: `
        <div style="display: flex; flex-direction: column; gap: 12px; text-align: left;">
          <label style="font-weight: bold;">Descripción:</label>
          <input id="swal-descripcion" class="swal2-input" style="margin: 0; width: 100%; box-sizing: border-box;" value="${ingreso.descripcion}">
          
          <label style="font-weight: bold;">Monto (Bs.):</label>
          <input id="swal-monto" type="number" class="swal2-input" style="margin: 0; width: 100%; box-sizing: border-box;" value="${ingreso.monto}">
          
          <label style="font-weight: bold;">Fecha:</label>
          <input id="swal-fecha" type="date" class="swal2-input" style="margin: 0; width: 100%; box-sizing: border-box;" value="${ingreso.fecha}">
          
          <label style="font-weight: bold;">Categoría:</label>
          <select id="swal-categoria" class="swal2-input" style="margin: 0; width: 100%; box-sizing: border-box;">
            <option value="">Seleccione categoría</option>
            ${opcionesCategorias}
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const desc = (document.getElementById('swal-descripcion') as HTMLInputElement).value;
        const mon = (document.getElementById('swal-monto') as HTMLInputElement).value;
        const fec = (document.getElementById('swal-fecha') as HTMLInputElement).value;
        const cat = (document.getElementById('swal-categoria') as HTMLSelectElement).value;

        if (!desc || !mon || !fec || !cat) {
          Swal.showValidationMessage('Por favor, completa todos los campos');
          return false;
        }

        return {
          descripcion: desc,
          monto: Number(mon),
          fecha: fec,
          id_categoria_ingreso: Number(cat),
        };
      }
    });

    if (!formValues) return;

    try {
     
      await axios.patch(`${API}/ingreso/${ingreso.id}`, formValues);

      Swal.fire('Actualizado', 'Ingreso actualizado correctamente', 'success');
      obtenerIngresos();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo actualizar', 'error');
    }
  };

  
  const eliminarIngreso = async (id: number) => {
    try {
      await axios.delete(`${API}/ingreso/${id}`);
      Swal.fire('Eliminado', 'Ingreso eliminado', 'success');
      obtenerIngresos();
    } catch (error) {
      console.error(error);
    }
  };

 
  const limpiarFormulario = () => {
    setDescripcion('');
    setMonto('');
    setFecha('');
    setIdCategoriaIngreso('');
  };

  return (
    <div className="page">
      <h1>Ingresos</h1>

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
          value={idCategoriaIngreso}
          onChange={(e) => setIdCategoriaIngreso(e.target.value)}
        >
          <option value="">Seleccione categoría</option>
          {categorias.map((cat: any) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>

        <button onClick={crearIngreso}>Guardar</button>
      </div>

      <div className="tabla">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ingresos.map((ingreso: any) => (
              <tr key={ingreso.id}>
                <td>{ingreso.id}</td>
                <td>{ingreso.descripcion}</td>
                <td>{ingreso.monto}</td>
                <td>{ingreso.fecha}</td>
                <td>{ingreso.categoriaIngreso?.nombre}</td>
                <td>
                  <div className="acciones">
                    <button
                      className="btn-editar"
                      onClick={() => editarIngreso(ingreso)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarIngreso(ingreso.id)}
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

export default Ingresos;