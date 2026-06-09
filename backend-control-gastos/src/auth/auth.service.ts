import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsuarioService } from '../usuario/usuario.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async login(nombre: string, password: string) {
    const usuarios = await this.usuarioService.findAll();
    const usuario = usuarios.find((u) => u.nombre === nombre);

    //log diacnosticos
    console.log('Usuario recibido:', nombre);
    console.log('Usuario encontrado:', usuario);

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const passwordValida = await bcrypt.compare(
      password,
      usuario.password_hash,
    );

    //losgdiacnosticos
    console.log('Password enviada:', password);
    console.log('Hash BD:', usuario.password_hash);
    console.log('Password válida:', passwordValida);

    if (!passwordValida) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = {
      sub: usuario.id,
      nombre: usuario.nombre,
      tipo_usuario: usuario.tipo_usuario,
    };

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
    // se encarga del hash
    const nuevoUsuario = await this.usuarioService.create({
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