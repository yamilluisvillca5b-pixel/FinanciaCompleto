import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Usuario {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;
@Column({ nullable: true })
correo: string;

@Column({ nullable: true })
password_hash: string;
  @Column()
  tipo_usuario: string;
}