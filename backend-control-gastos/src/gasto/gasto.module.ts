import { Module } from '@nestjs/common';
import { GastoService } from './gasto.service';
import { GastoController } from './gasto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gasto } from './entities/gasto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gasto])],
  controllers: [GastoController],
  providers: [GastoService],
})
export class GastoModule {}