import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriaService {

  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    const categoria = this.categoriaRepository.create(createCategoriaDto);
    return await this.categoriaRepository.save(categoria);
  }

  async findAll() {
    return await this.categoriaRepository.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
    });

    if (!categoria) {
      throw new NotFoundException(
        `La categoría con ID ${id} no existe`,
      );
    }

    return categoria;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {

    const categoria = await this.findOne(id);

    const editado = this.categoriaRepository.merge(
      categoria,
      updateCategoriaDto,
    );

    return await this.categoriaRepository.save(editado);
  }

  async remove(id: number) {

    const categoria = await this.findOne(id);

    await this.categoriaRepository.remove(categoria);

    return {
      message: `Categoría con ID ${id} eliminada correctamente`,
    };
  }
}