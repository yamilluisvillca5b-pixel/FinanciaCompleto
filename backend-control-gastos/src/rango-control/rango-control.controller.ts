import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { RangoControlService } from './rango-control.service';
import { CreateRangoControlDto } from './dto/create-rango-control.dto';
import { UpdateRangoControlDto } from './dto/update-rango-control.dto';

@Controller('rango-control')
export class RangoControlController {

  constructor(
    private readonly rangoControlService: RangoControlService,
  ) {}

  @Post()
  create(
    @Body() createRangoControlDto: CreateRangoControlDto,
  ) {
    return this.rangoControlService.create(createRangoControlDto);
  }

  @Get()
  findAll() {
    return this.rangoControlService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rangoControlService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRangoControlDto: UpdateRangoControlDto,
  ) {
    return this.rangoControlService.update(
      +id,
      updateRangoControlDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rangoControlService.remove(+id);
  }
}