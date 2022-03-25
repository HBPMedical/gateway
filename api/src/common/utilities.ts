import {
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
    if (e.response.status && e.response.status)
      throw new HttpException(e.response.data, e.response.status);
  }

  throw new InternalServerErrorException('Unknown error');
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
