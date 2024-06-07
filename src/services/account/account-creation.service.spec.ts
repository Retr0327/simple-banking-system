import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { AccountAggregate } from '@/domain/aggregate-root';
import { Ok } from '@/libs/result';
import CreateAccountService from './account-creation.service';

describe('CreateAccountService ', () => {
  let createAccountService: CreateAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    createAccountService =
      module.get<CreateAccountService>(CreateAccountService);
  });

  describe('execute method', () => {
    it('should create account successfully with correct credentials', async () => {
      const result = await createAccountService.execute({
        name: 'test',
        email: '1@mail.com',
        password: '12345678',
      });

      expect(result).toBeInstanceOf(Ok);
      expect(result.getValue()).toBeInstanceOf(AccountAggregate);
    });
  });
});
