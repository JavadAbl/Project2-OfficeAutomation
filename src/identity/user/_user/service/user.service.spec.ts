import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserCreateRequest } from '../contract/request/user-create.request';
import { UserDto } from '../contract/dto/user.dto';
import { ClassTransformer } from 'class-transformer';
import { DepartmentService } from 'src/identity/department/_department/service/department.service';
import { UserSetDepartmentRoleRequest } from '../contract/request/user-set-department-role.request';

// Mock the static utility methods
//jest.mock('src/common/utils/crypto.utils');
// REMOVE THIS LINE: jest.mock('class-transformer');

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<Repository<User>>;
  let departmentService: jest.Mocked<DepartmentService>;
  let plainToInstanceSpy: jest.SpyInstance; // <-- CHANGE: Add a spy for the function

  const mockUser: User = { id: 1, username: 'testuser', password: 'hashedpassword', departmentId: 1 };
  const mockUserDto: UserDto = { id: 1, username: 'testuser', departmentId: 1 };
  const createUserPayload: UserCreateRequest = { username: 'newuser', password: 'password', departmentId: 1 };
  const setDepartmentPayload: UserSetDepartmentRoleRequest = { departmentId: 2 };

  beforeEach(async () => {
    const mockUserRepository = { findOne: jest.fn(), create: jest.fn(), save: jest.fn(), update: jest.fn() };

    const mockDepartmentService = { checkExistsById: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: DepartmentService, useValue: mockDepartmentService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User)) as jest.Mocked<Repository<User>>;
    departmentService = module.get<DepartmentService>(DepartmentService) as jest.Mocked<DepartmentService>;

    // CHANGE: Create a spy on the 'plainToInstance' method
    plainToInstanceSpy = jest.spyOn(ClassTransformer, 'plainToInstance');

    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully and return a UserDto', async () => {
      // Arrange
      userRepository.findOne.mockResolvedValue(null);
      (CryptoUtils.hashPassword as jest.Mock).mockResolvedValue('hashedpassword');
      departmentService.checkExistsById.mockResolvedValue(undefined);
      userRepository.create.mockReturnValue({ ...createUserPayload, password: 'hashedpassword' });
      userRepository.save.mockResolvedValue(mockUser);
      // CHANGE: Use the spy to mock the return value
      plainToInstanceSpy.mockReturnValue(mockUserDto);

      // Act
      const result = await service.createUser(createUserPayload);

      // Assert
      expect(result).toEqual(mockUserDto);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { username: createUserPayload.username } });
      expect(CryptoUtils.hashPassword).toHaveBeenCalledWith(createUserPayload.password);
      expect(departmentService.checkExistsById).toHaveBeenCalledWith(createUserPayload.departmentId);
      expect(userRepository.create).toHaveBeenCalledWith({ ...createUserPayload, password: 'hashedpassword' });
      expect(userRepository.save).toHaveBeenCalled();
      // CHANGE: Assert on the spy
      expect(plainToInstanceSpy).toHaveBeenCalledWith(UserDto, mockUser);
    });

    it('should throw a ConflictException if the username already exists', async () => {
      // Arrange
      userRepository.findOne.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.createUser(createUserPayload)).rejects.toThrow(ConflictException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { username: createUserPayload.username } });
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should propagate an error if the department does not exist', async () => {
      // Arrange
      userRepository.findOne.mockResolvedValue(null);
      (CryptoUtils.hashPassword as jest.Mock).mockResolvedValue('hashedpassword');
      const notFoundError = new NotFoundException('Department not found');
      departmentService.checkExistsById.mockRejectedValue(notFoundError);

      // Act & Assert
      await expect(service.createUser(createUserPayload)).rejects.toThrow(notFoundError);
      expect(departmentService.checkExistsById).toHaveBeenCalledWith(createUserPayload.departmentId);
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('setDepartment', () => {
    it('should successfully update the user department', async () => {
      // Arrange
      userRepository.findOne.mockResolvedValue(mockUser);
      departmentService.checkExistsById.mockResolvedValue(undefined);
      userRepository.update.mockResolvedValue(undefined);

      // Act
      await service.setDepartment(mockUser.id, setDepartmentPayload);

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: mockUser.id } });
      expect(departmentService.checkExistsById).toHaveBeenCalledWith(setDepartmentPayload.departmentId);
      expect(userRepository.update).toHaveBeenCalledWith(
        { id: mockUser.id },
        { departmentId: setDepartmentPayload.departmentId },
      );
    });

    it('should throw a NotFoundException if the user to update does not exist', async () => {
      // Arrange
      userRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.setDepartment(99, setDepartmentPayload)).rejects.toThrow(NotFoundException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 99 } });
      expect(departmentService.checkExistsById).not.toHaveBeenCalled();
      expect(userRepository.update).not.toHaveBeenCalled();
    });

    it('should propagate an error if the new department does not exist', async () => {
      // Arrange
      userRepository.findOne.mockResolvedValue(mockUser);
      const notFoundError = new NotFoundException('Department not found');
      departmentService.checkExistsById.mockRejectedValue(notFoundError);

      // Act & Assert
      await expect(service.setDepartment(mockUser.id, setDepartmentPayload)).rejects.toThrow(notFoundError);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: mockUser.id } });
      expect(departmentService.checkExistsById).toHaveBeenCalledWith(setDepartmentPayload.departmentId);
      expect(userRepository.update).not.toHaveBeenCalled();
    });
  });
});
