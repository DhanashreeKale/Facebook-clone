import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../role/role.entity';
import { Comments } from './comment/comment.entity';
import { Friendship } from './friendship/friendship.entity';
import { Post } from './posts/posts.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
   
  })
  firstName: string;

  @Column({
    length: 100,
   
  })
  lastName: string;

  @Column({
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    length: 100,
  })
  password: string;

  @Column({
    length: 100,
  })
  gender: string;

  @Column({
    length: 100,
  })
  dateOfBirth: string;

  @ManyToMany((type) => Role, { eager: true })
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({
    nullable: true,
  })
  profile_pic: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  is_private: boolean;

  @OneToMany(() => Friendship, (friendship) => friendship.senderId)
  senderFriend: Friendship[];

  @OneToMany(() => Friendship, (friendship) => friendship.receiverId)
  receiverFriend: Friendship[];

  @OneToMany(() => Post, (post) => post.uploaderId)
  uploadedPost: Post[];

  @OneToMany(() => Comments, (comments) => comments.commenter)
  comments: Comments[]; 
}
