import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CategoriaIngreso } from './entities/categoria-ingreso.entity';

import { CreateCategoriaIngresoDto } from './dto/create-categoria-ingreso.dto';

import { UpdateCategoriaIngresoDto } from './dto/update-categoria-ingreso.dto';

@Injectable()
export class CategoriaIngresoService {

  constructor(

    @InjectRepository(CategoriaIngreso)

    private categoriaIngresoRepository:
      Repository<CategoriaIngreso>,

  ) {}

  async create(
    createDto: CreateCategoriaIngresoDto,
  ) {

    const categoria =
      this.categoriaIngresoRepository.create(
        createDto,
      );

    return await this.categoriaIngresoRepository.save(
      categoria,
    );
  }

  async findAll() {

    return await this.categoriaIngresoRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number) {

    const categoria =
      await this.categoriaIngresoRepository.findOne({
        where: { id },
      });

    if (!categoria) {

      throw new NotFoundException(
        'Categoría no encontrada',
      );
    }

    return categoria;
  }

  async update(
    id: number,
    updateDto: UpdateCategoriaIngresoDto,
  ) {

    const categoria =
      await this.findOne(id);

    Object.assign(
      categoria,
      updateDto,
    );

    return await this.categoriaIngresoRepository.save(
      categoria,
    );
  }

  async remove(id: number) {

    const categoria =
      await this.findOne(id);

    await this.categoriaIngresoRepository.remove(
      categoria,
    );

    return {
      message:
        'Categoría eliminada correctamente',
    };
  }
}