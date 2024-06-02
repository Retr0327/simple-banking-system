import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { Account } from '../entities';
import { AccountMapper } from '@/mappers';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
class AccountRepository {
  constructor(
    @InjectRepository(Account)
    private readonly _accountRepo: Repository<Account>,
  ) {}

  async exists(options: FindOptionsWhere<Account>) {
    return this._accountRepo
      .count({ where: options })
      .then((count) => count > 0);
  }

  async checkIdsExist(ids: string[]) {
    return this._accountRepo
      .count({ where: { id: In(ids) } })
      .then((count) => count === ids.length);
  }

  async findOne(options: FindOptionsWhere<Account>) {
    const user = await this._accountRepo.findOne({
      where: options,
    });
    if (!user) {
      return user;
    }
    return AccountMapper.toDomain(user);
  }
  async create(account: Account) {
    this._accountRepo.save(account);
    return AccountMapper.toDomain(account);
  }

  async update(
    criteria: FindOptionsWhere<Account>,
    partialEntity: QueryDeepPartialEntity<Account>,
  ) {
    return this._accountRepo.update(criteria, partialEntity);
  }
}

export default AccountRepository;
