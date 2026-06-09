import { useEffect, useState } from 'react';
import axios from 'axios';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

import { Pie } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function Reportes() {

  const API = 'http://localhost:3001';

  const usuarioId =
    localStorage.getItem('usuarioId');

  const [gastos, setGastos] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [ahorros, setAhorros] = useState([]);

  const obtenerDatos = async () => {

    try {

      const gastosRes =
        await axios.get(
          `${API}/gasto`
        );

      const ingresosRes =
        await axios.get(
          `${API}/ingreso`
        );

      const ahorrosRes =
        await axios.get(
          `${API}/ahorro`
        );

      setGastos(
        gastosRes.data.filter(
          (g: any) =>
            g.usuario?.id ==
            usuarioId
        )
      );

      setIngresos(
        ingresosRes.data.filter(
          (i: any) =>
            i.usuario?.id ==
            usuarioId
        )
      );

      setAhorros(
        ahorrosRes.data.filter(
          (a: any) =>
            a.usuario?.id ==
            usuarioId
        )
      );

    } catch (error) {

      console.error(error);
    }
  };

  useEffect(() => {

    obtenerDatos();

  }, []);

  const totalGastos =
    gastos.reduce(
      (acc: number, gasto: any) =>
        acc + Number(gasto.monto),
      0
    );

  const totalIngresos =
    ingresos.reduce(
      (acc: number, ingreso: any) =>
        acc + Number(ingreso.monto),
      0
    );

  const totalAhorros =
    ahorros.reduce(
      (acc: number, ahorro: any) =>
        acc +
        Number(
          ahorro.monto_actual
        ),
      0
    );

  const balance =
    totalIngresos -
    totalGastos;

  const descargarPDF =
    async () => {

      const input =
        document.getElementById(
          'reportePDF'
        );

      if (!input) return;

      const canvas =
        await html2canvas(
          input
        );

      const imgData =
        canvas.toDataURL(
          'image/png'
        );

      const pdf =
        new jsPDF();

      pdf.addImage(
        imgData,
        'PNG',
        10,
        10,
        190,
        0
      );

      pdf.save(
        'ReporteFinanciero.pdf'
      );
    };

  const data = {

    labels: [
      'Ingresos',
      'Gastos',
      'Ahorros',
    ],

    datasets: [
      {
        data: [
          totalIngresos,
          totalGastos,
          totalAhorros,
        ],
      },
    ],
  };

  return (

    <div
      className="page"
      id="reportePDF"
    >

      <h1>
        Reportes Financieros
      </h1>

      <div
        className="dashboard-grid"
      >

        <div className="dashboard-card">

          <h2>
            Total Ingresos
          </h2>

          <p>
            Bs. {totalIngresos.toFixed(2)}
          </p>

        </div>

        <div className="dashboard-card">

          <h2>
            Total Gastos
          </h2>

          <p>
            Bs. {totalGastos.toFixed(2)}
          </p>

        </div>

        <div className="dashboard-card">

          <h2>
            Total Ahorros
          </h2>

          <p>
            Bs. {totalAhorros.toFixed(2)}
          </p>

        </div>

        <div className="dashboard-card">

          <h2>
            Balance Actual
          </h2>

          <p>
            Bs. {balance.toFixed(2)}
          </p>

        </div>

      </div>

      <div
        style={{
          width: '400px',
          margin: '40px auto',
        }}
      >

        <Pie data={data} />

      </div>

      <div
        style={{
          textAlign: 'center',
        }}
      >

        <button
          onClick={
            descargarPDF
          }
        >
          Descargar PDF
        </button>

      </div>

    </div>
  );
}

export default Reportes;