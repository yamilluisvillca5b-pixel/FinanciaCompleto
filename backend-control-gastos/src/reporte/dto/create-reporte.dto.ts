import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateReporteDto {

  @IsString()
  tipo_reporte: string;

  @IsString()
  resumen: string;

  @IsNumber()
  total_ingresos: number;

  @IsNumber()
  total_gastos: number;

  @IsDateString()
  fecha_reporte: Date;

  @IsNumber()
  id_usuario: number;
}