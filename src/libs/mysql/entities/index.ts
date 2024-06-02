import type { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Account } from './account.entity';
import { Transaction } from './transaction.entity';

const entities: EntityClassOrSchema[] = [Account, Transaction] as const;

export { Account, Transaction, entities };
