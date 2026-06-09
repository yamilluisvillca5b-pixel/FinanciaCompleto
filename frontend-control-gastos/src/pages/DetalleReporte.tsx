import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

// 1. IMPORTACIONES PARA EL REPORTE PDF Y LA GRÁFICA
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Registrar los elementos de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function DetalleReporte() {
  const { id } = useParams(); // Captura el ID del reporte desde la URL
  const navigate = useNavigate();

  const [reporte, setReporte] = useState<any>(null);
  const [movimientosPeriodo, setMovimientosPeriodo] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatosReporte = async () => {
      try {
        setCargando(true);
        const usuarioId = localStorage.getItem('usuarioId');

        // 1. Obtener los datos generales del reporte guardado
        const reporteRes = await api.get(`/reporte/${id}`);
        const datosReporte = reporteRes.data;
        setReporte(datosReporte);

        // 2. Extraer las fechas desde el texto del resumen ("Periodo AAAA-MM-DD al AAAA-MM-DD")
        const resumenTexto = datosReporte.resumen;
        const coincidencias = resumenTexto.match(/Periodo (.*) al (.*)/);

        if (coincidencias && coincidencias.length >= 3) {
          const fechaInicio = new Date(coincidencias[1]);
          const fechaFin = new Date(coincidencias[2]);

          // 3. Traer todos los ingresos y gastos para filtrar los detalles en esta pantalla
          const ingresosRes = await api.get('/ingreso');
          const gastosRes = await api.get('/gasto');

          const listaDetallada: any[] = [];

          // Filtrar ingresos del periodo
          ingresosRes.data
            .filter((i: any) => i.usuario?.id == usuarioId)
            .forEach((i: any) => {
              const fechaMov = new Date(i.fecha);
              if (fechaMov >= fechaInicio && fechaMov <= fechaFin) {
                listaDetallada.push({
                  id: i.id,
                  tipo: 'Ingreso',
                  categoria: i.categoriaIngreso?.nombre || 'General',
                  monto: Number(i.monto),
                  fecha: i.fecha,
                });
              }
            });

          // Filtrar gastos del periodo
          gastosRes.data
            .filter((g: any) => g.usuario?.id == usuarioId)
            .forEach((g: any) => {
              const fechaMov = new Date(g.fecha);
              if (fechaMov >= fechaInicio && fechaMov <= fechaFin) {
                listaDetallada.push({
                  id: g.id,
                  tipo: 'Gasto',
                  categoria: g.categoria?.nombre || 'General',
                  monto: Number(g.monto),
                  fecha: g.fecha,
                });
              }
            });

          // Ordenar los movimientos por fecha (más recientes primero)
          listaDetallada.sort(
            (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          );

          setMovimientosPeriodo(listaDetallada);
        }
      } catch (error) {
        console.error('Error al cargar el detalle del reporte:', error);
        alert('No se pudo cargar la información del reporte.');
      } finally {
        setCargando(false);
      }
    };

    if (id) {
      obtenerDatosReporte();
    }
  }, [id]);

  if (cargando) return <div style={{ padding: '20px' }}>Cargando reporte financiero...</div>;
  if (!reporte) return <div style={{ padding: '20px' }}>Reporte no encontrado.</div>;

  const balanceNeto = Number(reporte.total_ingresos) - Number(reporte.total_gastos);

  // 2. CONFIGURACIÓN DE LOS DATOS DE LA GRÁFICA PIE (CON COLORES RELLENOS)
  const dataPie = {
    labels: ['Total Ingresos', 'Total Gastos'],
    datasets: [
      {
        data: [Number(reporte.total_ingresos), Number(reporte.total_gastos)],
        backgroundColor: ['#2ecc71', '#e74c3c'], // Verde para ingresos, Rojo para gastos
        borderColor: ['#27ae60', '#c0392b'],
        borderWidth: 1,
      },
    ],
  };

  // 3. FUNCIÓN PARA GENERAR Y DESCARGAR EL PDF
  const descargarPDF = async () => {
    const input = document.getElementById('seccionReportePDF');
    if (!input) return;

    try {
      // Escalamos el canvas para mejorar la calidad de los textos e imágenes en el PDF
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190; // Ancho utilizable en A4 dejando márgenes
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`Reporte_Financiero_#${id}.pdf`);
    } catch (error) {
      console.error('Error al exportar el PDF:', error);
      alert('Ocurrió un error al generar el archivo PDF.');
    }
  };

  return (
    <div className="page" style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Botones de acción superiores (No se incluirán dentro del archivo PDF descargado) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ padding: '8px 15px', cursor: 'pointer', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
        >
          ← Volver al Dashboard
        </button>

        <button 
          onClick={descargarPDF} 
          style={{ padding: '8px 20px', cursor: 'pointer', backgroundColor: '#2980b9', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
        >
          Descargar PDF
        </button>
      </div>

      {/* 4. CONTENEDOR CON LA ID ASIGNADA PARA CAPTURAR TODO LO QUE ESTÁ ADENTRO */}
      <div id="seccionReportePDF" style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2>{reporte.tipo_reporte} (ID: #{reporte.id})</h2>
        <p style={{ color: '#555', fontSize: '1.1rem' }}><strong>{reporte.resumen}</strong></p>
        <small style={{ color: '#999' }}>Generado el: {new Date(reporte.fecha_reporte).toLocaleDateString()}</small>

        <hr style={{ margin: '20px 0', borderColor: '#eee' }} />

        {/* Bloque de Totales Acumulados */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <div style={{ flex: 1, padding: '15px', backgroundColor: '#e8f8f5', borderRadius: '6px', borderLeft: '5px solid #2ecc71' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#27ae60' }}>Total Ingresos</h4>
            <h3 style={{ margin: 0 }}>Bs. {Number(reporte.total_ingresos).toFixed(2)}</h3>
          </div>

          <div style={{ flex: 1, padding: '15px', backgroundColor: '#fdedec', borderRadius: '6px', borderLeft: '5px solid #e74c3c' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#c0392b' }}>Total Gastos</h4>
            <h3 style={{ margin: 0 }}>Bs. {Number(reporte.total_gastos).toFixed(2)}</h3>
          </div>

          <div style={{ flex: 1, padding: '15px', backgroundColor: balanceNeto >= 0 ? '#eaf2f8' : '#fef9e7', borderRadius: '6px', borderLeft: balanceNeto >= 0 ? '5px solid #2980b9' : '5px solid #f39c12' }}>
            <h4 style={{ margin: '0 0 5px 0', color: balanceNeto >= 0 ? '#2980b9' : '#d35400' }}>Balance Neto</h4>
            <h3 style={{ margin: 0 }}>Bs. {balanceNeto.toFixed(2)}</h3>
          </div>
        </div>

        {/* 5. RENDERIZADO DE LA GRÁFICA EN MEDIO DEL REPORTE */}
        <div style={{ width: '280px', margin: '30px auto', paddingBottom: '20px' }}>
          <h4 style={{ textAlign: 'center', margin: '0 0 15px 0', color: '#34495e' }}>Proporción del Periodo</h4>
          <Pie data={dataPie} />
        </div>

        {/* Tabla Detallada de todos los movimientos del periodo */}
        <h3>Detalle de Movimientos en este Periodo</h3>
        {movimientosPeriodo.length === 0 ? (
          <p>No se encontraron transacciones individuales registradas en este rango de fechas.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Fecha</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Tipo</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Categoría</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>Monto</th>
              </tr>
            </thead>
            <tbody>
              {movimientosPeriodo.map((mov, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>
                    {new Date(mov.fecha).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      backgroundColor: mov.tipo === 'Ingreso' ? '#d4efdf' : '#fadbd8',
                      color: mov.tipo === 'Ingreso' ? '#1e8449' : '#78281f'
                    }}>
                      {mov.tipo}
                    </span>
                  </td>
                  <td style={{ padding: '10px', color: '#555' }}>{mov.categoria}</td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'right', 
                    fontWeight: 'bold',
                    color: mov.tipo === 'Ingreso' ? '#27ae60' : '#c0392b' 
                  }}>
                    {mov.tipo === 'Ingreso' ? '+' : '-'} Bs. {mov.monto.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DetalleReporte;