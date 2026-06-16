import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LogAcceso } from './entities/log-acceso.entity';

@Injectable()
export class LogAccesoService {
  constructor(
    @InjectRepository(LogAcceso)
    private logRepository: Repository<LogAcceso>,
  ) {}

  async registrar(
    usuario: string,
    evento: string,
    ip: string,
    navegador: string,
  ) {
    console.log('ENTRO AL SERVICIO LOG');
    const log = this.logRepository.create({
      usuario,
      evento,
      ip,
      navegador,
      fechaHora: new Date(),
    });
    console.log('DATOS DEL LOG:', log);

    return this.logRepository.save(log);
  }

  async findAll() {
    return this.logRepository.find({
      order: {
        fechaHora: 'DESC',
      },
    });
  }
}