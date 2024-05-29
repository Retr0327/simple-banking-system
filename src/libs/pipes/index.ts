import {
  PipeTransform,
  ArgumentMetadata,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  /* eslint-disable @typescript-eslint/no-unused-vars */
  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      throw new UnprocessableEntityException();
    }
  }
}
