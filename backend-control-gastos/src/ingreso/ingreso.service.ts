import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Ingreso } from './entities/ingreso.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CategoriaIngreso } from '../categoria-ingreso/entities/categoria-ingreso.entity';

import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { UpdateIngresoDto } from './dto/update-ingreso.dto';

@Injectable()
export class IngresoService {

  constructor(

    @InjectRepository(Ingreso)
    private ingresoRepository: Repository<Ingreso>,

    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,

    @InjectRepository(CategoriaIngreso)
    private categoriaIngresoRepository: Repository<CategoriaIngreso>,

  ) {}

  async create(createDto: CreateIngresoDto) {

    const usuario = await this.usuarioRepository.findOne({
      where: {
        id: createDto.id_usuario,
      },
    });

    if (!usuario) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    const categoria = await this.categoriaIngresoRepository.findOne({
      where: {
        id: createDto.id_categoria_ingreso,
      },
    });

    if (!categoria) {
      throw new NotFoundException(
        'Categoría no encontrada',
      );
    }

    const ingreso = new Ingreso();

    ingreso.monto = createDto.monto;
    ingreso.fecha = createDto.fecha;
    ingreso.descripcion = createDto.descripcion;

    ingreso.usuario = usuario;
    ingreso.categoriaIngreso = categoria;

    return await this.ingresoRepository.save(
      ingreso,
    );
  }

  async findAll() {

    return await this.ingresoRepository.find({
      relations: [
        'usuario',
        'categoriaIngreso',
      ],
      order: {
        id: 'DESC',
      },
    });
  }

  async findOne(id: number) {

    const ingreso =
      await this.ingresoRepository.findOne({
        where: { id },
        relations: [
          'usuario',
          'categoriaIngreso',
        ],
      });

    if (!ingreso) {
      throw new NotFoundException(
        'Ingreso no encontrado',
      );
    }

    return ingreso;
  }

  async update(
    id: number,
    updateDto: UpdateIngresoDto,
  ) {

    const ingreso =
      await this.findOne(id);

    if (updateDto.id_usuario) {

      const usuario =
        await this.usuarioRepository.findOne({
          where: {
            id: updateDto.id_usuario,
          },
        });

      if (usuario) {
        ingreso.usuario = usuario;
      }
    }

    if (updateDto.id_categoria_ingreso) {

      const categoria =
        await this.categoriaIngresoRepository.findOne({
          where: {
            id: updateDto.id_categoria_ingreso,
          },
        });

      if (categoria) {
        ingreso.categoriaIngreso =
          categoria;
      }
    }

    if (updateDto.monto !== undefined) {
      ingreso.monto = updateDto.monto;
    }

    if (updateDto.fecha) {
      ingreso.fecha = updateDto.fecha;
    }

    if (updateDto.descripcion) {
      ingreso.descripcion =
        updateDto.descripcion;
    }

    return await this.ingresoRepository.save(
      ingreso,
    );
  }

  async remove(id: number) {

    const ingreso =
      await this.findOne(id);

    await this.ingresoRepository.remove(
      ingreso,
    );

    return {
      message:
        'Ingreso eliminado correctamente',
    };
  }
}