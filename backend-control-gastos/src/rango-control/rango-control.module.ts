import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { RangoControlService } from './rango-control.service';
import { RangoControlController } from './rango-control.controller';

import { RangoControl } from './entities/rango-control.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RangoControl,
      Usuario,
    ]),
  ],

  controllers: [RangoControlController],

  providers: [RangoControlService],
})
export class RangoControlModule {}