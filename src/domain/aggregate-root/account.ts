import { UnauthorizedException } from '@nestjs/common';
import { AggregateRoot } from '@/libs/domain/model/aggregate-root';
import { Result } from '@/libs/result';
import { AccountBalanceVO, AccountPasswordVO } from '../value-object';

export interface AccountAggregateProps {
  name: string;
  email: string;
  password: AccountPasswordVO;
  balance: AccountBalanceVO;
}

class AccountAggregate extends AggregateRoot<string, AccountAggregateProps> {
  constructor(id: string, props: AccountAggregateProps) {
    super(id, props);
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get balance() {
    return this.props.balance;
  }

  setName(name: string) {
    this.props.name = name;
    return Result.Ok(null);
  }

  setEmail(email: string) {
    this.props.email = email;
    return Result.Ok(null);
  }

  setPassword(passwordVO: AccountPasswordVO) {
    this.props.password = passwordVO;
    return Result.Ok(null);
  }

  increaseBalance(money: number) {
    const updated = this.props.balance.add(money);
    if (updated.isErr()) {
      return updated;
    }
    this.props.balance = updated.getValue();
    return Result.Ok(null);
  }

  decreaseBalance(money: number) {
    const updated = this.props.balance.sub(money);
    if (updated.isErr()) {
      return updated;
    }
    this.props.balance = updated.getValue();
    return Result.Ok(null);
  }

  async validatePassword(plainPwd: string) {
    const result = await this.password.compare(plainPwd);
    if (!result) {
      return Result.Err(new UnauthorizedException());
    }
    return Result.Ok(null);
  }

  public equals(obj?: AccountAggregate | undefined) {
    if (obj == null || obj === undefined) {
      return false;
    }
    return this.id === obj.id;
  }

  static create(id: string, props: AccountAggregateProps) {
    return new AccountAggregate(id, props);
  }
}

export default AccountAggregate;
