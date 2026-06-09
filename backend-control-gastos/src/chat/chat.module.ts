import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Chat } from './entities/chat.entity';
import { Ingreso } from '../ingreso/entities/ingreso.entity';
import { Gasto } from '../gasto/entities/gasto.entity';
import { Ahorro } from '../ahorro/entities/ahorro.entity';
import { RangoControl } from '../rango-control/entities/rango-control.entity';
import { Reporte } from '../reporte/entities/reporte.entity';

@Module({
  imports: [
 
    TypeOrmModule.forFeature([Chat, Ingreso, Gasto, Ahorro, RangoControl, Reporte]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}