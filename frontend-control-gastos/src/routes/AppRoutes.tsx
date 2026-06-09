import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Usuarios from '../pages/Usuarios';
import Gastos from '../pages/Gastos';
import Categorias from '../pages/Categorias';
import Ingresos from '../pages/Ingresos';
import Ahorros from '../pages/Ahorros';
import Reportes from '../pages/Reportes';
import RangoControl from '../pages/RangoControl';
import Register from '../pages/Register';
import DetalleReporte from '../pages/DetalleReporte';
import ChatIA from '../pages/ChatIA';
import CategoriaIngreso from '../pages/CategoriaIngreso';


function AppRoutes() {
  const tipoUsuario = localStorage.getItem('tipoUsuario');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Ruta protegida */}
        <Route
          path="/usuarios"
          element={
            tipoUsuario === 'admin' 
              ? <Usuarios /> 
              : <Navigate to="/dashboard" />
          }
        />
        <Route path="/Chat"element={<ChatIA />}/>

        <Route path="/gastos" element={<Gastos />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/ingresos" element={<Ingresos />} />
        <Route path="/ahorros" element={<Ahorros />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/RangoControl" element={<RangoControl />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reporte/:id" element={<DetalleReporte />} />
        <Route path="/categoria-ingreso"element={<CategoriaIngreso />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;