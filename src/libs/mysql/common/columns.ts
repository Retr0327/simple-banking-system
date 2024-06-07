import {
  BeforeInsert,
  Column,
  ColumnType,
  ColumnOptions,
  CreateDateColumn,
  PrimaryColumn,
  PrimaryColumnOptions,
  UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulidx';
import { env } from '@/configs';

export function adaptType(type: ColumnType) {
  if (env.nodeEnv !== 'test') {
    return type;
  }
  switch (type) {
    case 'timestamp':
      return 'text';
    case 'char':
      return 'text';
    default:
      return type;
  }
}

export function PrimaryUlidColumn(
  options?: Omit<PrimaryColumnOptions, 'length' | 'type'>,
) {
  return PrimaryColumn({ ...options, length: 26, type: adaptType('char') });
}

export function UlidColumn(options?: Omit<ColumnOptions, 'length' | 'type'>) {
  return Column({ ...options, length: 26, type: adaptType('char') });
}

export class CreateDateEntity {
  @CreateDateColumn({ type: adaptType('timestamp'), name: 'created_at' })
  createdAt!: Date;
}

export class UpdateDateEntity extends CreateDateEntity {
  @UpdateDateColumn({ type: adaptType('timestamp'), name: 'updated_at' })
  updatedAt!: Date;
}

export class TimeEntity extends UpdateDateEntity {}

export class DefaultEntity extends TimeEntity {
  @PrimaryUlidColumn()
  id!: string;

  @BeforeInsert()
  insertUlid() {
    if (!this.id) {
      this.id = ulid();
    }
  }
}
