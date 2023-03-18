import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

@ValidatorConstraint({ name: 'isArrayofUUID', async: false })
export class IsArrayofUUIDConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!Array.isArray(value)) false;

    for (const item of value) {
      if (!uuidv4(item)) return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be an array of valid UUIDs`;
  }
}

export function IsArrayofUUID() {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: { message: `${propertyName} must be an array of valid UUIDs` },
      validator: IsArrayofUUIDConstraint,
    });
  };
}
