import {
  Controller,
  UsePipes,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountRepository } from '@/libs/mysql';
import { ZodValidationPipe } from '@/libs/pipes';
import { AccountMapper } from '@/mappers';
import { CreateAccountService, GetAccountService } from '@/services';
import {
  createAccountSchema,
  CreateAccountDto,
  getAccountDetailSchema,
  GetAccountDetailDto,
} from './dto';

@Controller('account')
class AccountController {
  constructor(
    private readonly createAccountService: CreateAccountService,
    private readonly getAccountService: GetAccountService,
    private readonly accountRepo: AccountRepository,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  async create(@Body() createAccountDto: CreateAccountDto) {
    const hasUser = await this.accountRepo.exists({
      email: createAccountDto.email,
    });
    if (hasUser) {
      throw new UnauthorizedException();
    }

    const accountResult =
      await this.createAccountService.execute(createAccountDto);

    if (accountResult.isErr()) {
      throw accountResult.getError();
    }

    const data = AccountMapper.toDto(accountResult.getValue());
    return { status: 'success', data };
  }

  @Post('detail')
  @UsePipes(new ZodValidationPipe(getAccountDetailSchema))
  async get(@Body() getAccountDetailDto: GetAccountDetailDto) {
    const accountResult =
      await this.getAccountService.execute(getAccountDetailDto);

    if (accountResult.isErr()) {
      throw accountResult.getError();
    }

    const data = AccountMapper.toDto(accountResult.getValue());
    return { status: 'success', data };
  }
}

export default AccountController;
