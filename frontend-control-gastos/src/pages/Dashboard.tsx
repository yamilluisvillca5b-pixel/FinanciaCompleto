import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Dashboard() {
  const navigate = useNavigate();

  // Estados
  const [balance, setBalance] = useState(0);
  const [gastos, setGastos] = useState(0);
  const [ahorros, setAhorros] = useState(0);
  const [deudas, setDeudas] = useState(0);
  const [porcentaje, setPorcentaje] = useState(0);
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [rangosControl, setRangosControl] = useState<any[]>([]);
  const [mostrarListaReportes, setMostrarListaReportes] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  // adtos de usuario
  const cargarDatos = async () => {
    try {
      const usuarioId = localStorage.getItem('usuarioId');

      const ingresosRes = await api.get('/ingreso');
      const gastosRes = await api.get('/gasto');
      const ahorroRes = await api.get('/ahorro');

      const listaGastos = gastosRes.data;
      let totalIngresos = 0;
      let totalGastos = 0;
      let totalAhorro = 0;
      
      let prestamos = 0;
      let pagosDeuda = 0;

      const listaMovimientos: any[] = [];

      // Procesar Ingresos
      ingresosRes.data
        .filter((i: any) => i.usuario.id == usuarioId)
        .forEach((i: any) => {
          totalIngresos += Number(i.monto);
          
          listaMovimientos.push({
            tipo: 'Ingreso',
            monto: i.monto,
            fecha: i.fecha,
          });

          const categoriaIngreso = i.categoriaIngreso?.nombre?.toLowerCase() || '';
          if (categoriaIngreso.includes('prestamo') || categoriaIngreso.includes('préstamo')) {
            prestamos += Number(i.monto);
          }
        });

      // Procesar Gastos
      listaGastos
        .filter((g: any) => g.usuario.id == usuarioId)
        .forEach((gasto: any) => {
          totalGastos += Number(gasto.monto);
          
          listaMovimientos.push({
            tipo: 'Gasto',
            monto: gasto.monto,
            fecha: gasto.fecha,
          });

          const categoria = gasto.categoria?.nombre?.toLowerCase() || '';

          if (categoria.includes('ahorro')) {
            totalAhorro += Number(gasto.monto);
          }

          if (categoria.includes('deuda')) {
            pagosDeuda += Number(gasto.monto);
          }
        });

      // ultimos movimimentos
      listaMovimientos.sort(
        (a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
      setMovimientos(listaMovimientos.slice(0, 5));

      // calculos 
      setBalance(totalIngresos - totalGastos);
      setGastos(totalGastos);
      setAhorros(totalAhorro);
      setDeudas(prestamos - pagosDeuda);

      // barra de ahorro
      if (ahorroRes.data.length > 0) {
        
        const ahorroUsuario = ahorroRes.data.find((a: any) => a.usuario?.id == usuarioId);
        if (ahorroUsuario) {
          const porc = (Number(ahorroUsuario.monto_actual) * 100) / Number(ahorroUsuario.meta_dinero);
          setPorcentaje(porc);
        }
      }
    } catch (error) {
      console.error("Error cargando los datos financieros:", error);
    }
  };

  // lista de rangos 
  const alternarSeccionReporte = async () => {
    if (!mostrarListaReportes) {
      try {
        const usuarioId = localStorage.getItem('usuarioId');
        const res = await api.get('/rango-control');
        
        const filtrados = res.data.filter((r: any) => r.usuario?.id == usuarioId);
        setRangosControl(filtrados);
      } catch (error) {
        console.error(error);
        alert('Error al cargar tus rangos de control');
      }
    }
    setMostrarListaReportes(!mostrarListaReportes);
  };

  // reporte
  const ejecutarGenerarReporte = async (rangoId: number) => {
    try {
      const usuarioId = localStorage.getItem('usuarioId');

      const response = await api.post(`/reporte/generar/${usuarioId}/${rangoId}`);
      const reporteCreado = response.data;

      alert('¡Reporte generado con éxito!');
      setMostrarListaReportes(false);

      navigate(`/reporte/${reporteCreado.id}`);
    } catch (error) {
      console.error(error);
      alert('Error al generar el reporte financiero');
    }
  };

  return (
    <div className="dashboard-layout">
      
      <aside className="sidebar">
        <h2>FinanzIA</h2>
        <button onClick={() => navigate('/dashboard')}>Dashboard</button>
        <button onClick={() => navigate('/ingresos')}>Ingresos</button>
        <button onClick={() => navigate('/gastos')}>Gastos</button>
        <button onClick={() => navigate('/ahorros')}>Ahorros</button>
        <button onClick={() => navigate('/categorias')}>Categoría gasto</button>
        <button onClick={() => navigate('/categoria-ingreso')}>Categoría Ingreso</button>
        <button onClick={() => navigate('/RangoControl')}>Rangos</button>
        <button onClick={() => navigate('/reportes')}>Reportes</button>
        <button onClick={() => navigate('/chat')}>FinanzIA</button>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            navigate('/');
          }}
        >
          Cerrar sesión
        </button>
      </aside>

      <div className="dashboard">
        {/* Sección Balance Global */}
        <div className="card-balance">
          <h2>Balance Actual</h2>
          <h1>Bs. {balance.toFixed(2)}</h1>
        </div>

        {/* Grid Informativo Resumen */}
        <div className="resumen-grid">
          <div className="card">
            <h3>Gastos</h3>
            <p>Bs. {gastos.toFixed(2)}</p>
          </div>

          <div className="card">
            <h3>Ahorros</h3>
            <p>Bs. {ahorros.toFixed(2)}</p>
          </div>

          <div className="card">
            <h3>Deudas</h3>
            <p>Bs. {deudas.toFixed(2)}</p>
          </div>
        </div>

        {/* Meta de Ahorro */}
        <div className="card-ahorro">
          <h2>Meta de ahorro</h2>
          <div className="barra">
            <div
              className="progreso"
              style={{
                width: `${porcentaje > 100 ? 100 : porcentaje}%`,
              }}
            />
          </div>
          <h3>{porcentaje.toFixed(0)}%</h3>
        </div>

        {/* Acciones Rápidas de Navegación */}
        <div className="acciones-rapidas">
          <button onClick={() => navigate('/ingresos')}>
             Agregar Ingreso
          </button>

          <button onClick={() => navigate('/gastos')}>
             Agregar Gasto
          </button>

          <button onClick={() => navigate('/ahorros')}>
             Nuevo Ahorro
          </button>

          <button onClick={() => navigate('/RangoControl')}>
            Crear Rango
          </button>

          {/* Botón interactivo que despliega los rangos de control de fechas */}
          <button onClick={alternarSeccionReporte}>
            {mostrarListaReportes ? 'Ocultar Rangos' : 'Generar Reporte'}
          </button>

          <button onClick={() => navigate('/categorias')}>
             Categorías gastos 
          </button>
          <button onClick={() => navigate('/categoria-ingreso' )}>Categoría Ingreso</button>
          <button onClick={() => navigate('/chat')}>Consultar FinanzIA</button>
        </div>

        {/*desplazamiento de de reporte  */}
        {mostrarListaReportes && (
          <div className="seccion-reportes-rangos" style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fafafa' }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Selecciona el Rango para tu Reporte</h3>
            {rangosControl.length === 0 ? (
              <p style={{ color: '#777' }}>No tienes rangos de control registrados todavía para este usuario.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {rangosControl.map((rango: any) => (
                  <div key={rango.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '5px' }}>
                    <div>
                      <strong>Rango #{rango.id}</strong> — Del {rango.fecha_inicio} al {rango.fecha_fin} <br />
                      <small style={{ color: '#666' }}>Presupuesto Inicial asignado: Bs. {rango.presupuesto_inicial}</small>
                    </div>
                    <button 
                      onClick={() => ejecutarGenerarReporte(rango.id)} 
                      style={{ padding: '8px 16px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Generar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Historial de Últimos Movimientos */}
        <div className="ultimos-movimientos" style={{ marginTop: '30px' }}>
          <h2>Últimos movimientos</h2>
          {movimientos.length === 0 ? (
            <p style={{ color: '#777', padding: '10px' }}>No hay movimientos financieros recientes registrados.</p>
          ) : (
            movimientos.map((m, index) => (
              <div key={index} className="movimiento" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                <span style={{ fontWeight: m.tipo === 'Ingreso' ? 'bold' : 'normal', color: m.tipo === 'Ingreso' ? '#27ae60' : '#c0392b' }}>
                  {m.tipo}
                </span>
                <span>Bs. {Number(m.monto).toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;