import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UsuarioService } from '../usuario/usuario.service';
import { RegisterDto } from './dto/register.dto';
import { LogAccesoService } from '../log-acceso/log-acceso.service';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private logAccesoService: LogAccesoService,
  ) {}

  async login(
    nombre: string,
    password: string,
    ip: string,
    navegador: string,
  ) {
    const usuarios = await this.usuarioService.findAll();

    const usuario = usuarios.find(
      (u) => u.nombre === nombre,
    );

    if (!usuario) {
      throw new UnauthorizedException(
        'Usuario no encontrado',
      );
    }

    const passwordValida = await bcrypt.compare(
      password,
      usuario.password_hash,
    );

    if (!passwordValida) {
      throw new UnauthorizedException(
        'Contraseña incorrecta',
      );
    }

    const payload = {
      sub: usuario.id,
      nombre: usuario.nombre,
      tipo_usuario: usuario.tipo_usuario,
    };

    console.log('LOGIN CORRECTO');
    console.log('VOY A GUARDAR LOG');
    
    await this.logAccesoService.registrar(
      usuario.nombre,
      'INGRESO',
      ip,
      navegador,
    );
    
    console.log('LOG GUARDADO');

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        tipo_usuario: usuario.tipo_usuario,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const nuevoUsuario =
      await this.usuarioService.create({
        nombre: registerDto.nombre,
        correo: registerDto.correo,
        password: registerDto.password,
        tipo_usuario: 'cliente',
      });

    return {
      message: 'Usuario registrado correctamente',
      usuario: nuevoUsuario,
    };
  }
}