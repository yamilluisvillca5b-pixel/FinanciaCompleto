import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReporteService } from './reporte.service';
import { ReporteController } from './reporte.controller';
import { Reporte } from './entities/reporte.entity';

// IMPORTANTE: Ajusta estas rutas según la estructura de tu proyecto
import { Ingreso } from '../ingreso/entities/ingreso.entity';
import { Gasto } from '../gasto/entities/gasto.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { RangoControl } from '../rango-control/entities/rango-control.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reporte,
      Ingreso,
      Gasto,
      Usuario,
      RangoControl,
    ]),
  ],
  controllers: [ReporteController],
  providers: [ReporteService],
})
export class ReporteModule {}