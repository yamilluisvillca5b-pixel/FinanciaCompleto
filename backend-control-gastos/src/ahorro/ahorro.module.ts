import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AhorroService } from './ahorro.service';
import { AhorroController } from './ahorro.controller';
import { Ahorro } from './entities/ahorro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ahorro])],
  controllers: [AhorroController],
  providers: [AhorroService],
})
export class AhorroModule {}