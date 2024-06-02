import { AccountAggregate } from '@/domain/aggregate-root';
import { Account } from '@/libs/mysql/entities';
import { AccountBalanceVO, AccountPasswordVO } from '@/domain/value-object';

class AccountMapper {
  public static toDomain(user: Account) {
    return AccountAggregate.create(user.id, {
      name: user.name,
      email: user.email,
      password: AccountPasswordVO.create({ value: user.password }),
      balance: AccountBalanceVO.create({ value: user.balance }),
    });
  }

  public static toPersistence(accountEntity: AccountAggregate) {
    const { id, name, email, password, balance } = accountEntity;
    const user = new Account({
      id,
      name,
      email,
      password: password.getValue(),
      balance: balance.getValue(),
    });
    return user;
  }

  public static toDto(accountEntity: AccountAggregate) {
    const { id, name, email, balance } = accountEntity;
    return {
      id,
      name,
      email,
      balance: balance.getValue(),
    };
  }
}

export default AccountMapper;
