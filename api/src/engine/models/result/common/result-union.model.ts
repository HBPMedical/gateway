import { createUnionType } from '@nestjs/graphql';
import { GroupsResult } from '../groups-result.model';
import { RawResult } from '../raw-result.model';
import { TableResult } from '../table-result.model';

export const ResultUnion = createUnionType({
  name: 'ResultUnion',
  types: () => [TableResult, RawResult, GroupsResult],
  resolveType(value) {
    if (value.headers) {
      return TableResult;
    }

    if (value.listMax) {
      return RawResult;
    }

    if (value.group) {
      return GroupsResult;
    }

    return null;
  },
});
