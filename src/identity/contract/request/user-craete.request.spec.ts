import { validate } from 'class-validator';
import { UserCreateRequest } from './user-create.request'; // Adjust import path as needed

describe('UserCreateRequest', () => {
  describe('Validation', () => {
    it('should validate a valid request', async () => {
      const request = new UserCreateRequest();
      request.username = 'john_doe';
      request.password = 'securepassword123';
      request.departmentId = 1;

      const errors = await validate(request);
      expect(errors.length).toBe(0);
    });

    it('should validate a valid request without optional departmentId', async () => {
      const request = new UserCreateRequest();
      request.username = 'jane_doe';
      request.password = 'anotherpassword123';

      const errors = await validate(request);
      expect(errors.length).toBe(0);
    });

    it('should fail when username is too short', async () => {
      const request = new UserCreateRequest();
      request.username = 'jo'; 
      request.password = 'securepassword123';

      const errors = await validate(request);
      expect(errors.length).toBeGreaterThan(0);

      const usernameError = errors.find(
        (error) => error.property === 'username',
      );
      expect(usernameError).toBeDefined();
      expect(usernameError!.constraints).toHaveProperty('minLength');
    });

    it('should fail when username is empty', async () => {
      const request = new UserCreateRequest();
      request.username = '';
      request.password = 'securepassword123';

      const errors = await validate(request);
      expect(errors.length).toBeGreaterThan(0);

      const usernameError = errors.find(
        (error) => error.property === 'username',
      );
      expect(usernameError).toBeDefined();
      expect(usernameError!.constraints).toHaveProperty('isString');
    });

    it('should fail when username is not a string', async () => {
      const request = new UserCreateRequest();
      // @ts-expect-error - intentionally testing invalid type
      request.username = 123;
      request.password = 'securepassword123';

      const errors = await validate(request);
      expect(errors.length).toBeGreaterThan(0);

      const usernameError = errors.find(
        (error) => error.property === 'username',
      );
      expect(usernameError).toBeDefined();
      expect(usernameError!.constraints).toHaveProperty('isString');
    });

    it('should fail when password is too short', async () => {
      const request = new UserCreateRequest();
      request.username = 'john_doe';
      request.password = 'ab'; // Too short - min 3 characters

      const errors = await validate(request);
      expect(errors.length).toBeGreaterThan(0);

      const passwordError = errors.find(
        (error) => error.property === 'password',
      );
      expect(passwordError).toBeDefined();
      expect(passwordError!.constraints).toHaveProperty('minLength');
    });

    it('should fail when password is empty', async () => {
      const request = new UserCreateRequest();
      request.username = 'john_doe';
      request.password = '';

      const errors = await validate(request);
      expect(errors.length).toBeGreaterThan(0);

      const passwordError = errors.find(
        (error) => error.property === 'password',
      );
      expect(passwordError).toBeDefined();
    //  expect(passwordError!.constraints).toHaveProperty('isString');
    });

    it('should fail when password is not a string', async () => {
      const request = new UserCreateRequest();
      request.username = 'john_doe';
      // @ts-expect-error - intentionally testing invalid type
      request.password = 123456;

      const errors = await validate(request);
      expect(errors.length).toBeGreaterThan(0);

      const passwordError = errors.find(
        (error) => error.property === 'password',
      );
      expect(passwordError).toBeDefined();
      expect(passwordError!.constraints).toHaveProperty('isString');
    });

    it('should fail when departmentId is not an integer', async () => {
      const request = new UserCreateRequest();
      request.username = 'john_doe';
      request.password = 'securepassword123';
      // @ts-expect-error - intentionally testing invalid type
      request.departmentId = 'not_a_number';

      const errors = await validate(request);
      expect(errors.length).toBeGreaterThan(0);

      const departmentIdError = errors.find(
        (error) => error.property === 'departmentId',
      );
      expect(departmentIdError).toBeDefined();
      expect(departmentIdError!.constraints).toHaveProperty('isInt');
    });

    it('should fail when departmentId is a float', async () => {
      const request = new UserCreateRequest();
      request.username = 'john_doe';
      request.password = 'securepassword123';
   
      request.departmentId = 1.5;

      const errors = await validate(request);
      expect(errors.length).toBeGreaterThan(0);

      const departmentIdError = errors.find(
        (error) => error.property === 'departmentId',
      );
      expect(departmentIdError).toBeDefined();
      expect(departmentIdError!.constraints).toHaveProperty('isInt');
    });

    it('should pass when departmentId is zero', async () => {
      const request = new UserCreateRequest();
      request.username = 'john_doe';
      request.password = 'securepassword123';
      request.departmentId = 0;

      const errors = await validate(request);
      expect(errors.length).toBe(0);
    });

    it('should pass when departmentId is negative', async () => {
      const request = new UserCreateRequest();
      request.username = 'john_doe';
      request.password = 'securepassword123';
      request.departmentId = -1;

      const errors = await validate(request);
      expect(errors.length).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum valid length for username and password', async () => {
      const request = new UserCreateRequest();
      request.username = 'abc'; // Exactly 3 characters
      request.password = 'def'; // Exactly 3 characters

      const errors = await validate(request);
      expect(errors.length).toBe(0);
    });

    it('should handle very long valid username and password', async () => {
      const request = new UserCreateRequest();
      request.username = 'a'.repeat(100); // Long but valid
      request.password = 'b'.repeat(100); // Long but valid

      const errors = await validate(request);
      expect(errors.length).toBe(0);
    });
  });

  describe('Property Assignment', () => {
    it('should correctly assign all properties', () => {
      const request = new UserCreateRequest();
      request.username = 'test_user';
      request.password = 'test_password';
      request.departmentId = 42;

      expect(request.username).toBe('test_user');
      expect(request.password).toBe('test_password');
      expect(request.departmentId).toBe(42);
    });

    it('should handle undefined departmentId', () => {
      const request = new UserCreateRequest();
      request.username = 'test_user';
      request.password = 'test_password';
      request.departmentId = undefined;

      expect(request.username).toBe('test_user');
      expect(request.password).toBe('test_password');
      expect(request.departmentId).toBeUndefined();
    });
  });
});
