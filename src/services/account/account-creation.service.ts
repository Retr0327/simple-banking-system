import { ulid } from 'ulidx';
import {
  Injectable,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AccountAggregate } from '@/domain/aggregate-root';
import { ApplicationService } from '@/libs/domain/service';
import { AccountBalanceVO, AccountPasswordVO } from '@/domain/value-object';
import { AccountMapper } from '@/mappers';
import { AccountRepository } from '@/libs/mysql';
import { Result, Ok, Err } from '@/libs/result';

export type CreateAccountInput = {
  name: string;
  email: string;
  password: string;
  balance?: number;
};

export type CreateAccountOutput = Promise<
  Ok<AccountAggregate> | Err<HttpException>
>;

@Injectable()
class CreateAccountService
  implements ApplicationService<CreateAccountInput, CreateAccountOutput>
{
  constructor(private readonly accountRepo: AccountRepository) {}
  async execute(input: CreateAccountInput) {
    const password = await AccountPasswordVO.createHash({
      value: input.password,
    });
    const user = AccountAggregate.create(ulid(), {
      name: input.name,
      email: input.email,
      password,
      balance: AccountBalanceVO.create({ value: input.balance || 0 }),
    });
    const userDao = AccountMapper.toPersistence(user);
    try {
      return Result.Ok(await this.accountRepo.create(userDao));
    } catch (error) {
      return Result.Err(new InternalServerErrorException());
    }
  }
}

export default CreateAccountService;
