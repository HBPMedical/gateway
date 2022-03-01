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
