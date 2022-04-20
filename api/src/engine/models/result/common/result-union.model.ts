import { createUnionType } from '@nestjs/graphql';
import { GroupsResult } from '../groups-result.model';
import { HeatMapResult } from '../heat-map-result.model';
import { LineChartResult } from '../line-chart-result.model';
import { RawResult } from '../raw-result.model';
import { TableResult } from '../table-result.model';
import { BarChartResult } from '../bar-chart-result.model';
import { MeanChartResult } from '../means-chart-result.model';

export const ResultUnion = createUnionType({
  name: 'ResultUnion',
  types: () => [
    TableResult,
    RawResult,
    GroupsResult,
    HeatMapResult,
    LineChartResult,
    BarChartResult,
    MeanChartResult,
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

    if (value.barValues) {
      return BarChartResult;
    }

    if (value.pointCIs) {
      return MeanChartResult;
    }

    return RawResult;
  },
});
