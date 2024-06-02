import {
  BeforeInsert,
  Column,
  ColumnOptions,
  CreateDateColumn,
  PrimaryColumn,
  PrimaryColumnOptions,
  UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulidx';

export function PrimaryUlidColumn(
  options?: Omit<PrimaryColumnOptions, 'length' | 'type'>,
) {
  return PrimaryColumn({ ...options, length: 26, type: 'char' });
}

export function UlidColumn(options?: Omit<ColumnOptions, 'length' | 'type'>) {
  return Column({ ...options, length: 26, type: 'char' });
}

export class CreateDateEntity {
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;
}

export class UpdateDateEntity extends CreateDateEntity {
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
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
