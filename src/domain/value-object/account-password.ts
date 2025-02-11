import { ValueObject } from '@/libs/domain/model/value-object';
import { hash, compare } from 'bcryptjs';

export interface AccountPasswordVOProps {
  value: string;
}

class AccountPasswordVO extends ValueObject<AccountPasswordVOProps> {
  constructor(props: AccountPasswordVOProps) {
    super(props);
  }

  get value() {
    return this.props.value;
  }

  getValue() {
    return this.props.value;
  }

  compare(plainPwd: string) {
    return compare(plainPwd, this.props.value);
  }

  public static async createHash(props: AccountPasswordVOProps) {
    const hashed = await hash(props.value, 10);
    return new AccountPasswordVO({ value: hashed });
  }

  public static create(props: AccountPasswordVOProps) {
    return new AccountPasswordVO({ value: props.value });
  }
}

export default AccountPasswordVO;
