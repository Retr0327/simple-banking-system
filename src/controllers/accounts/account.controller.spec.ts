import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AppModule } from '@/app.module';
import AccountController from './account.controller';

describe('AccountController', () => {
  let accountController: AccountController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    accountController = moduleRef.get<AccountController>(AccountController);
  });

  describe('create', () => {
    it('should create an account successfully', async () => {
      const response = await accountController.create({
        name: 'test',
        email: '1@mail.com',
        password: '12345678',
        balance: 100,
      });

      expect(response.status).toBe('success');
      expect(response.data).toMatchObject({
        id: expect.any(String),
        name: 'test',
        email: '1@mail.com',
        balance: 100,
      });
      expect(response.data.balance).toBe(100);
    });
  });

  describe('get', () => {
    beforeEach(async () => {
      await accountController.create({
        name: 'test',
        email: '1@mail.com',
        password: '12345678',
        balance: 100,
      });
    });

    it('should retrieve the account successfully', async () => {
      const response = await accountController.get({
        email: '1@mail.com',
        password: '12345678',
      });

      expect(response.status).toBe('success');
      expect(response.data).toMatchObject({
        id: expect.any(String),
        name: 'test',
        email: '1@mail.com',
        balance: 100,
      });
    });

    it('should return 401 for incorrect password', async () => {
      try {
        await accountController.get({
          email: '1@mail.com',
          password: '123456789',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('should return 401 for non-existent email', async () => {
      try {
        await accountController.get({
          email: '2@mail.com',
          password: '12345678',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
