import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { IngresoService } from './ingreso.service';
import { IngresoController } from './ingreso.controller';

import { Ingreso } from './entities/ingreso.entity';

import { Usuario } from '../usuario/entities/usuario.entity';

import { CategoriaIngreso } from '../categoria-ingreso/entities/categoria-ingreso.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ingreso,
      Usuario,
      CategoriaIngreso,
    ]),
  ],

  controllers: [IngresoController],

  providers: [IngresoService],
})
export class IngresoModule {}