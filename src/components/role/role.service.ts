import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ROLES, RoleType } from './constants/roles';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    await this.initializeRoles();
  }

  matchRoles(roles: RoleType[], userRole: RoleType): boolean {
    return roles.includes(userRole);
  }

  getDefaultRole() {
    const defaultRole = this.roleRepository.findOneBy({ name: ROLES.user });

    return defaultRole;
  }

  async initializeRoles() {
    const asyncTasks = Object.values(ROLES).map(async (roleName: RoleType) => {
      return this.#createRoleIfNotExists(roleName);
    });

    await Promise.all(asyncTasks);
  }

  #createRoleIfNotExists = async (roleName: RoleType) => {
    const roleExists = await this.roleRepository.findOneBy({ name: roleName });

    if (!roleExists) {
      await this.roleRepository.save({
        name: roleName,
      });
    }
  };
}
