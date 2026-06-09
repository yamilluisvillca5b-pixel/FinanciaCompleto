import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('categoria')
export class Categoria {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToOne(() => Usuario)
  usuario: Usuario;
}