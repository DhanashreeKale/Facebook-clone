import { HttpStatus, Injectable } from '@nestjs/common';
import { SeedException } from '../../exception/seed.exception';
import { CreateRoleDTO, RoleDTO } from './role.dto';
import { Role } from './role.entity';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async findAllRoles(): Promise<Role[]> {
    const roles = await this.roleRepository.find();

    const roleDtos: RoleDTO[] = [];

    roles.forEach((role) => {
      const roleDto = new RoleDTO();
      roleDto.id = role.id;
      roleDto.name = role.name;
      roleDtos.push(roleDto);
    });

    return roleDtos;
  }

  findByName(roleName: string): Promise<Role> {
    return this.roleRepository.findOne({ name: roleName });
  }

  async createRole(roleRequestObject: CreateRoleDTO): Promise<RoleDTO> {
    if (await this.roleRepository.findByName(roleRequestObject.name)) {
      throw new SeedException('Role already exists', HttpStatus.CONFLICT);
    }

    let role = new Role();
    role.name = roleRequestObject.name;
    role = await this.roleRepository.save(role);

    const roleDto = new RoleDTO();
    roleDto.id = role.id;
    roleDto.name = role.name;
    return roleDto;
  }
}
