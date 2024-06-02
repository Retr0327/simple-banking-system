import { TransactionVO } from '@/domain/value-object';
import { Account, Transaction } from '@/libs/mysql/entities';

class TransactionMapper {
  public static toDomain(transaction: Transaction) {
    return TransactionVO.create({
      accountId: transaction.account.id,
      type: transaction.type,
      amount: transaction.amount,
      targetAccountId: transaction.targetAccount.id,
    });
  }

  public static toPersistence(transactionVO: TransactionVO) {
    const { accountId, type, amount, targetAccountId } = transactionVO;
    return new Transaction({
      account: new Account({ id: accountId }),
      type,
      amount,
      targetAccount: new Account({ id: targetAccountId }),
    });
  }
  public static toDto(transactionVO: TransactionVO) {
    const { accountId, type, amount, targetAccountId } = transactionVO;
    return {
      accountId,
      type,
      amount,
      targetAccountId,
    };
  }
}

export default TransactionMapper;
