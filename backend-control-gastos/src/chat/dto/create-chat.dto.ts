import {
  IsString,
  IsNumber,
} from 'class-validator';

export class CreateChatDto {

  @IsString()
  pregunta: string;

  @IsNumber()
  id_usuario: number;
}