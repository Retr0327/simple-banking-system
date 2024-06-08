import { Test } from '@nestjs/testing';
import TransactionController from './transaction.controller';
import { CreateAccountService, GetAccountService } from '@/services';
import { AppModule } from '@/app.module';
import { UnauthorizedException } from '@nestjs/common';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let createAccountService: CreateAccountService;
  let getAccountService: GetAccountService;
  let accountId: string;
  let targetAccountId: string;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    createAccountService =
      moduleRef.get<CreateAccountService>(CreateAccountService);
    getAccountService = moduleRef.get<GetAccountService>(GetAccountService);
    transactionController = moduleRef.get<TransactionController>(
      TransactionController,
    );

    const [accountResult, targetAccountResult] = await Promise.all([
      createAccountService.execute({
        name: 'test',
        email: '1@mail.com',
        password: '12345678',
        balance: 200,
      }),
      createAccountService.execute({
        name: 'test2',
        email: '2@mail.com',
        password: '12345678',
        balance: 100,
      }),
    ]);

    accountId = accountResult.getValue()!.id;
    targetAccountId = targetAccountResult.getValue()!.id;
  });

  describe('deposit', () => {
    it('should successfully deposit funds into the account', async () => {
      const response = await transactionController.deposit({
        account: accountId,
        password: '12345678',
        amount: 100,
      });

      const accountResult = await getAccountService.execute({
        id: accountId,
        password: '12345678',
      });

      expect(response.status).toBe('success');
      expect(accountResult.getValue()!.balance.getValue()).toBe(300);
    });
  });

  describe('withdrawal', () => {
    it('should successfully withdraw funds from the account', async () => {
      const response = await transactionController.withdraw({
        account: accountId,
        password: '12345678',
        amount: 100,
      });

      const accountResult = await getAccountService.execute({
        id: accountId,
        password: '12345678',
      });

      expect(response.status).toBe('success');
      expect(accountResult.getValue()!.balance.getValue()).toBe(100);
    });

    it('should fail to withdraw funds due to insufficient balance', async () => {
      try {
        await transactionController.withdraw({
          account: accountId,
          password: '12345678',
          amount: 400,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('transfer', () => {
    it('should successfully transfer funds between accounts', async () => {
      const response = await transactionController.transfer({
        account: accountId,
        targetAccount: targetAccountId,
        password: '12345678',
        amount: 100,
      });

      const [accountResult, targetAccountResult] = await Promise.all([
        getAccountService.execute({
          id: accountId,
          password: '12345678',
        }),
        getAccountService.execute({
          id: targetAccountId,
          password: '12345678',
        }),
      ]);

      expect(response.status).toBe('success');
      expect(accountResult.getValue()!.balance.getValue()).toBe(100);
      expect(targetAccountResult.getValue()!.balance.getValue()).toBe(200);
    });

    it('should fail to transfer funds due to insufficient balance', async () => {
      try {
        await transactionController.transfer({
          account: accountId,
          targetAccount: targetAccountId,
          password: '12345678',
          amount: 400,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
