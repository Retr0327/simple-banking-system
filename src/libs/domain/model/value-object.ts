interface LiteralObject {
  [index: string]: unknown;
}

export abstract class ValueObject<Props extends object> {
  props: Readonly<Props>;

  constructor(props: Props) {
    this.props = Object.freeze(props);
  }

  equals(obj?: ValueObject<Props>): boolean {
    if (obj === null || obj === undefined) {
      return false;
    }
    if (obj.props === undefined) {
      return false;
    }
    const shallowObjectEqual = (
      props1: LiteralObject,
      props2: LiteralObject,
    ) => {
      const keys1 = Object.keys(props2);
      const keys2 = Object.keys(props1);

      if (keys1.length !== keys2.length) {
        return false;
      }
      return keys1.every(
        (key) => props2.hasOwnProperty(key) && props2[key] === props1[key],
      );
    };
    return shallowObjectEqual(this.props, obj.props);
  }
}
