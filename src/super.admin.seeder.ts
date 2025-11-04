import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRoles } from '@core/enums/user.roles';
import { action } from '@core/enums/permissions.action';
import { Role } from 'role/entities/role.entity';
import { Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { hashSync } from 'bcrypt';

@Injectable()
export class CreateSuperAdminSeeder implements OnModuleInit {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    let superAdminRole = await this.roleRepository.findOne({
      where: { name: UsersRoles.super_admin },
    });

    if (!superAdminRole) {
      const allPermissions = Object.values(action);
      superAdminRole = this.roleRepository.create({
        name: UsersRoles.super_admin,
        permissions: allPermissions,
      });
      await this.roleRepository.save(superAdminRole);
      console.log('Super admin role created with all permissions');
    }

    const adminUser = await this.userRepository.findOne({
      where: { email: 'super-admin@example.com' },
    });

    if (!adminUser) {
      const hashedPassword = hashSync('SuperAdmin123!', 10);
      const token = 'initial-token';
      const newUser = this.userRepository.create({
        email: 'super-admin@app.com',
        name: 'Super Admin',
        password: hashedPassword,
        role: superAdminRole,
        token: token,
      });
      await this.userRepository.save(newUser);
      console.log('Super admin user created');
    }
  }
}
