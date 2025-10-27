// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { UsersRoles } from 'enums/user.roles';
// import { Role } from 'role/entities/role.entity';
// import { Repository } from 'typeorm';
// import { User } from 'users/entities/user.entity';

// @Injectable()
// export class CreateSuperAdminSeeder {
//   constructor(
//     @InjectRepository(User) private userRepository: Repository<User>,
//     @InjectRepository(Role) private roleRepository: Repository<Role>,
//   ) {}

//   async seed() {
//     const superAdminRole = await this.roleRepository.findOne({
//       where: { name: UsersRoles.super_admin },
//     });
//     const adminUser = await this.userRepository.findOne({
//       where: { email: 'super-admin@example.com' },
//     });

//     if (!adminUser) {
//       const newUser = this.userRepository.create({
//         email: 'super-admin@example.com',
//         password: 'hashed-password', // Use a secure hashing method
//       });
//       const savedUser = await this.userRepository.save(newUser);

//       const userRoles = new UsersRoles();
//       userRoles.user = savedUser;
//       userRoles.role = superAdminRole;

//       await this.userRepository.manager.save(userRoles);
//     }
//   }
// }
