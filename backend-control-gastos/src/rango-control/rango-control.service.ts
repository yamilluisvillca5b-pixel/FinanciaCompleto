import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { RangoControl } from './entities/rango-control.entity';

import { CreateRangoControlDto } from './dto/create-rango-control.dto';
import { UpdateRangoControlDto } from './dto/update-rango-control.dto';

import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class RangoControlService {

  constructor(

    @InjectRepository(RangoControl)
    private rangoRepository: Repository<RangoControl>,

    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,

  ) {}

  async create(
    createDto: CreateRangoControlDto,
  ) {

    const usuario =
      await this.usuarioRepository.findOne({

        where: {
          id: createDto.id_usuario,
        },

      });

    if (!usuario) {

      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    const rango =
      this.rangoRepository.create({

        fecha_inicio:
          createDto.fecha_inicio,

        fecha_fin:
          createDto.fecha_fin,

        presupuesto_inicial:
          createDto.presupuesto_inicial,

        usuario,

      });

    return await this.rangoRepository.save(
      rango,
    );
  }

  async findAll() {

    return await this.rangoRepository.find({

      relations: ['usuario'],

    });
  }

  async findOne(id: number) {

    const rango =
      await this.rangoRepository.findOne({

        where: { id },

        relations: ['usuario'],

      });

    if (!rango) {

      throw new NotFoundException(
        'Rango no encontrado',
      );
    }

    return rango;
  }

  async update(
    id: number,
    updateDto: UpdateRangoControlDto,
  ) {

    const rango =
      await this.rangoRepository.findOne({

        where: { id },

        relations: ['usuario'],

      });

    if (!rango) {

      throw new NotFoundException(
        'Rango no encontrado',
      );
    }

    if (updateDto.id_usuario) {

      const usuario =
        await this.usuarioRepository.findOne({

          where: {
            id: updateDto.id_usuario,
          },

        });

      if (!usuario) {

        throw new NotFoundException(
          'Usuario no encontrado',
        );
      }

      rango.usuario = usuario;
    }

    Object.assign(rango, updateDto);

    return await this.rangoRepository.save(
      rango,
    );
  }

  async remove(id: number) {

    const rango =
      await this.rangoRepository.findOne({

        where: { id },

      });

    if (!rango) {

      throw new NotFoundException(
        'Rango no encontrado',
      );
    }

    return await this.rangoRepository.remove(
      rango,
    );
  }
}