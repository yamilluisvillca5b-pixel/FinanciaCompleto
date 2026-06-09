import {
  IsEmail,
  IsString,
} from 'class-validator';

export class RegisterDto {

  @IsString()
  nombre: string;

  @IsEmail()
  correo: string;

  @IsString()
  password: string;
}