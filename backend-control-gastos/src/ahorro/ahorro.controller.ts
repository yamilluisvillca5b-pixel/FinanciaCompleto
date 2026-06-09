import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AhorroService } from './ahorro.service';
import { CreateAhorroDto } from './dto/create-ahorro.dto';
import { UpdateAhorroDto } from './dto/update-ahorro.dto';

@Controller('ahorro')
export class AhorroController {
  constructor(private readonly ahorroService: AhorroService) {}

  @Post()
  create(@Body() createAhorroDto: CreateAhorroDto) {
    return this.ahorroService.create(createAhorroDto);
  }

  @Get()
  findAll() {
    return this.ahorroService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ahorroService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAhorroDto: UpdateAhorroDto) {
    return this.ahorroService.update(+id, updateAhorroDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ahorroService.remove(+id);
  }

  // --- NUEVOS ENDPOINTS SOLICITADOS ---

  @Post(':id/aporte')
  realizarAporte(@Param('id') id: string) {
    return this.ahorroService.realizarAporte(+id);
  }

  @Get(':id/resumen')
  obtenerResumen(@Param('id') id: string) {
    return this.ahorroService.obtenerResumen(+id);
  }
}