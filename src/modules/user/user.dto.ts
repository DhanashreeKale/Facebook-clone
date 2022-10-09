import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Pager } from '../../dto/pager';

export class CreateUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @IsEmail(
    {},
    {
      message: 'invalid email',
    },
  )
  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  dateOfBirth: string;

  @ApiProperty()
  @IsNotEmpty()
  gender: string;
}

export class UserDTO {
  @ApiResponseProperty()
  firstName: string;

  @ApiResponseProperty()
  lastName: string;
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  gender: string;

  @ApiResponseProperty()
  dateOfBirth: string;
  @ApiResponseProperty()
  profilePic: string;
  @ApiResponseProperty()
  is_private: boolean;
}

export class UserResponseDTO {
  @ApiResponseProperty()
  users: UserDTO[];

  @ApiResponseProperty()
  pager: Pager;
}
