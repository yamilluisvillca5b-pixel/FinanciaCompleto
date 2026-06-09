import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoriaIngreso } from './entities/categoria-ingreso.entity';

import { CategoriaIngresoService } from './categoria-ingreso.service';
import { CategoriaIngresoController } from './categoria-ingreso.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoriaIngreso,
    ]),
  ],

  controllers: [
    CategoriaIngresoController,
  ],

  providers: [
    CategoriaIngresoService,
  ],
})
export class CategoriaIngresoModule {}