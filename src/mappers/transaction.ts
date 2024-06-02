import { TransactionVO } from '@/domain/value-object';
import { Account, Transaction } from '@/libs/mysql/entities';

class TransactionMapper {
  public static toDomain(transaction: Transaction) {
    return TransactionVO.create({
      accountId: transaction.account.id,
      accountBalance: transaction.accountBalance,
      amount: transaction.amount,
      targetAccountId: transaction.targetAccount.id,
      targetAccountBalance: transaction.targetAccountBalance,
    });
  }

  public static toPersistence(transactionVO: TransactionVO) {
    const {
      accountId,
      accountBalance,
      amount,
      targetAccountId,
      targetAccountBalance,
    } = transactionVO;
    return new Transaction({
      account: new Account({ id: accountId }),
      accountBalance,
      amount,
      targetAccount: new Account({ id: targetAccountId }),
      targetAccountBalance,
    });
  }

  public static toDto(transactionVO: TransactionVO) {
    const {
      accountId,
      accountBalance,
      amount,
      targetAccountId,
      targetAccountBalance,
    } = transactionVO;
    return {
      accountId,
      accountBalance,
      amount,
      targetAccountId,
      targetAccountBalance,
    };
  }
}

export default TransactionMapper;
