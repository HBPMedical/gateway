import { ResultUnion } from 'src/engine/models/result/common/result-union.model';

export type Dictionary<T> = { [key: string]: T };

export type ExperimentResult = typeof ResultUnion;

export enum MIME_TYPES {
  ERROR = 'text/plain+error',
  WARNING = 'text/plain+warning',
  USER_WARNING = 'text/plain+user_error',
  HIGHCHARTS = 'application/vnd.highcharts+json',
  JSON = 'application/json',
  JSONBTREE = 'application/binary-tree+json',
  PFA = 'application/pfa+json',
  JSONDATA = 'application/vnd.dataresource+json',
  HTML = 'text/html',
  TEXT = 'text/plain',
}

/**
 * Utility method to convert string value to boolean
 * @param value string value to be converted
 * @returns true if string value equals to 'true', false otherwise
 */
export const parseToBoolean = (value: string): boolean => {
  try {
    return value.toLowerCase() == 'true';
  } catch {
    return false;
  }
};
