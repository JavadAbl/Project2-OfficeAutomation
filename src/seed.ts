import { DataSource } from 'typeorm';
import { Department } from './identity/department/entity/department.entity';
import { DepartmentRole } from './identity/department/entity/department-role.entity';
import { User } from './identity/user/entity/user.entity';
import { BCryptProvider } from './auth/providers/bcrypt.provider';
import { AuthRole } from './auth/enum/auth-role.enum';
import { Workflow } from './workflow/entity/workflow.entity';
import { Recipient } from './letter/recipient/entity/recipient.entity';
import { Letter } from './letter/entity/letter.entity';
import { Template } from './letter/template/entity/template.entity';
import { Attachment } from './letter/entity/attachment.entity';
import { LetterApproval } from './letter/entity/letter-approval.entity';

// 1. Configure your database connection
// IMPORTANT: Replace these values with your actual database credentials.
const AppDataSource = new DataSource({
  type: 'better-sqlite3', // or 'mysql', 'sqlite', etc.

  database: 'app.db',
  // Make sure to list all your entities here
  entities: [
    Department,
    DepartmentRole,
    User,
    Letter,
    Recipient,
    Workflow,
    Template,
    Attachment,
    LetterApproval,
  ],
  synchronize: true, // Keep this false for seeding scripts
  logging: true,
});

// 2. The main seeder function
const runSeeder = async () => {
  // Initialize the data source
  await AppDataSource.initialize();
  console.log('Data Source has been initialized for seeding!');

  // Get repositories
  const departmentRepository = AppDataSource.getRepository(Department);
  const departmentRoleRepository = AppDataSource.getRepository(DepartmentRole);
  const userRepository = AppDataSource.getRepository(User);

  // Instantiate the password hashing provider
  const hashingProvider = new BCryptProvider();

  // --- Seeding Logic ---

  // Step 1: Create the "Central" Department
  let centralDepartment = await departmentRepository.findOne({ where: { name: 'Central' } });
  if (!centralDepartment) {
    centralDepartment = departmentRepository.create({ name: 'Central' });
    await departmentRepository.save(centralDepartment);
    console.log('✅ Department "Central" created.');
  } else {
    console.log('ℹ️ Department "Central" already exists.');
  }

  // Step 2: Create the "admin" DepartmentRole
  // It depends on the "Central" department, so we run this after it.
  let adminDepartmentRole = await departmentRoleRepository.findOne({
    where: { name: 'admin', departmentId: centralDepartment.id },
  });
  if (!adminDepartmentRole) {
    adminDepartmentRole = departmentRoleRepository.create({
      name: 'admin',
      authRole: AuthRole.Admin,
      departmentId: centralDepartment.id, // Link to the created/found department
    });
    await departmentRoleRepository.save(adminDepartmentRole);
    console.log('✅ DepartmentRole "admin" created.');
  } else {
    console.log('ℹ️ DepartmentRole "admin" already exists.');
  }

  // Step 3: Create the "admin" User
  // It depends on the "admin" department role, so we run this last.
  let adminUser = await userRepository.findOne({ where: { username: 'admin' } });
  if (!adminUser) {
    const defaultPassword = '123'; // You should change this after the first login
    const hashedPassword = await hashingProvider.hashPassword(defaultPassword);

    adminUser = userRepository.create({
      username: 'admin',
      password: hashedPassword,
      departmentRoleId: adminDepartmentRole.id, // Link to the created/found role
    });
    await userRepository.save(adminUser);
    console.log(`✅ User "admin" created with default password: "${defaultPassword}"`);
  } else {
    console.log('ℹ️ User "admin" already exists.');
  }
};

// 3. Execute the seeder and handle connection
runSeeder()
  .then(async () => {
    console.log('🌱 Seeding finished successfully.');
    await AppDataSource.destroy();
  })
  .catch(async (error) => {
    console.error('❌ Error during seeding:', error);
    await AppDataSource.destroy();
    process.exit(1);
  });
