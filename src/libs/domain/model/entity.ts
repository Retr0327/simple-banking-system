export abstract class Entity<Id, Props> {
  readonly id: Id;
  protected props: Props;

  protected constructor(id: Id, props: Props) {
    this.id = id;
    this.props = props;
  }

  public abstract equals(obj?: Entity<Id, Props>): boolean;
}
