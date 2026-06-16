import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { UsuarioService } from './usuario.service';

import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('usuario')
export class UsuarioController {

  constructor(
    private readonly usuarioService: UsuarioService,
  ) {}

  @Post()
  create(
    @Body() createUsuarioDto: CreateUsuarioDto,
  ) {
    return this.usuarioService.create(
      createUsuarioDto,
    );
  }

  @Get()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('admin')
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('admin')
  findOne(
    @Param('id') id: string,
  ) {
    return this.usuarioService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body()
    updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuarioService.update(
      +id,
      updateUsuarioDto,
    );
  }

  @Delete(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('admin')
  remove(
    @Param('id') id: string,
  ) {
    return this.usuarioService.remove(+id);
  }
}