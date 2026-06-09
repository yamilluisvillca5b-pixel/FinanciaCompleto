import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('categoria_ingreso')
export class CategoriaIngreso {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;
}