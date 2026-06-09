import {
  IsDateString,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateGastoDto {

  @IsNumber()
  monto: number;

  @IsDateString()
  fecha: Date;

  @IsString()
  descripcion: string;

  @IsNumber()
  id_usuario: number;

  @IsNumber()
  id_categoria: number;
}