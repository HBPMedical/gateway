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

    if (value.groups) {
      return GroupsResult;
    }

    if (value.matrix) {
      return HeatMapResult;
    }

    if (value.lines) {
      return LineChartResult;
    }

    return RawResult;
  },
});
