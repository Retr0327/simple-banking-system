import { DataSource } from 'typeorm';
import {
  Injectable,
  HttpException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountAggregate } from '@/domain/aggregate-root';
import { TransactionVO } from '@/domain/value-object';
import { ApplicationService } from '@/libs/domain/service';
import { Account } from '@/libs/mysql';
import { Result, Ok, Err } from '@/libs/result';
import { TransactionMapper } from '@/mappers';

type TransferInput = {
  accountEntity: AccountAggregate;
  targetAccountEntity: AccountAggregate;
  amount: number;
};

type TransferOutput = Promise<Ok<null> | Err<HttpException>>;

@Injectable()
class TransferService
  implements ApplicationService<TransferInput, TransferOutput>
{
  constructor(private readonly dataSource: DataSource) {}

  async execute(input: TransferInput) {
    const { accountEntity, targetAccountEntity, amount } = input;
    const prevAccountBalance = accountEntity.balance.getValue();
    const prevTargetAccountBalance = targetAccountEntity.balance.getValue();

    const decreasedResult = accountEntity.decreaseBalance(amount);
    const increasedResult = targetAccountEntity.increaseBalance(amount);
    const results = Result.all([decreasedResult, increasedResult]);
    if (results.isErr()) {
      return Result.Err(new UnauthorizedException(results.getError()));
    }

    const transaction = TransactionVO.create({
      accountId: accountEntity.id,
      accountBalance: prevAccountBalance,
      amount,
      targetAccountId: accountEntity.id,
      targetAccountBalance: prevTargetAccountBalance,
    });
    const transactionDao = TransactionMapper.toPersistence(transaction);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(Account, accountEntity.id, {
        balance: accountEntity.balance.getValue(),
      });
      await queryRunner.manager.update(Account, targetAccountEntity.id, {
        balance: targetAccountEntity.balance.getValue(),
      });
      await queryRunner.manager.save(transactionDao);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return Result.Err(new InternalServerErrorException());
    } finally {
      await queryRunner.release();
      return Result.Ok(null);
    }
  }
}

export default TransferService;
