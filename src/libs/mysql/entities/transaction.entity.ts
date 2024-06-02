import {
  Column,
  Entity,
  ManyToOne,
  Relation,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { CreateDateEntity } from '../common/columns';

@Entity('transactions')
export class Transaction extends CreateDateEntity {
  constructor(args?: Partial<Transaction>) {
    super();
    Object.assign(this, args);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Account, (account) => account.transactions)
  @JoinColumn({ name: 'account_id' })
  account!: Relation<Account>;

  @Column({ type: 'int' })
  accountBalance!: number;

  @Column({ type: 'int' })
  amount!: number;

  @ManyToOne(() => Account, (account) => account.receivedTransactions)
  @JoinColumn({ name: 'target_account_id' })
  targetAccount!: Relation<Account>;

  @Column({ type: 'int' })
  targetAccountBalance!: number;
}
