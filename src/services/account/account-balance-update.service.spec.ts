import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { Ok } from '@/libs/result';
import UpdateAccountBalanceService from './account-balance-update.service';
import CreateAccountService from './account-creation.service';
import GetAccountService from './account-get.service';

describe('UpdateAccountBalanceService', () => {
  let accountId: string;
  let createAccountService: CreateAccountService;
  let updateAccountBalanceService: UpdateAccountBalanceService;
  let getAccountService: GetAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    updateAccountBalanceService = module.get<UpdateAccountBalanceService>(
      UpdateAccountBalanceService,
    );
    getAccountService = module.get<GetAccountService>(GetAccountService);
    createAccountService =
      module.get<CreateAccountService>(CreateAccountService);
    const accountResult = await createAccountService.execute({
      name: 'test',
      email: '1@mail.com',
      password: '12345678',
    });
    accountId = accountResult.getValue()!.id;
  });

  describe('execute method', () => {
    it('should update account balance successfully', async () => {
      const updatedResult = await updateAccountBalanceService.execute({
        id: accountId,
        balance: 100,
      });
      const accountResult = await getAccountService.execute({
        email: '1@mail.com',
        password: '12345678',
      });
      expect(updatedResult).toBeInstanceOf(Ok);
      expect(accountResult.getValue()!.balance.getValue()).toBe(100);
    });
  });
});
