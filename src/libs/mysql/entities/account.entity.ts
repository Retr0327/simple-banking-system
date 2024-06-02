import { IsEmail } from 'class-validator';
import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { DefaultEntity } from '../common/columns';
import { Transaction } from './transaction.entity';

@Entity('accounts')
export class Account extends DefaultEntity {
  constructor(args?: Partial<Account>) {
    super();
    Object.assign(this, args);
  }

  @Column({ type: 'text' })
  name!: string;

  @Column('varchar', { length: 64, unique: true })
  @IsEmail()
  email!: string;

  @Column('varchar', { length: 128 })
  password!: string;

  @Column({ type: 'int', default: 0 })
  balance!: number;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions?: Relation<Transaction[]>;

  @OneToMany(() => Transaction, (transaction) => transaction.targetAccount)
  receivedTransactions?: Relation<Transaction[]>;
}
