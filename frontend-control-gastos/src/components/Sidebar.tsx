import { Link } from 'react-router-dom';

function Sidebar() {
  const tipoUsuario = localStorage.getItem('tipoUsuario');

  return (
    <div className="sidebar">
      <h2>Control Gastos</h2>
      <Link to="/dashboard">Dashboard</Link>

      {tipoUsuario === 'admin' && (
        <Link to="/usuarios">Usuarios</Link>
      )}

      <Link to="/gastos">Gastos</Link>
      <Link to="/ingresos">Ingresos</Link>
      <Link to="/categorias">Categorias</Link>
      <Link to="/ahorros">Ahorros</Link>
      <Link to="/reportes">Reportes</Link>
      <Link to="/recomendaciones">Recomendaciones</Link>
      <Link to="/RangoControl">Rango Control</Link>
      
    </div>
  );
}

export default Sidebar;