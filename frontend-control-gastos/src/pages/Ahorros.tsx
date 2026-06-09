import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function Ahorros() {

  const API = 'http://localhost:3001';

  const usuarioId = localStorage.getItem(
    'usuarioId'
  );

  const [ahorros, setAhorros] = useState([]);

  const [metaDinero, setMetaDinero] =
    useState('');

  const [montoActual, setMontoActual] =
    useState('');

  const [fechaLimite, setFechaLimite] =
    useState('');

  const [
    presupuestoDiario,
    setPresupuestoDiario
  ] = useState('');

  // =========================
  // OBTENER
  // =========================

  const obtenerAhorros = async () => {

    try {

      const response = await axios.get(
        `${API}/ahorro`
      );

      setAhorros(response.data);

    } catch (error) {

      console.error(error);
    }
  };

  useEffect(() => {

    obtenerAhorros();

  }, []);

  // =========================
  // CREAR
  // =========================

  const crearAhorro = async () => {

    try {

      await axios.post(
        `${API}/ahorro`,
        {
          meta_dinero:
            Number(metaDinero),

          monto_actual:
            Number(montoActual),

          fecha_limite:
            fechaLimite,

          presupuesto_diario:
            Number(presupuestoDiario),

          id_usuario:
            Number(usuarioId),
        }
      );

      Swal.fire(
        'Correcto',
        'Ahorro creado',
        'success'
      );

      limpiarFormulario();

      obtenerAhorros();

    } catch (error) {

      console.error(error);

      Swal.fire(
        'Error',
        'No se pudo crear',
        'error'
      );
    }
  };

  // =========================
  // EDITAR
  // =========================

  const editarAhorro = async (
    ahorro: any
  ) => {

    const nuevaMeta = prompt(
      'Nueva meta',
      ahorro.meta_dinero
    );

    if (!nuevaMeta) return;

    try {

      await axios.patch(
        `${API}/ahorro/${ahorro.id}`,
        {
          meta_dinero:
            Number(nuevaMeta),
        }
      );

      Swal.fire(
        'Actualizado',
        'Ahorro actualizado',
        'success'
      );

      obtenerAhorros();

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

  const eliminarAhorro = async (
    id: number
  ) => {

    try {

      await axios.delete(
        `${API}/ahorro/${id}`
      );

      Swal.fire(
        'Eliminado',
        'Ahorro eliminado',
        'success'
      );

      obtenerAhorros();

    } catch (error) {

      console.error(error);
    }
  };

  // =========================
  // LIMPIAR
  // =========================

  const limpiarFormulario = () => {

    setMetaDinero('');
    setMontoActual('');
    setFechaLimite('');
    setPresupuestoDiario('');
  };

  return (

    <div className="page">

      <h1>
        Ahorros
      </h1>

      <div className="card">

        <input
          type="number"
          placeholder="Meta de dinero"
          value={metaDinero}
          onChange={(e) =>
            setMetaDinero(
              e.target.value
            )
          }
        />

        <input
          type="number"
          placeholder="Monto actual"
          value={montoActual}
          onChange={(e) =>
            setMontoActual(
              e.target.value
            )
          }
        />

        <input
          type="date"
          value={fechaLimite}
          onChange={(e) =>
            setFechaLimite(
              e.target.value
            )
          }
        />

        <input
          type="number"
          placeholder="Presupuesto diario"
          value={presupuestoDiario}
          onChange={(e) =>
            setPresupuestoDiario(
              e.target.value
            )
          }
        />

        <button onClick={crearAhorro}>
          Guardar
        </button>

      </div>

      <div className="tabla">

        <table>

          <thead>

            <tr>

              <th>ID</th>

              <th>Meta</th>

              <th>Actual</th>

              <th>Fecha límite</th>

              <th>Presupuesto diario</th>

              <th>Progreso</th>

              <th>Acciones</th>

            </tr>

          </thead>

          <tbody>

            {
              ahorros.map(
                (ahorro: any) => {

                  const progreso =
                    (
                      (
                        ahorro.monto_actual
                        * 100
                      )
                      /
                      ahorro.meta_dinero
                    ).toFixed(1);

                  return (

                    <tr key={ahorro.id}>

                      <td>{ahorro.id}</td>

                      <td>
                        Bs. {ahorro.meta_dinero}
                      </td>

                      <td>
                        Bs. {ahorro.monto_actual}
                      </td>

                      <td>
                        {ahorro.fecha_limite}
                      </td>

                      <td>
                        Bs. {ahorro.presupuesto_diario}
                      </td>

                      <td>
                        {progreso}%
                      </td>

                      <td>

                        <div className="acciones">

                          <button
                            className="btn-editar"
                            onClick={() =>
                              editarAhorro(
                                ahorro
                              )
                            }
                          >
                            Editar
                          </button>

                          <button
                            className="btn-eliminar"
                            onClick={() =>
                              eliminarAhorro(
                                ahorro.id
                              )
                            }
                          >
                            Eliminar
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                }
              )
            }

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Ahorros;