import { PartialType } from '@nestjs/mapped-types';

import { CreateCategoriaIngresoDto }
from './create-categoria-ingreso.dto';

export class UpdateCategoriaIngresoDto
extends PartialType(
  CreateCategoriaIngresoDto,
) {}