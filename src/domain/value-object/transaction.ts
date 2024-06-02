import { ValueObject } from '@/libs/domain/model/value-object';

export interface TransactionVOProps {
  accountId: string;
  accountBalance: number;
  amount: number;
  targetAccountId: string;
  targetAccountBalance: number;
}

class TransactionVO extends ValueObject<TransactionVOProps> {
  constructor(props: TransactionVOProps) {
    super(props);
  }

  get accountId() {
    return this.props.accountId;
  }

  get accountBalance() {
    return this.props.accountBalance;
  }

  get amount() {
    return this.props.amount;
  }

  get targetAccountId() {
    return this.props.targetAccountId;
  }

  get targetAccountBalance() {
    return this.props.targetAccountBalance;
  }

  public static create(props: TransactionVOProps) {
    return new TransactionVO(props);
  }
}

export default TransactionVO;
