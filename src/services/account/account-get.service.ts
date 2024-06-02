import {
  Injectable,
  HttpException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountAggregate } from '@/domain/aggregate-root';
import { ApplicationService } from '@/libs/domain/service';
import { AccountRepository } from '@/libs/mysql';
import { Result, Ok, Err } from '@/libs/result';

type GetAccountInput = {
  id?: string;
  email?: string;
  password: string;
};

type GetAccountOutput = Promise<Ok<AccountAggregate> | Err<HttpException>>;

@Injectable()
class GetAccountService
  implements ApplicationService<GetAccountInput, GetAccountOutput>
{
  constructor(private readonly accountRepo: AccountRepository) {}
  async execute(input: GetAccountInput) {
    try {
      const { password, ...rest } = input;
      const userEntity = await this.accountRepo.findOne(rest);
      if (userEntity === null) {
        return Result.Err(new UnauthorizedException());
      }
      const pwdValidationResult = await userEntity.validatePassword(password);
      if (pwdValidationResult.isErr()) {
        return pwdValidationResult;
      }
      return Result.Ok(userEntity);
    } catch (error) {
      return Result.Err(new InternalServerErrorException());
    }
  }
}

export default GetAccountService;
