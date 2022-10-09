import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  @Column({
    length: 255,
    unique: true,
    default: 'USER',
  })
  @IsNotEmpty()
  name: string;
}
