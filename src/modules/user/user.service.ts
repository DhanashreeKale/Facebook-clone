import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as validateDate from 'validate-date';
import { getStartIndex, PaginationDto } from '../../dto/pager';
import { RequestMeta } from '../../dto/request-meta';
import { Authorization } from '../auth/authorization';
import { BcryptConstants } from '../auth/constants';
import { RoleService } from '../role/role.service';
import { CreateUserDTO, UserDTO, UserResponseDTO } from './user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
    private readonly auth: Authorization,
  ) {}

 
  async createUser(userRequestObject: CreateUserDTO): Promise<UserDTO> {
    if (await this.userRepository.findUserByEmail(userRequestObject.email)) {
      throw new HttpException('email already in use', HttpStatus.CONFLICT);
    }

    if (validateDate(userRequestObject.dateOfBirth) == 'Invalid Date') {
      throw new HttpException(
        'Invalid Date of Birth. Format: mm/dd/yyyy',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const male = 'male';
    const female = 'female';

    if (userRequestObject.gender != male && userRequestObject.gender != female)
      throw new HttpException(
        'Invalid input.Gender should be spelled male/female',
        HttpStatus.BAD_REQUEST,
      );

    let user: User = new User();
    user.firstName = userRequestObject.firstName;
    user.lastName = userRequestObject.lastName;
    user.dateOfBirth = userRequestObject.dateOfBirth;
    user.gender = userRequestObject.gender;
    user.email = userRequestObject.email;

    user.password = await bcrypt.hash(
      userRequestObject.password,
      BcryptConstants.saltRounds,
    );

    const defaultRole = await this.roleService.findByName('USER');
    user.roles = [defaultRole];

    user = await this.userRepository.save(user);

    const userDto: UserDTO = new UserDTO();

    userDto.firstName = user.firstName;
    userDto.lastName = user.lastName;
    userDto.dateOfBirth = user.dateOfBirth;
    userDto.gender = user.gender;
    userDto.email = user.email;
    userDto.id = user.id;
    userDto.profilePic = user.profile_pic;
    userDto.is_private = user.is_private;

    return userDto;
  }

  async getToken(email: string, password: string): Promise<number> {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user || user.password != password) {
      throw new HttpException('not valid creds', HttpStatus.FORBIDDEN);
    }

    return user.id;
  }

  async getUserById(authorization: string): Promise<UserDTO> {
    const userId = parseInt(
      await this.auth.getPayloadIdFromToken(authorization),
    );

    const user: User = await this.userRepository.findOne(userId);
    const userDto: UserDTO = new UserDTO();

    userDto.id = user.id;
    userDto.firstName = user.firstName;
    userDto.lastName = user.lastName;
    userDto.email = user.email;
    userDto.dateOfBirth = user.dateOfBirth;
    userDto.gender = user.gender;
    userDto.profilePic = user.profile_pic;
    userDto.is_private = user.is_private;

    return userDto;
  }

  async getAllUsers(
    paginationDto: PaginationDto,
    requestMeta: RequestMeta,
  ): Promise<UserResponseDTO> {
    const startIndex = getStartIndex(paginationDto.page, paginationDto.limit);
    return this.userRepository.getAllUsers(paginationDto, startIndex);
  }

  findByUserEmail(email: string): Promise<User> {
    return this.userRepository.findUserByEmail(email);
  }
}
