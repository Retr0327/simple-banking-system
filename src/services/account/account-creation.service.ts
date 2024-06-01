import { ulid } from 'ulidx';
import {
  Injectable,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserAggregate } from '@/domain/aggregate-root';
import { ApplicationService } from '@/libs/domain/service';
import { UserBalanceVO, UserPasswordVO } from '@/domain/value-object';
import { UserMapper } from '@/mappers';
import { UserRepository } from '@/libs/mysql';
import { Result, Ok, Err } from '@/libs/result';

type CreateAccountInput = {
  name: string;
  email: string;
  password: string;
  balance?: number;
};

type CreateAccountOutput = Promise<Ok<UserAggregate> | Err<HttpException>>;

@Injectable()
export class CreateAccountService
  implements ApplicationService<CreateAccountInput, CreateAccountOutput>
{
  constructor(private readonly userRepository: UserRepository) {}
  async execute(input: CreateAccountInput) {
    const password = await UserPasswordVO.createHash({
      value: input.password,
    });
    const user = UserAggregate.create(ulid(), {
      name: input.name,
      email: input.email,
      password,
      balance: UserBalanceVO.create({ value: input.balance || 0 }),
    });
    const userDao = UserMapper.toPersistence(user);
    try {
      return Result.Ok(await this.userRepository.create(userDao));
    } catch (error) {
      return Result.Err(new InternalServerErrorException());
    }
  }
}
