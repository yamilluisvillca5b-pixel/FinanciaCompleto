import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('ahorro')
export class Ahorro {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  meta_dinero: number;

  @Column('decimal')
  monto_actual: number;

  @Column()
  fecha_limite: Date;

  @Column('decimal')
  presupuesto_diario: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

}