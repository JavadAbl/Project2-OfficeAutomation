import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Organization } from 'src/auth/entity/organization.entity';
import { UserRoles } from 'src/auth/entity/user-roles';
import { User } from 'src/auth/entity/user.entity';
import { CryptoUtils } from 'src/common/utils/crypto.utils';
import { EntityManager } from 'typeorm';
import { randomInt } from 'crypto';

@Injectable()
export class SeedService {
  constructor(@InjectEntityManager() private readonly em: EntityManager) {
    this.seed();
  }

  async seed() {
    console.log('seed start');
    await this.seedOrganization();
    await this.seedRoles();
    await this.seedUsers(100);

    console.log('seed end');
  }

  async seedOrganization() {
    if ((await this.em.count(Organization)) !== 0) return;
    const roles = [{ name: 'organ1' }, { name: 'organ2' }, { name: 'organ3' }];
    const rolesEntities = this.em.create(Organization, roles);
    await this.em.save(rolesEntities);
  }

  async seedRoles() {
    if ((await this.em.count(UserRoles)) !== 0) return;
    const roles = [{ role: 'admin' }, { role: 'operator' }, { role: 'reader' }];
    const rolesEntities = this.em.create(UserRoles, roles);
    await this.em.save(rolesEntities);
  }

  async seedUsers(count: number) {
    // Skip seeding if any users already exist
    if ((await this.em.count(User)) !== 0) return;

    const users: User[] = [];

    const orgNames = ['organ1', 'organ2', 'organ3'];
    const roleNames = ['admin', 'operator', 'reader'];

    for (let i = 1; i <= count; i++) {
      // Random organization
      const orgName = orgNames[randomInt(orgNames.length)];
      const organ = await this.em.findOneBy(Organization, { name: orgName });
      if (!organ) continue; // safety

      // Random role
      const roleName = roleNames[randomInt(roleNames.length)];
      const role = await this.em.findOneBy(UserRoles, { role: roleName });
      if (!role) continue; // safety

      const user = new User();
      user.username = `user${i}`;
      user.organization = organ;
      user.role = role;
      user.passwordHash = await CryptoUtils.hashPassword('123');

      users.push(user);
    }

    await this.em.save(users);
  }

  /*  async seedUsers() {
    if ((await this.em.count(User)) !== 0) return;
    const users: User[] = [];

    const organ = await this.em.findOneBy(Organization, { name: 'organ1' });
    const role = await this.em.findOneBy(UserRoles, { role: 'admin' });
    const user1 = new User();
    user1.username = 'user1';
    user1.organization = organ!;
    user1.role = role!;
    user1.passwordHash = await CryptoUtils.hashPassword('123');

    const organ2 = await this.em.findOneBy(Organization, { name: 'organ1' });
    const role2 = await this.em.findOneBy(UserRoles, { role: 'user' });
    const user2 = new User();
    user2.username = 'user2';
    user2.organization = organ2!;
    user2.role = role2!;
    user2.passwordHash = await CryptoUtils.hashPassword('123');

    const organ3 = await this.em.findOneBy(Organization, { name: 'organ2' });
    const role3 = await this.em.findOneBy(UserRoles, { role: 'reader' });
    const user3 = new User();
    user3.username = 'user3';
    user3.organization = organ3!;
    user3.role = role3!;
    user3.passwordHash = await CryptoUtils.hashPassword('123');

    users.push(user1);
    users.push(user2);
    users.push(user3);
    await this.em.save(users);
  } */
}
