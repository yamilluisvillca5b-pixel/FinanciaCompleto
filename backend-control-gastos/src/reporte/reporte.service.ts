import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Reporte } from './entities/reporte.entity';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';

import { Ingreso } from '../ingreso/entities/ingreso.entity';
import { Gasto } from '../gasto/entities/gasto.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { RangoControl } from '../rango-control/entities/rango-control.entity';

@Injectable()
export class ReporteService {
  constructor(
    @InjectRepository(Reporte)
    private readonly reporteRepository: Repository<Reporte>,
    
    @InjectRepository(Ingreso)
    private readonly ingresoRepository: Repository<Ingreso>,
    
    @InjectRepository(Gasto)
    private readonly gastoRepository: Repository<Gasto>,
    
    @InjectRepository(RangoControl)
    private readonly rangoRepository: Repository<RangoControl>,
    
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createReporteDto: CreateReporteDto) {
    const reporte = this.reporteRepository.create({
      ...createReporteDto,
      usuario: { id: createReporteDto.id_usuario },
    });

    return await this.reporteRepository.save(reporte);
  }

  async findAll() {
    return await this.reporteRepository.find({
      relations: ['usuario'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const reporte = await this.reporteRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!reporte) {
      throw new NotFoundException(`El reporte con ID ${id} no existe`);
    }

    return reporte;
  }

  async update(id: number, updateReporteDto: UpdateReporteDto) {
    const reporte = await this.findOne(id);

    const editado = this.reporteRepository.merge(reporte, {
      ...updateReporteDto,
      usuario: updateReporteDto.id_usuario
        ? { id: updateReporteDto.id_usuario }
        : reporte.usuario,
    });

    return await this.reporteRepository.save(editado);
  }

  async remove(id: number) {
    const reporte = await this.findOne(id);
    await this.reporteRepository.remove(reporte);
    return {
      message: `Reporte con ID ${id} eliminado correctamente`,
    };
  }


  async generarReporte(usuarioId: number, rangoId: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

  
    const rango = await this.rangoRepository.findOne({
      where: { id: rangoId },
      relations: ['usuario'],
    });

    if (!rango) {
      throw new NotFoundException('No existe rango de control con ese ID');
    }

    const ingresos = await this.ingresoRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario'],
    });

    const gastos = await this.gastoRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario'],
    });

    const fechaInicio = new Date(rango.fecha_inicio);
    const fechaFin = new Date(rango.fecha_fin);

    const ingresosFiltrados = ingresos.filter((i) => {
      const fecha = new Date(i.fecha);
      return fecha >= fechaInicio && fecha <= fechaFin;
    });

    const gastosFiltrados = gastos.filter((g) => {
      const fecha = new Date(g.fecha);
      return fecha >= fechaInicio && fecha <= fechaFin;
    });

    const totalIngresos = ingresosFiltrados.reduce(
      (acc, item) => acc + Number(item.monto),
      0,
    );

    const totalGastos = gastosFiltrados.reduce(
      (acc, item) => acc + Number(item.monto),
      0,
    );

    const reporte = this.reporteRepository.create({
      tipo_reporte: 'Control Financiero',
      resumen: `Periodo ${rango.fecha_inicio} al ${rango.fecha_fin}`,
      total_ingresos: totalIngresos,
      total_gastos: totalGastos,
      fecha_reporte: new Date(),
      usuario,
    });

    return await this.reporteRepository.save(reporte);
  }
}