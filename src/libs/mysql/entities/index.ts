import type { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';

const entities: EntityClassOrSchema[] = [User, Transaction] as const;

export { entities };
