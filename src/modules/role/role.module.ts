import { Module } from '@nestjs/common';
import { RoleService } from '../role/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRepository } from '../role/role.repository';
import { RoleController } from './role.controller';

@Module({
  providers: [RoleService],
  imports: [TypeOrmModule.forFeature([RoleRepository])],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
