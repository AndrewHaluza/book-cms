// Uses for adding description to graphql description
export function graphqlDescription(
  message: string,
  options: {
    values?: string[];
    roles?: string[];
  },
): string {
  return `${message};
  ${allowedValues(options.values)}
  ${allowedRoles(options.roles)}`;
}

function allowedValues(list) {
  if (!list?.length) return '';

  return 'Allowed values: ' + makeList(list) + ';';
}

function allowedRoles(list) {
  if (!list?.length) return 'Allowed roles: `all users`;';

  return 'Allowed roles: ' + makeList(list) + ';';
}

function makeList(list) {
  return list.map((v) => `\`${v}\``).join(', ');
}
