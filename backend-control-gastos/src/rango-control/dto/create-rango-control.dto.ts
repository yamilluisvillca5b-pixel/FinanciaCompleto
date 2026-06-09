import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateRangoControlDto {

  @IsDateString()
  fecha_inicio: Date;

  @IsDateString()
  fecha_fin: Date;

  @IsNumber()
  presupuesto_inicial: number;

  @IsNumber()
  id_usuario: number;
}