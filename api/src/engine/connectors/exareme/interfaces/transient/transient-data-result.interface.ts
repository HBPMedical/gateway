export interface NumericalData {
  [key: string]: number;
}

export interface CategoricalData {
  [key: string]: {
    count: number;
    percentage: number;
  };
}

export interface TransientDataResult {
  name: string;
  result: [
    {
      data: {
        single: {
          [variable: string]: {
            [dataset: string]: {
              data: NumericalData | CategoricalData;
              num_datapoints: number;
              num_total: number;
              num_nulls: number;
            };
          };
        };
        model: {
          [dataset: string]: {
            data: {
              [variable: string]: {
                [key: string]: number;
              };
            };
            num_datapoints: number;
            num_total: number;
            num_nulls: number;
          };
        };
      };
    },
  ];
}
