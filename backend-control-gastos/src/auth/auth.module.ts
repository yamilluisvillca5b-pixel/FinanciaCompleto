import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  imports: [
    UsuarioModule,

    JwtModule.register({
      secret: 'mi_clave_secreta',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}