import { EntityRepository, Repository } from 'typeorm';
import { Pager, PaginationDto } from '../../dto/pager';
import { UserDTO, UserResponseDTO } from './user.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findByName(clientName: string): Promise<User> {
    return this.findOne({ where: { clientName } });
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .where('email = :email', { email })
      .getOne();
  }

  async findProfilePic(id: number) {
    const user = await this.createQueryBuilder('user')
      .where('user.id=:userId', { userId: id })
      .getOne();
    return user;
  }

  async getAllUsers(
    pagination: PaginationDto,
    startIndex: number,
  ): Promise<UserResponseDTO> {
    const totalCount = await this.count();
    const users = await this.createQueryBuilder('user')
      .orderBy('user.id', 'ASC')
      .limit(pagination.limit)
      .offset(startIndex)
      .getMany();

    const usersDTORes: UserDTO[] = [];
    for (const item of users) {
      const user = new UserDTO();
      user.id = item.id;
      user.firstName = item.firstName;
      user.lastName = item.lastName;
      user.email = item.email;
      user.dateOfBirth = item.dateOfBirth;
      user.gender = item.gender;
      user.profilePic = item.profile_pic;
      user.is_private = item.is_private;
      usersDTORes.push(user);
    }
    const pager = new Pager(
      totalCount,
      Number(pagination.page),
      Number(pagination.limit),
      startIndex,
    );
    const userResWithPagination: UserResponseDTO = new UserResponseDTO();
    userResWithPagination.users = usersDTORes;
    userResWithPagination.pager = pager;

    return userResWithPagination;
  }

  async getUserByPayloadId(id: number): Promise<User> {
    return this.findOne({ where: { id } });
  }
}
