import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { AccountAggregate } from '@/domain/aggregate-root';
import { Ok, Err } from '@/libs/result';
import CreateAccountService, {
  CreateAccountInput,
} from './account-creation.service';
import GetAccountService from './account-get.service';

const userInput: CreateAccountInput = {
  name: 'test',
  email: '1@mail.com',
  password: '12345678',
};

describe('GetAccountService', () => {
  let getAccountService: GetAccountService;
  let createAccountService: CreateAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    getAccountService = module.get<GetAccountService>(GetAccountService);
    createAccountService =
      module.get<CreateAccountService>(CreateAccountService);
    await createAccountService.execute(userInput);
  });

  describe('execute method', () => {
    it('should retrieve account successfully with correct credentials', async () => {
      const { email, password } = userInput;
      const result = await getAccountService.execute({ email, password });
      expect(result).toBeInstanceOf(Ok);
      expect(result.getValue()).toBeInstanceOf(AccountAggregate);
    });

    it('should return UnauthorizedException for incorrect password', async () => {
      const result = await getAccountService.execute({
        email: userInput.email,
        password: '123456789',
      });

      expect(result).toBeInstanceOf(Err);
      expect(result.getError()).toBeInstanceOf(UnauthorizedException);
    });

    it('should return UnauthorizedException for non-existent email', async () => {
      const result = await getAccountService.execute({
        email: '2@mail.com',
        password: '12345678',
      });
      expect(result).toBeInstanceOf(Err);
      expect(result.getError()).toBeInstanceOf(UnauthorizedException);
    });
  });
});
