import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class LogAcceso {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuario: string;

  @Column()
  evento: string;

  @Column()
  ip: string;

  @Column()
  navegador: string;

  @Column()
  fechaHora: Date;
}