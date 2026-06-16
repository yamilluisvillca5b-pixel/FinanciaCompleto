import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { CategoriaModule } from './categoria/categoria.module';
import { RangoControlModule } from './rango-control/rango-control.module';
import { GastoModule } from './gasto/gasto.module';
import { IngresoModule } from './ingreso/ingreso.module';
import { AhorroModule } from './ahorro/ahorro.module';
import { ReporteModule } from './reporte/reporte.module';
import { CategoriaIngresoModule } from './categoria-ingreso/categoria-ingreso.module';
import { ChatModule } from './chat/chat.module';
import { LogAccesoModule } from './log-acceso/log-acceso.module';

@Module({
  
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,

      ssl:{
        rejectUnauthorized:false,
      },
      autoLoadEntities: true,
      synchronize: true,
      
    }),
    

    UsuarioModule,
    AuthModule,
    CategoriaModule,
    RangoControlModule,
    GastoModule,
    IngresoModule,
    AhorroModule,
    ReporteModule,
    CategoriaIngresoModule,
    ChatModule,
    LogAccesoModule,
  ],
  
})

export class AppModule {}console.log('HOST:', process.env.DB_HOST);
console.log('PORT:', process.env.DB_PORT);
console.log('DATABASE:', process.env.DB_DATABASE);