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

  async create(user: User): Promise<any> {
    const createdUser = await this.userRepository.save(user);

    const returnUser = { ...createdUser };

    delete returnUser.password;

    return returnUser;
  }
}
