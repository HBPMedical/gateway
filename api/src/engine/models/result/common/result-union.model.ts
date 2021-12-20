import { createUnionType } from '@nestjs/graphql';
import { GroupsResult } from '../groups-result.model';
import { HeatMapResult } from '../heat-map-result.model';
import { LineChartResult } from '../line-chart-result.model';
import { RawResult } from '../raw-result.model';
import { TableResult } from '../table-result.model';

export const ResultUnion = createUnionType({
  name: 'ResultUnion',
  types: () => [
    TableResult,
    RawResult,
    GroupsResult,
    HeatMapResult,
    LineChartResult,
  ],
  resolveType(value) {
    if (value.headers) {
      return TableResult;
    }

    if (value.rawdata) {
      return RawResult;
    }

    if (value.groups) {
      return GroupsResult;
    }

    if (value.matrix) {
      return HeatMapResult;
    }

    if (value.x) {
      return LineChartResult;
    }

    return null;
  },
});
