const allRoles = {
  user: ['getTasks'],
  admin: ['getUsers', 'manageUsers'],
};

export const applicationRoles = Object.keys(allRoles);
//['user', 'admin]
export const rolePermissions = new Map(Object.entries(allRoles));



// roleRights: Map(2) {
//   'user' => [ 'getTasks' ],
//   'admin' => [ 'getUsers', 'manageUsers' ]
// }


