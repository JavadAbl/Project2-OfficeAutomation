import { validate } from 'class-validator';
import { DepartmentCreateRequest } from './department-create.request'; // Adjust import path as needed

describe('DepartmentCreateRequest', () => {
  describe('Validation', () => {
    it('should validate a valid request', async () => {
      const request = new DepartmentCreateRequest();
      request.name = 'Engineering';

      const errors = await validate(request);
      expect(errors.length).toBe(0);
    });

    it('should validate with a single character name', async () => {
      const request = new DepartmentCreateRequest();
      request.name = 'A';

      const errors = await validate(request);
      expect(errors.length).toBe(0);
    });

    it('should validate with a long name', async () => {
      const request = new DepartmentCreateRequest();
      request.name = 'Very Long Department Name That Exceeds Normal Limits';

      const errors = await validate(request);
      expect(errors.length).toBe(0);
    });

    it('should validate with special characters in name', async () => {
      const request = new DepartmentCreateRequest();
      request.name = 'R&D Department';

      const errors = await validate(request);
      expect(errors.length).toBe(0);
    });

    it('should validate with numbers in name', async () => {
      const request = new DepartmentCreateRequest();
      request.name = 'Department 123';

      const errors = await validate(request);
      expect(errors.length).toBe(0);
    });

    it('should fail when name is empty string', async () => {
      const request = new DepartmentCreateRequest();
      request.name = '';

      const errors = await validate(request);
      expect(errors.length).toBeGreaterThan(0);

      const nameError = errors.find((error) => error.property === 'name');
      expect(nameError).toBeDefined();
      expect(nameError!.constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail when name is only whitespace', async () => {
      const request = new DepartmentCreateRequest();
      request.name = '   ';

      const errors = await validate(request);
      expect(errors.length).toBeGreaterThan(0);

      const nameError = errors.find((error) => error.property === 'name');
      expect(nameError).toBeDefined();
      expect(nameError!.constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail when name is null', async () => {
      const request = new DepartmentCreateRequest();
      // @ts-ignore - intentionally testing invalid type
      request.name = null;

      const errors = await validate(request);
      expect(errors.length).toBeGreaterThan(0);

      const nameError = errors.find((error) => error.property === 'name');
      expect(nameError).toBeDefined();
      expect(nameError!.constraints).toHaveProperty('isString');
      expect(nameError!.constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail when name is undefined', async () => {
      const request = new DepartmentCreateRequest();
      // @ts-ignore - intentionally testing invalid type
      request.name = undefined;

      const errors = await validate(request);
      expect(errors.length).toBeGreaterThan(0);

      const nameError = errors.find((error) => error.property === 'name');
      expect(nameError).toBeDefined();
      expect(nameError!.constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail when name is not a string (number)', async () => {
      const request = new DepartmentCreateRequest();
      // @ts-ignore - intentionally testing invalid type
      request.name = 123;

      const errors = await validate(request);
      expect(errors.length).toBeGreaterThan(0);

      const nameError = errors.find((error) => error.property === 'name');
      expect(nameError).toBeDefined();
      expect(nameError!.constraints).toHaveProperty('isString');
    });

    it('should fail when name is not a string (boolean)', async () => {
      const request = new DepartmentCreateRequest();
      // @ts-ignore - intentionally testing invalid type
      request.name = true;

      const errors = await validate(request);
      expect(errors.length).toBeGreaterThan(0);

      const nameError = errors.find((error) => error.property === 'name');
      expect(nameError).toBeDefined();
      expect(nameError!.constraints).toHaveProperty('isString');
    });

    it('should fail when name is not a string (object)', async () => {
      const request = new DepartmentCreateRequest();
      // @ts-ignore - intentionally testing invalid type
      request.name = { department: 'Engineering' };

      const errors = await validate(request);
      expect(errors.length).toBeGreaterThan(0);

      const nameError = errors.find((error) => error.property === 'name');
      expect(nameError).toBeDefined();
      expect(nameError!.constraints).toHaveProperty('isString');
    });

    it('should fail when name is not a string (array)', async () => {
      const request = new DepartmentCreateRequest();
      // @ts-ignore - intentionally testing invalid type
      request.name = ['Engineering'];

      const errors = await validate(request);
      expect(errors.length).toBeGreaterThan(0);

      const nameError = errors.find((error) => error.property === 'name');
      expect(nameError).toBeDefined();
      expect(nameError!.constraints).toHaveProperty('isString');
    });
  });

  describe('Property Assignment', () => {
    it('should correctly assign name property', () => {
      const request = new DepartmentCreateRequest();
      request.name = 'Human Resources';

      expect(request.name).toBe('Human Resources');
    });

    it('should handle name with leading/trailing spaces', () => {
      const request = new DepartmentCreateRequest();
      request.name = '  Finance  ';

      expect(request.name).toBe('  Finance  ');
    });

    it('should handle unicode characters in name', () => {
      const request = new DepartmentCreateRequest();
      request.name = 'IT Départment 🚀';

      expect(request.name).toBe('IT Départment 🚀');
    });
  });

  describe('Validation Error Messages', () => {
    it('should provide appropriate error message for empty name', async () => {
      const request = new DepartmentCreateRequest();
      request.name = '';

      const errors = await validate(request);
      const nameError = errors.find((error) => error.property === 'name');

      expect(nameError!.constraints!.isNotEmpty).toBeDefined();
      expect(typeof nameError!.constraints!.isNotEmpty).toBe('string');
    });

    it('should provide appropriate error message for non-string name', async () => {
      const request = new DepartmentCreateRequest();
      // @ts-ignore - intentionally testing invalid type
      request.name = 123;

      const errors = await validate(request);
      const nameError = errors.find((error) => error.property === 'name');

      expect(nameError!.constraints!.isString).toBeDefined();
      expect(typeof nameError!.constraints!.isString).toBe('string');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long string names', async () => {
      const request = new DepartmentCreateRequest();
      request.name = 'A'.repeat(1000); // Very long string

      const errors = await validate(request);
      expect(errors.length).toBe(0);
    });

    it('should handle string with only special characters', async () => {
      const request = new DepartmentCreateRequest();
      request.name = '!@#$%^&*()';

      const errors = await validate(request);
      expect(errors.length).toBe(0);
    });

    it('should handle string with emojis', async () => {
      const request = new DepartmentCreateRequest();
      request.name = '🚀 Tech Department 💻';

      const errors = await validate(request);
      expect(errors.length).toBe(0);
    });
  });
});
