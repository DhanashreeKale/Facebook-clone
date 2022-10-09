import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comments } from '../comment/comment.entity';
import { User } from '../user.entity';

export enum ActivityType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

export enum AccessModifiers {
  PUBLIC = 'public',
  PRIVATE = 'private',
  ME = 'only me',
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  post_id: number;

  @Column()
  post_content: string;

  @Column({
    default: 0,
    type: 'integer',
  })
  number_of_likes: number;

  @Column({
    default: 0,
    type: 'integer',
  })
  number_of_dislikes: number;

  @Column('integer', { array: true, default: null })
  users_liked: number[];

  @Column('integer', { array: true, default: null })
  users_disliked: number[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.uploadedPost, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  uploaderId: User;

  @OneToMany(() => Comments, (comments) => comments.post)
  comments: Comments[];

  @Column({
    type: 'enum',
    enum: AccessModifiers,
    default: AccessModifiers.PUBLIC,
  })
  visibility: AccessModifiers;
}
