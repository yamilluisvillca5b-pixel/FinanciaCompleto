import { Controller, Get } from '@nestjs/common';
import { LogAccesoService } from './log-acceso.service';

@Controller('log-acceso')
export class LogAccesoController {
  constructor(
    private readonly logAccesoService: LogAccesoService,
  ) {}

  @Get('prueba')
  async prueba() {
    return this.logAccesoService.registrar(
      'Yamil',
      'PRUEBA',
      '127.0.0.1',
      'Chrome',
    );
  }

  @Get() // AGREGADO: Esto mapea la petición GET /log-acceso
  findAll() {
    return this.logAccesoService.findAll();
  }
}