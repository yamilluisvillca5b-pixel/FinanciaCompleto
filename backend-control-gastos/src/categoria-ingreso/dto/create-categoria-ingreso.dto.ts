import { IsString } from 'class-validator';

export class CreateCategoriaIngresoDto {

  @IsString()
  nombre: string;

}