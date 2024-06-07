import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { AccountAggregate } from '@/domain/aggregate-root';
import { Err, Ok } from '@/libs/result';
import CreateAccountService, {
  CreateAccountInput,
} from '../account/account-creation.service';
import TransferService from './transaction-transfer.service';

const accountInput: CreateAccountInput = {
  name: 'test',
  email: '1@mail.com',
  password: '12345678',
  balance: 300,
};

const targetAccountInput: CreateAccountInput = {
  name: 'test2',
  email: '2@mail.com',
  password: '12345678',
};

describe('TransferService', () => {
  let createAccountService: CreateAccountService;
  let transferService: TransferService;
  let accountEntity: AccountAggregate;
  let targetAccountEntity: AccountAggregate;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    transferService = module.get<TransferService>(TransferService);
    createAccountService =
      module.get<CreateAccountService>(CreateAccountService);
    const [accountResult, targetAccountResult] = await Promise.all([
      createAccountService.execute(accountInput),
      createAccountService.execute(targetAccountInput),
    ]);
    accountEntity = accountResult.getValue()!;
    targetAccountEntity = targetAccountResult.getValue()!;
  });

  describe('execute method', () => {
    it('should successfully transfer funds between accounts', async () => {
      const result = await transferService.execute({
        accountEntity,
        targetAccountEntity,
        amount: 100,
      });

      expect(result).toBeInstanceOf(Ok);
      expect(accountEntity.balance.getValue()).toBe(200);
      expect(targetAccountEntity.balance.getValue()).toBe(100);
    });

    it('should fail to transfer funds due to insufficient balance', async () => {
      const result = await transferService.execute({
        accountEntity: targetAccountEntity,
        targetAccountEntity: accountEntity,
        amount: 100,
      });

      const error = result.getError();
      expect(result).toBeInstanceOf(Err);
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error!.message).toBe('Insufficient balance');
    });
  });
});
