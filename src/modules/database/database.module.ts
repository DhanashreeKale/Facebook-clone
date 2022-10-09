import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from '../../config/database.config';
import { RoleRepository } from '../role/role.repository';
import { FriendRepository } from '../user/friendship/friendship.repository';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    TypeOrmModule.forFeature([
      UserRepository,
      RoleRepository,
      FriendRepository,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
