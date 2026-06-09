import { useState, useEffect } from 'react';
import api from '../services/api';

interface Mensaje {
  id?: number;
  pregunta: string;
  respuesta: string;
  fecha?: string;
}

function ChatIA() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevaPregunta, setNuevaPregunta] = useState('');
  const [cargando, setCargando] = useState(false);
  const usuarioId = localStorage.getItem('usuarioId');

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    try {
      const res = await api.get('/chat');
      // Filtramos las interacciones para mostrar únicamente las de este usuario activo
      const historialUsuario = res.data.filter((c: any) => c.usuario?.id == usuarioId);
      setMensajes(historialUsuario.reverse()); // Mostrar los más nuevos abajo
    } catch (error) {
      console.error("Error al cargar el historial de chat:", error);
    }
  };

  const enviarPregunta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaPregunta.trim() || cargando) return;

    const preguntaActual = nuevaPregunta;
    setNuevaPregunta('');
    setCargando(true);

    // Añadimos la pregunta inmediatamente de forma visual mientras responde la IA
    const mensajeTemporal: Mensaje = { pregunta: preguntaActual, respuesta: 'Pensando...' };
    setMensajes((prev) => [...prev, mensajeTemporal]);

    try {
      const res = await api.post('/chat', {
        pregunta: preguntaActual,
        id_usuario: Number(usuarioId)
      });

      // Reemplazamos el mensaje temporal por la respuesta guardada en la BD
      setMensajes((prev) => 
        prev.map((m) => m.respuesta === 'Pensando...' && m.pregunta === preguntaActual ? res.data : m)
      );
    } catch (error) {
      console.error("Error al conectar con FinanzIA:", error);
      setMensajes((prev) => 
        prev.map((m) => m.respuesta === 'Pensando...' && m.pregunta === preguntaActual ? { ...m, respuesta: 'Error: No se pudo obtener respuesta del asesor.' } : m)
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '10px', color: '#2c3e50' }}>Asesor Financiero Inteligente — FinanzIA</h2>
      
      {/* Caja del Historial de Conversación */}
      <div style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '8px', padding: '15px', backgroundColor: '#f9f9f9', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {mensajes.length === 0 ? (
          <p style={{ color: '#777', textAlign: 'center', marginTop: '180px' }}>¡Hola! Hazme cualquier consulta sobre tus gastos, ingresos, deudas o reportes.</p>
        ) : (
          mensajes.map((m, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {/* Pregunta del Usuario */}
              <div style={{ alignSelf: 'flex-end', backgroundColor: '#3498db', color: 'white', padding: '10px 15px', borderRadius: '15px 15px 0 15px', maxWidth: '70%', wordBreak: 'break-word' }}>
                <strong>Tú:</strong> {m.pregunta}
              </div>
              {/* Respuesta de la IA */}
              <div style={{ alignSelf: 'flex-start', backgroundColor: '#e9ecef', color: '#333', padding: '10px 15px', borderRadius: '15px 15px 15px 0', maxWidth: '70%', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
                <strong>FinanzIA:</strong> {m.respuesta}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Formulario de Envío */}
      <form onSubmit={enviarPregunta} style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          value={nuevaPregunta}
          onChange={(e) => setNuevaPregunta(e.target.value)}
          placeholder="Ej. ¿Cuál ha sido mi gasto más alto este mes y en qué?"
          disabled={cargando}
          style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '14px' }}
        />
        <button 
          type="submit" 
          disabled={cargando}
          style={{ padding: '12px 24px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}
        >
          {cargando ? 'Procesando...' : 'Preguntar'}
        </button>
      </form>
    </div>
  );
}

export default ChatIA;