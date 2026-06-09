import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('rango_control')
export class RangoControl {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha_inicio: Date;

  @Column()
  fecha_fin: Date;

  @Column('decimal')
  presupuesto_inicial: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}