import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'mi_clave_secreta',
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      nombre: payload.nombre,
      tipo_usuario: payload.tipo_usuario,
    };
  }
}