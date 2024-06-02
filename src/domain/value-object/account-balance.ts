import { Result } from '@/libs/result';
import { ValueObject } from '@/libs/domain/model/value-object';

export interface AccountBalanceVOProps {
  value: number;
}

class AccountBalanceVO extends ValueObject<AccountBalanceVOProps> {
  constructor(props: AccountBalanceVOProps) {
    if (props.value < 0) {
      return Result.Err('Balance should be positive');
    }
    super(props);
  }

  get value() {
    return this.props.value;
  }

  getValue() {
    return this.props.value;
  }

  add(money: number) {
    if (money <= 0) {
      return Result.Err('Money should be positive');
    }
    return Result.Ok(new AccountBalanceVO({ value: this.props.value + money }));
  }

  sub(money: number) {
    if (money <= 0) {
      return Result.Err('Money should be positive');
    }
    if (this.props.value < money) {
      return Result.Err('Insufficient balance');
    }
    return Result.Ok(new AccountBalanceVO({ value: this.props.value - money }));
  }

  public static create(props: AccountBalanceVOProps) {
    return new AccountBalanceVO({ value: props.value });
  }
}

export default AccountBalanceVO;
