import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ email });
  }

  async findOneWithRole(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
      relations: ['role'],
    });
  }

  async create(user: Omit<User, 'id'>): Promise<any> {
    const createdUser = await this.userRepository.save(user);

    const returnUser = { ...createdUser };

    delete returnUser.password;

    return returnUser;
  }
}
