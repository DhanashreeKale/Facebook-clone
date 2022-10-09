import { EntityRepository, Repository } from 'typeorm';
import { Role } from './role.entity';

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
  findAllRoles(): Promise<Role[]> {
    return this.find();
  }

  findByName(roleName: string): Promise<Role> {
    return this.findOne({ name: roleName });
  }
}
