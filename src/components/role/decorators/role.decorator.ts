import { Reflector } from '@nestjs/core';
import { RoleType } from '../constants/roles';

export const Roles = Reflector.createDecorator<RoleType[]>();
