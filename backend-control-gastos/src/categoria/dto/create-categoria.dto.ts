import { IsNumber, IsString } from 'class-validator';

export class CreateCategoriaDto {

  @IsString()
  nombre: string;

  @IsNumber()
  usuarioId: number;
}