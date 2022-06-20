/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-use-before-define */

import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';

export const errorAxiosHandler = (e: any) => {
  if (!axios.isAxiosError(e)) throw new InternalServerErrorException(e);

  if (e.response) {
    if (e.response.status === 401) throw new UnauthorizedException();
    if (e.response.status === 404) throw new NotFoundException();
    if (e.response.status === 408) throw new RequestTimeoutException();
    if (e.response.status === 500) throw new InternalServerErrorException();
    if (e.response.status)
      throw new HttpException(e.response.data, e.response.status);
  }

  throw new InternalServerErrorException('Unknown error');
};

/**
 * It rounds a number to a given number of decimal places
 * @param {number} val - the number to be rounded
 * @param [decimal=2] - The number of decimal places to round to.
 * @param [keepSmallNumber=true] - If true, it will keep the number in exponential form if it's smaller
 * than 1/coef.
 * @returns Formatted string number
 */
export const floatRound = (
  val: number,
  decimal = 2,
  keepSmallNumber = true,
) => {
  const n = Math.trunc(decimal);

  if (n < 0) throw new Error('decimal cannot be negative number');

  const coef = Math.pow(10, n);

  if (keepSmallNumber && val !== 0 && val < 1 / coef) {
    return val.toExponential(n);
  }

  return (Math.round(val * coef) / coef).toString();
};

/**
 * Parse a string to a boolean
 * @param {string} value - The value to parse.
 * @param [defaultValue=false] - The default value to return if the value is not a valid boolean.
 * @returns A boolean value.
 */
export const parseToBoolean = (
  value: string,
  defaultValue = false,
): boolean => {
  try {
    if (value.toLowerCase() == 'true') return true;
    return value.toLowerCase() == 'false' ? false : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const isUndefined = (obj: any): obj is undefined =>
  typeof obj === 'undefined';

export const isObject = (fn: any): fn is object =>
  !isNil(fn) && typeof fn === 'object';

export const isPlainObject = (fn: any): fn is object => {
  if (!isObject(fn)) {
    return false;
  }
  const proto = Object.getPrototypeOf(fn);
  if (proto === null) {
    return true;
  }
  const ctor =
    Object.prototype.hasOwnProperty.call(proto, 'constructor') &&
    proto.constructor;
  return (
    typeof ctor === 'function' &&
    ctor instanceof ctor &&
    Function.prototype.toString.call(ctor) ===
      Function.prototype.toString.call(Object)
  );
};

export const isFunction = (val: any): boolean => typeof val === 'function';
export const isString = (val: any): val is string => typeof val === 'string';
export const isNumber = (val: any): val is number => typeof val === 'number';
export const isConstructor = (val: any): boolean => val === 'constructor';
export const isNil = (val: any): val is null | undefined =>
  isUndefined(val) || val === null;
export const isEmpty = (array: any): boolean => !(array && array.length > 0);
export const isSymbol = (val: any): val is symbol => typeof val === 'symbol';
