import { registerEnumType } from '@nestjs/graphql';

export enum action {
  //user actions
  create_user = 'create_user',
  update_user = 'update_user',
  delete_user = 'delete_user',
  view_user = 'view_user',
  //flight actions
  create_flight = 'create_flight',
  update_flight = 'update_flight',
  delete_flight = 'delete_flight',
  view_flight = 'view_flight',
  // staff actions
  create_staff = 'create_staff',
  update_staff = 'update_staff',
  delete_staff = 'delete_staff',
  view_staff = 'view_staff',

  view = 'view',
  create = 'create',
  update = 'update',
  delete = 'delete',
  //////


  can_assigned_to_flight = 'can_assigned_to_flight',


  super_admin = 'super_admin',

  
}

registerEnumType(action, {
  name: 'PermissionsAction',
  description: 'The action of the permission',
});
