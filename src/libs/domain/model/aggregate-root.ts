import { Entity } from './entity';

export abstract class AggregateRoot<Id, Props> extends Entity<Id, Props> {}
