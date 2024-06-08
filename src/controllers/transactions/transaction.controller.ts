import {
  Controller,
  UsePipes,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/libs/pipes';
import { AccountRepository } from '@/libs/mysql';
import {
  GetAccountService,
  UpdateAccountBalanceService,
  TransferService,
} from '@/services';
import {
  transactionSchema,
  TransactionDto,
  transferSchema,
  TransferDto,
} from './dto';

@Controller('transactions')
class TransactionController {
  constructor(
    private readonly accountRepo: AccountRepository,
    private readonly getAccountService: GetAccountService,
    private readonly updateBalanceService: UpdateAccountBalanceService,
    private readonly transferService: TransferService,
  ) {}

  @Post('deposit')
  @UsePipes(new ZodValidationPipe(transactionSchema))
  async deposit(@Body() transactionDto: TransactionDto) {
    const { account, password, amount } = transactionDto;
    const accountResult = await this.getAccountService.execute({
      id: account,
      password,
    });
    if (accountResult.isErr()) {
      throw accountResult.getError();
    }

    const accountEntity = accountResult.getValue();
    const balanceResult = accountEntity.increaseBalance(amount);
    if (balanceResult.isErr()) {
      throw new UnauthorizedException(balanceResult.getError());
    }

    const updatedResult = await this.updateBalanceService.execute({
      id: accountEntity.id,
      balance: accountEntity.balance.getValue(),
    });
    if (updatedResult.isErr()) {
      throw updatedResult.getError();
    }

    return { status: 'success' };
  }

  @Post('withdrawal')
  @UsePipes(new ZodValidationPipe(transactionSchema))
  async withdraw(@Body() transactionDto: TransactionDto) {
    const { account, password, amount } = transactionDto;
    const accountResult = await this.getAccountService.execute({
      id: account,
      password,
    });
    if (accountResult.isErr()) {
      throw accountResult.getError();
    }

    const accountEntity = accountResult.getValue();
    const balanceResult = accountEntity.decreaseBalance(amount);
    if (balanceResult.isErr()) {
      throw new UnauthorizedException(balanceResult.getError());
    }

    const updatedResult = await this.updateBalanceService.execute({
      id: accountEntity.id,
      balance: accountEntity.balance.getValue(),
    });
    if (updatedResult.isErr()) {
      throw updatedResult.getError();
    }

    return { status: 'success' };
  }

  @Post('transfer')
  @UsePipes(new ZodValidationPipe(transferSchema))
  async transfer(@Body() transferDto: TransferDto) {
    const { account, password, targetAccount, amount } = transferDto;
    const accountResult = await this.getAccountService.execute({
      id: account,
      password,
    });
    if (accountResult.isErr()) {
      throw accountResult.getError();
    }

    const targetAccountEntity = await this.accountRepo.findOne({
      id: targetAccount,
    });
    if (targetAccountEntity === null) {
      throw new UnauthorizedException();
    }

    const transferredResult = await this.transferService.execute({
      accountEntity: accountResult.getValue(),
      targetAccountEntity,
      amount,
    });
    if (transferredResult.isErr()) {
      throw transferredResult.getError();
    }

    return { status: 'success' };
  }
}

export default TransactionController;
