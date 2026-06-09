import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Gasto } from './entities/gasto.entity';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';

@Injectable()
export class GastoService {
  constructor(
    @InjectRepository(Gasto)
    private readonly gastoRepository: Repository<Gasto>,
  ) {}

  async create(createGastoDto: CreateGastoDto) {
    const gasto = this.gastoRepository.create({
      ...createGastoDto,
      usuario: { id: createGastoDto.id_usuario },
      categoria: { id: createGastoDto.id_categoria },
    });

    return await this.gastoRepository.save(gasto);
  }

  async findAll() {
    return await this.gastoRepository.find({
      relations: ['usuario', 'categoria'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const gasto = await this.gastoRepository.findOne({
      where: { id },
      relations: ['usuario', 'categoria'],
    });

    if (!gasto) {
      throw new NotFoundException(
        `El gasto con ID ${id} no existe`,
      );
    }

    return gasto;
  }

  async update(id: number, updateGastoDto: UpdateGastoDto) {
    const gasto = await this.findOne(id);

    const editado = this.gastoRepository.merge(gasto, {
      ...updateGastoDto,
      usuario: updateGastoDto.id_usuario
        ? { id: updateGastoDto.id_usuario }
        : gasto.usuario,

      categoria: updateGastoDto.id_categoria
        ? { id: updateGastoDto.id_categoria }
        : gasto.categoria,
    });

    return await this.gastoRepository.save(editado);
  }

  async remove(id: number) {
    const gasto = await this.findOne(id);

    await this.gastoRepository.remove(gasto);

    return {
      message: `Gasto con ID ${id} eliminado correctamente`,
    };
  }
}