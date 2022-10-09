import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user.entity';

export enum status {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DELETED = 'deleted',
}
@Entity()
export class Friendship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: status, default: status.PENDING })
  status: status;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.senderFriend, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'request_sender_id' })
  senderId: User;

  @ManyToOne(() => User, (user) => user.receiverFriend, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'request_receiver_id' })
  receiverId: User;
}
