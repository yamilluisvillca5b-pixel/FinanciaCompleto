import { IsDateString, IsNumber } from 'class-validator';

export class CreateAhorroDto {

  @IsNumber()
  meta_dinero: number;

  @IsNumber()
  monto_actual: number;

  @IsDateString()
  fecha_limite: Date;

  @IsNumber()
  presupuesto_diario: number;

  @IsNumber()
  id_usuario: number;
}