import { PartialType } from '@nestjs/mapped-types';
import { CreateRangoControlDto } from './create-rango-control.dto';

export class UpdateRangoControlDto extends PartialType(CreateRangoControlDto) {}