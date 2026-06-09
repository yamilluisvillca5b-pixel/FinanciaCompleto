import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {

  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {

  const hashedPassword = await bcrypt.hash(
    createUsuarioDto.password,
    10,
  );

  const usuario = this.usuarioRepository.create({
    nombre: createUsuarioDto.nombre,
    correo: createUsuarioDto.correo,
    password_hash: hashedPassword,
    tipo_usuario: createUsuarioDto.tipo_usuario,
  });

  return await this.usuarioRepository.save(usuario);
}

  findAll() {
    return this.usuarioRepository.find();
  }

  findOne(id: number) {
    return this.usuarioRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return await this.usuarioRepository.delete(id);
  }
async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {

  const usuario = await this.usuarioRepository.findOne({
    where: { id },
  });

  if (!usuario) {
    return 'Usuario no encontrado';
  }


  usuario.nombre = updateUsuarioDto.nombre ?? usuario.nombre;


  usuario.correo = updateUsuarioDto.correo ?? usuario.correo;


  usuario.tipo_usuario =
    updateUsuarioDto.tipo_usuario ?? usuario.tipo_usuario;

 
  if (updateUsuarioDto.password) {
    usuario.password_hash = await bcrypt.hash(
      updateUsuarioDto.password,
      10,
    );
  }

  return await this.usuarioRepository.save(usuario);
}


}