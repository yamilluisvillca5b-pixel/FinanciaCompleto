import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('chat')
export class Chat {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  pregunta: string;

  @Column('text')
  respuesta: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}