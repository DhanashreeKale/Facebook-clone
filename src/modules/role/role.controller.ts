import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoleDTO, RoleDTO } from './role.dto';
import { RoleService } from './role.service';

@Controller('roles')
@ApiTags('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: RoleDTO,
    description: 'Returns RoleDTO',
  })
  createRole(@Body() createRoleDto: CreateRoleDTO): Promise<RoleDTO> {
    return this.roleService.createRole(createRoleDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: RoleDTO,
    isArray: true,
    description:
      'Returns RoleDTO. An empty list in case of no record available',
  })
  getAllRoles(): Promise<RoleDTO[]> {
    return this.roleService.findAllRoles();
  }
}
