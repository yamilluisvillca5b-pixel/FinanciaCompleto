import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Entity()
export class Reporte {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo_reporte: string;

  @Column('text')
  resumen: string;

  @Column('decimal')
  total_ingresos: number;

  @Column('decimal')
  total_gastos: number;

  @Column({ type: 'date' })
  fecha_reporte: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}