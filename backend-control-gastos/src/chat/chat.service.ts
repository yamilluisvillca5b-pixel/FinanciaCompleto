import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import axios from 'axios';

import { Ingreso } from '../ingreso/entities/ingreso.entity';
import { Gasto } from '../gasto/entities/gasto.entity';
import { Ahorro } from '../ahorro/entities/ahorro.entity';
import { RangoControl } from '../rango-control/entities/rango-control.entity'; 
import { Reporte } from '../reporte/entities/reporte.entity'; 

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,

    @InjectRepository(Ingreso)
    private ingresoRepository: Repository<Ingreso>,

    @InjectRepository(Gasto)
    private gastoRepository: Repository<Gasto>,

    @InjectRepository(Ahorro)
    private ahorroRepository: Repository<Ahorro>,

    @InjectRepository(RangoControl)
    private rangoControlRepository: Repository<RangoControl>,

    @InjectRepository(Reporte)
    private reporteRepository: Repository<Reporte>,
  ) {}

  async create(createChatDto: CreateChatDto) {
    const pregunta = createChatDto.pregunta;
    const usuarioId = createChatDto.id_usuario;

    try {
      //base de datos
      const ingresos = await this.ingresoRepository.find({
        where: { usuario: { id: usuarioId } },
        relations: ['categoriaIngreso'],
      });

      const gastos = await this.gastoRepository.find({
        where: { usuario: { id: usuarioId } },
        relations: ['categoria'],
      });

      const ahorrosData = await this.ahorroRepository.find({
        where: { usuario: { id: usuarioId } },
      });

      const rangosControl = await this.rangoControlRepository.find({
        where: { usuario: { id: usuarioId } },
      });

      const reportes = await this.reporteRepository.find({
        where: { usuario: { id: usuarioId } },
      });

      let totalIngresos = 0;
      let totalGastos = 0;
      let totalAhorroAcumulado = 0;
      let prestamos = 0;
      let pagosDeuda = 0;

     //ollama

    
      const listaGastosDetallada = gastos.map((g) => {
        totalGastos += Number(g.monto);
        const catGasto = g.categoria?.nombre?.toLowerCase() || '';
        if (catGasto.includes('ahorro')) totalAhorroAcumulado += Number(g.monto);
        if (catGasto.includes('deuda')) pagosDeuda += Number(g.monto);

        return `- Bs. ${g.monto} | Cat: ${g.categoria?.nombre || 'Sin categoría'} | Desc: ${g.descripcion || 'Sin descripción'} | Fecha: ${g.fecha}`;
      }).join('\n');

      // mapeo de ingresoos
      const listaIngresosDetallada = ingresos.map((i) => {
        totalIngresos += Number(i.monto);
        const catIngreso = i.categoriaIngreso?.nombre?.toLowerCase() || '';
        if (catIngreso.includes('prestamo') || catIngreso.includes('préstamo')) prestamos += Number(i.monto);

        return `- Bs. ${i.monto} | Cat: ${i.categoriaIngreso?.nombre || 'Sin categoría'} | Desc: ${i.descripcion || 'Sin descripción'} | Fecha: ${i.fecha}`;
      }).join('\n');

      // mapeo de rango de control
      const listaRangosDetallada = rangosControl.map((r) => 
        `- Rango ID #${r.id} | Presupuesto: Bs. ${r.presupuesto_inicial} | Desde: ${r.fecha_inicio} Hasta: ${r.fecha_fin}`
      ).join('\n');

      
      const listaReportesDetallada = reportes.map((rep) => {
        const balanceReporte = Number(rep.total_ingresos) - Number(rep.total_gastos);
        return `- Reporte ID #${rep.id} | Total Ingresos: Bs. ${rep.total_ingresos} | Total Gastos: Bs. ${rep.total_gastos} | Balance Calculado: Bs. ${balanceReporte} | Fecha: ${rep.fecha_reporte}`;
      }).join('\n');

      const balance = totalIngresos - totalGastos;
      const totalDeudas = prestamos - pagosDeuda;

      let metaAhorroTexto = 'No establecida';
      let porcentajeAhorroTexto = '0%';
      if (ahorrosData.length > 0) {
        const ahorro = ahorrosData[0];
        const porc = (Number(ahorro.monto_actual) * 100) / Number(ahorro.meta_dinero);
        metaAhorroTexto = `Meta: Bs. ${ahorro.meta_dinero} | Monto Actual: Bs. ${ahorro.monto_actual}`;
        porcentajeAhorroTexto = `${porc.toFixed(0)}%`;
      }

    //promt de la Ia
      const promptInteligente = `
Eres FinanzIA, un asesor financiero inteligente, analítico y experto en finanzas personales.

Tienes acceso total al estado financiero actual de la base de datos del usuario. Analiza detalladamente las listas completas para responder de forma exacta (con montos, descripciones, categorías y fechas):

RESUMEN MONETARIO GLOBAL:
- Balance Neto: Bs. ${balance}
- Total Ingresos: Bs. ${totalIngresos}
- Total Gastos: Bs. ${totalGastos}
- Deuda Pendiente Calculada: Bs. ${totalDeudas}
- Estado de Ahorros: ${metaAhorroTexto} (${porcentajeAhorroTexto} completado)

HISTORIAL DETALLADO DE GASTOS:
${listaGastosDetallada || 'No hay gastos registrados.'}

HISTORIAL DETALLADO DE INGRESOS:
${listaIngresosDetallada || 'No hay ingresos registrados.'}

RANGOS DE CONTROL CONFIGURADOS:
${listaRangosDetallada || 'No hay rangos de control registrados.'}

REPORTES FINANCIEROS GENERADOS:
${listaReportesDetallada || 'No hay reportes creados previamente.'}

PREGUNTA DEL USUARIO:
"${pregunta}"

INSTRUCCIONES CRÍTICAS:
1. Responde con precisión milimétrica basándote en los datos anteriores. Si te preguntan por el gasto más grande, búscalo en la lista detallada de gastos, mira su descripción y categoría, y menciónalo explícitamente.
2. Sé amigable pero directo. Estás en Bolivia, por lo tanto mantén las respuestas expresadas con la moneda oficial (Bs.).
3. No inventes registros de transacciones que no estén explícitamente listados arriba.
`;

      //CONEXXION DE LA APi
      const respuestaIA = await axios.post(
        'http://localhost:11434/api/generate',
        {
          model: 'llama3:latest',
          prompt: promptInteligente,
          stream: false,
        },
      );

      const respuesta = respuestaIA.data.response;

      const chat = this.chatRepository.create({
        pregunta,
        respuesta,
        usuario: { id: usuarioId },
      });

      return await this.chatRepository.save(chat);

    } catch (error) {
      console.error('Error crítico en el ChatService Asesor completo:', error.message);
      throw new Error('Hubo un problema al procesar tu consulta analítica con la IA.');
    }
  }

  async findAll() {
    return await this.chatRepository.find({
      relations: ['usuario'],
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: number) {
    const chat = await this.chatRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });
    if (!chat) throw new NotFoundException('Chat no encontrado');
    return chat;
  }

  async remove(id: number) {
    const chat = await this.findOne(id);
    await this.chatRepository.remove(chat);
    return { message: 'Chat eliminado correctamente' };
  }
}