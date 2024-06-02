import type { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Account } from './account.entity';
import { Transaction, TransactionType } from './transaction.entity';

const entities: EntityClassOrSchema[] = [Account, Transaction] as const;

export { Account, Transaction, TransactionType, entities };
