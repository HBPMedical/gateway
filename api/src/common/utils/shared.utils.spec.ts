import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import { errorAxiosHandler, parseToBoolean } from './shared.utils';

describe('Utility parseToBoolean testing', () => {
  it('Parse true string to boolean', () => {
    expect(parseToBoolean('true')).toBe(true);
  });

  it('Parse false string to boolean', () => {
    expect(parseToBoolean('false')).toBe(false);
  });

  it('Parse wrong string to boolean, should fallback to false', () => {
    expect(parseToBoolean('truee')).toBe(false);
  });

  it('Parse wrong string to boolean, should fallback to false', () => {
    expect(parseToBoolean('falseee')).toBe(false);
  });

  it('Parse wrong string to boolean, should fallback to default value', () => {
    expect(parseToBoolean('trueee', true)).toBe(true);
  });

  it('Parse empty string to boolean, should fallback to false', () => {
    expect(parseToBoolean('')).toBe(false);
  });

  it('Parse true uppercased string to boolean', () => {
    expect(parseToBoolean('TRUE')).toBe(true);
  });

  it('Parse false uppercased string to boolean', () => {
    expect(parseToBoolean('FALSE')).toBe(false);
  });
});

jest.mock('axios');

describe('Utility error handling testing', () => {
  const error = {
    response: {
      status: 401,
      data: 'Dummmy Data',
    },
  };

  beforeAll(() => {
    // eslint-disable-next-line
    // @ts-ignore
    axios.isAxiosError.mockReturnValue(true).mockReturnValueOnce(false);
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('Throw internal error', () => {
    expect(() => errorAxiosHandler(error)).toThrow(
      InternalServerErrorException,
    );
  });

  [
    { code: 401, type: UnauthorizedException },
    { code: 404, type: NotFoundException },
    { code: 408, type: RequestTimeoutException },
    { code: 500, type: InternalServerErrorException },
  ].forEach((errorIt) => {
    it(`Throw ${errorIt.code} error`, () => {
      error.response.status = errorIt.code;
      expect(() => errorAxiosHandler(error)).toThrow(errorIt.type);
    });
  });

  it('Throw HttpException error', () => {
    error.response.status = 505;
    expect(() => errorAxiosHandler(error)).toThrow(HttpException);
  });

  it('Axios error with no response, should throw Internal server error with msg unknown error', () => {
    error.response = undefined;
    expect(() => errorAxiosHandler(error)).toThrow(
      InternalServerErrorException,
    );
  });
});
