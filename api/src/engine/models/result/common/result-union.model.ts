import { createUnionType } from '@nestjs/graphql';
import { RawResult } from '../raw-result.model';
import { TableResult } from '../table-result.model';

export const ResultUnion = createUnionType({
  name: 'ResultUnion',
  types: () => [TableResult, RawResult],
  resolveType(value) {
    if (value.headers) {
      return TableResult;
    }
    if (value.listMax) {
      return RawResult;
    }

    return null;
  },
});
