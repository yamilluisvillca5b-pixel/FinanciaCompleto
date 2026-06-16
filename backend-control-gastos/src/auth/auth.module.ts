import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UsuarioModule } from '../usuario/usuario.module';
import { LogAccesoModule } from '../log-acceso/log-acceso.module';

import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsuarioModule,
    LogAccesoModule,
    PassportModule,
    JwtModule.register({
      // MODIFICADO: Ahora coincide perfectamente con la estrategia de validación
      secret: process.env.JWT_SECRET || 'mi_clave_secreta',
      signOptions: {
        expiresIn: '1d', // Tus tokens durarán un día entero activos
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  exports: [
    JwtModule,
  ],
})
export class AuthModule {}