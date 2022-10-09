import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RoleDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class CreateRoleDTO {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
