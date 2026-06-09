import { IsEmail, IsString } from 'class-validator';

export class CreateUsuarioDto {

  @IsString()
  nombre: string;

  @IsEmail()
  correo: string;

  @IsString()
  password: string;

  @IsString()
  tipo_usuario: string;
}