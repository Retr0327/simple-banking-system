import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Transaction } from '../entities';
import { TransactionMapper } from '@/mappers';

@Injectable()
class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly _transactionRepo: Repository<Transaction>,
  ) {}

  async exists(options: FindOptionsWhere<Transaction>) {
    return this._transactionRepo
      .count({ where: options })
      .then((count) => count > 0);
  }

  async findOne(options: FindOptionsWhere<Transaction>) {
    const user = await this._transactionRepo.findOne({
      where: options,
    });
    if (!user) {
      return user;
    }
    return TransactionMapper.toDomain(user);
  }

  async create(account: Transaction) {
    this._transactionRepo.save(account);
    return TransactionMapper.toDomain(account);
  }
}

export default TransactionRepository;
