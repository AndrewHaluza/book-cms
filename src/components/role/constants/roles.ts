export const ROLES = {
  user: 'user',
  moderator: 'moderator',
  admin: 'admin',
} as const;

export type RoleType = keyof typeof ROLES;
