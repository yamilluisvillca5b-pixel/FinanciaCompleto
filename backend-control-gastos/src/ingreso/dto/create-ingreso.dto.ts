import {
  IsDateString,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateIngresoDto {

  @IsNumber()
  monto: number;

  @IsDateString()
  fecha: Date;

  @IsString()
  descripcion: string;

  @IsNumber()
  id_usuario: number;

  @IsNumber()
  id_categoria_ingreso: number;
}