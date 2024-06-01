import {
  Injectable,
  HttpException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserAggregate } from '@/domain/aggregate-root';
import { ApplicationService } from '@/libs/domain/service';
import { UserRepository } from '@/libs/mysql';
import { Result, Ok, Err } from '@/libs/result';

type GetAccountInput = {
  email: string;
  password: string;
};

type GetAccountOutput = Promise<Ok<UserAggregate> | Err<HttpException>>;

@Injectable()
export class GetAccountService
  implements ApplicationService<GetAccountInput, GetAccountOutput>
{
  constructor(private readonly userRepository: UserRepository) {}
  async execute(input: GetAccountInput) {
    try {
      const userEntity = await this.userRepository.findOne({
        email: input.email,
      });
      if (userEntity === null) {
        return Result.Err(new UnauthorizedException());
      }
      const pwdValidationResult = await userEntity.validatePassword(
        input.password,
      );
      if (pwdValidationResult.isErr()) {
        return pwdValidationResult;
      }
      return Result.Ok(userEntity);
    } catch (error) {
      return Result.Err(new InternalServerErrorException());
    }
  }
}
