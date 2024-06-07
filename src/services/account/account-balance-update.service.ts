import {
  Injectable,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApplicationService } from '@/libs/domain/service';
import { AccountRepository } from '@/libs/mysql';
import { Result, Ok, Err } from '@/libs/result';

export type UpdateAccountBalanceInput = {
  id: string;
  balance: number;
};

export type UpdateAccountBalanceOutput = Promise<Ok<null> | Err<HttpException>>;

@Injectable()
class UpdateAccountBalanceService
  implements
    ApplicationService<UpdateAccountBalanceInput, UpdateAccountBalanceOutput>
{
  constructor(private readonly accountRepo: AccountRepository) {}

  async execute(input: UpdateAccountBalanceInput) {
    const { id, balance } = input;
    try {
      await this.accountRepo.update({ id }, { balance, updatedAt: new Date() });
      return Result.Ok(null);
    } catch (error) {
      return Result.Err(new InternalServerErrorException());
    }
  }
}

export default UpdateAccountBalanceService;
