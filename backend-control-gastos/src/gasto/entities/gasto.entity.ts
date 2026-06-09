import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Entity('gasto')
export class Gasto {
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

@ManyToOne(() => Categoria)
@JoinColumn({ name: 'id_categoria' })
categoria: Categoria;
}