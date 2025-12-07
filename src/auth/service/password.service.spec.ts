import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hash()', () => {
    it('should hash a password successfully', async () => {
      const plainPassword = 'mySecurePassword123!';
      const hashedPassword = await service.hash(plainPassword);

      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword).not.toBe(plainPassword);
      expect(hashedPassword).toMatch(
        /^\$2[abxy]?\$\d{1,2}\$[./A-Za-z0-9]{53}$/,
      );
    });

    it('should generate different hashes for same password', async () => {
      const password = 'identicalPassword';
      const hash1 = await service.hash(password);
      const hash2 = await service.hash(password);

      expect(hash1).not.toBe(hash2);
    });

    it('should use default salt rounds when not specified', async () => {
      const password = 'testPassword';
      const hashed = await service.hash(password);

      // Default bcrypt format: $2a$10$ (where 10 is the salt rounds)
      expect(hashed.substring(4, 6)).toBe('10');
    });

    it('should use custom salt rounds when specified', async () => {
      const password = 'customSaltPassword';
      const customSaltRounds = 12;
      const hashed = await service.hash(password, customSaltRounds);

      expect(hashed.substring(4, 6)).toBe(customSaltRounds.toString());
    });
  });

  describe('compare()', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'validPassword';
      const hashedPassword = await service.hash(password);

      const result = await service.compare(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for non-matching password and hash', async () => {
      const originalPassword = 'original';
      const wrongPassword = 'wrong';
      const hashedPassword = await service.hash(originalPassword);

      const result = await service.compare(wrongPassword, hashedPassword);
      expect(result).toBe(false);
    });

    it('should return false when comparing with invalid hash format', async () => {
      const password = 'test';
      const invalidHash = 'invalid_hash_format';

      const result = await service.compare(password, invalidHash);
      expect(result).toBe(false);
    });

    it('should handle empty passwords correctly', async () => {
      const emptyPassword = '';
      const hashedEmpty = await service.hash(emptyPassword);

      const validCompare = await service.compare(emptyPassword, hashedEmpty);
      const invalidCompare = await service.compare('not_empty', hashedEmpty);

      expect(validCompare).toBe(true);
      expect(invalidCompare).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should reject with error when hashing non-string input', async () => {
      await expect(service.hash(null as any)).rejects.toThrow();
      await expect(service.hash(undefined as any)).rejects.toThrow();
      await expect(service.hash(123 as any)).rejects.toThrow();
    });

    it('should reject with error when comparing non-string inputs', async () => {
      const validHash = await service.hash('password');

      await expect(service.compare(null as any, validHash)).rejects.toThrow();
      await expect(service.compare('password', null as any)).rejects.toThrow();
      await expect(
        service.compare(undefined as any, validHash),
      ).rejects.toThrow();
      await expect(service.compare(123 as any, validHash)).rejects.toThrow();
    });
  });
});
