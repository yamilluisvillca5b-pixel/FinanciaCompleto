import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Usuario } from '../../usuario/entities/usuario.entity';

import { CategoriaIngreso } from '../../categoria-ingreso/entities/categoria-ingreso.entity';

@Entity('ingreso')
export class Ingreso {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  monto: number;

  @Column()
  fecha: Date;

  @Column()
  descripcion: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => CategoriaIngreso)
  @JoinColumn({ name: 'id_categoria_ingreso' })
  categoriaIngreso: CategoriaIngreso;
}