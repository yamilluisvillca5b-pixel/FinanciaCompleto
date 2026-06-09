import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ahorro } from './entities/ahorro.entity';
import { CreateAhorroDto } from './dto/create-ahorro.dto';
import { UpdateAhorroDto } from './dto/update-ahorro.dto';

@Injectable()
export class AhorroService {
  constructor(
    @InjectRepository(Ahorro)
    private readonly ahorroRepository: Repository<Ahorro>,
  ) {}

  async create(createAhorroDto: CreateAhorroDto) {
    const ahorro = this.ahorroRepository.create({
      ...createAhorroDto,
      usuario: { id: createAhorroDto.id_usuario },
    });

    return await this.ahorroRepository.save(ahorro);
  }

  async findAll() {
    return await this.ahorroRepository.find({
      relations: ['usuario'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const ahorro = await this.ahorroRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!ahorro) {
      throw new NotFoundException(
        `El ahorro con ID ${id} no existe`,
      );
    }

    return ahorro;
  }

  async update(id: number, updateAhorroDto: UpdateAhorroDto) {
    const ahorro = await this.findOne(id);

    const editado = this.ahorroRepository.merge(ahorro, {
      ...updateAhorroDto,
      usuario: updateAhorroDto.id_usuario
        ? { id: updateAhorroDto.id_usuario }
        : ahorro.usuario,
    });

    return await this.ahorroRepository.save(editado);
  }

  async remove(id: number) {
    const ahorro = await this.findOne(id);

    await this.ahorroRepository.remove(ahorro);

    return {
      message: `Ahorro con ID ${id} eliminado correctamente`,
    };
  }



  async realizarAporte(id: number) {
    const ahorro = await this.findOne(id);

    ahorro.monto_actual =
      Number(ahorro.monto_actual) +
      Number(ahorro.presupuesto_diario);

    return await this.ahorroRepository.save(ahorro);
  }

  async obtenerResumen(id: number) {
    const ahorro = await this.findOne(id);

    const porcentaje =
      Number(ahorro.meta_dinero) > 0 ? (Number(ahorro.monto_actual) * 100) /Number(ahorro.meta_dinero): 0;

    const faltante =
      Number(ahorro.meta_dinero) -
      Number(ahorro.monto_actual);

    return {
      meta: ahorro.meta_dinero,
      actual: ahorro.monto_actual,
      porcentaje: porcentaje.toFixed(2),
      faltante,
      fecha_limite: ahorro.fecha_limite,
      aporte_diario: ahorro.presupuesto_diario,
    };
  }
}
