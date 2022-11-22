import { Domain } from '../../../../models/domain.model';
import handlers from '..';
import { Experiment } from '../../../../models/experiment/experiment.model';
import DescriptiveHandler from './descriptive.handler';
import { TableResult } from '../../../../models/result/table-result.model';
import { GroupsResult } from 'src/engine/models/result/groups-result.model';

const data = [
  {
    "variable_based": [
      {
        "variable": "rightcerebralwhitematter",
        "dataset": "edsd",
        "data": {
          "num_dtps": 437,
          "num_na": 37,
          "num_total": 474,
          "mean": 214.37923592677345,
          "std": 31.759412531119786,
          "min": 61.8725,
          "q1": 197.2012,
          "q2": 212.8049,
          "q3": 233.7051,
          "max": 334.9526
        }
      },
      {
        "variable": "ppmicategory",
        "dataset": "edsd",
        "data": null
      },
      {
        "variable": "rightcerebralwhitematter",
        "dataset": "desd-synthdata",
        "data": {
          "num_dtps": 920,
          "num_na": 80,
          "num_total": 1000,
          "mean": 213.74694663043476,
          "std": 34.566788117025006,
          "min": 61.8725,
          "q1": 195.6455,
          "q2": 212.53735,
          "q3": 234.605825,
          "max": 334.9526
        }
      },
      {
        "variable": "ppmicategory",
        "dataset": "desd-synthdata",
        "data": null
      },
      {
        "variable": "rightcerebralwhitematter",
        "dataset": "ppmi",
        "data": {
          "num_dtps": 714,
          "num_na": 0,
          "num_total": 714,
          "mean": 233.83928417366948,
          "std": 28.18026921524509,
          "min": 165.1467,
          "q1": 214.367725,
          "q2": 232.42445,
          "q3": 252.255,
          "max": 339.0075
        }
      },
      {
        "variable": "ppmicategory",
        "dataset": "ppmi",
        "data": {
          "num_dtps": 714,
          "num_na": 0,
          "num_total": 714,
          "counts": {
            "PD": 405,
            "HC": 183,
            "GENPD": 81,
            "PRODROMA": 45
          }
        }
      },
      {
        "variable": "rightcerebralwhitematter",
        "dataset": "all datasets",
        "data": {
          "num_dtps": 2071,
          "num_na": 117,
          "num_total": 2188,
          "mean": 220.80741955577017,
          "std": 33.25531321945584,
          "min": 61.8725,
          "q1": null,
          "q2": null,
          "q3": null,
          "max": 339.0075
        }
      },
      {
        "variable": "ppmicategory",
        "dataset": "all datasets",
        "data": {
          "num_dtps": 714,
          "num_na": 0,
          "num_total": 714,
          "counts": {
            "PD": 405,
            "HC": 183,
            "GENPD": 81,
            "PRODROMA": 45
          }
        }
      }
    ],
    "model_based": [
      {
        "variable": "rightcerebralwhitematter",
        "dataset": "edsd",
        "data": null
      },
      {
        "variable": "ppmicategory",
        "dataset": "edsd",
        "data": null
      },
      {
        "variable": "rightcerebralwhitematter",
        "dataset": "desd-synthdata",
        "data": null
      },
      {
        "variable": "ppmicategory",
        "dataset": "desd-synthdata",
        "data": null
      },
      {
        "variable": "rightcerebralwhitematter",
        "dataset": "ppmi",
        "data": {
          "num_dtps": 714,
          "num_na": 0,
          "num_total": 714,
          "mean": 233.83928417366948,
          "std": 28.18026921524509,
          "min": 165.1467,
          "q1": 214.367725,
          "q2": 232.42445,
          "q3": 252.255,
          "max": 339.0075
        }
      },
      {
        "variable": "ppmicategory",
        "dataset": "ppmi",
        "data": {
          "num_dtps": 714,
          "num_na": 0,
          "num_total": 714,
          "counts": {
            "PD": 405,
            "HC": 183,
            "GENPD": 81,
            "PRODROMA": 45
          }
        }
      },
      {
        "variable": "rightcerebralwhitematter",
        "dataset": "all datasets",
        "data": {
          "num_dtps": 714,
          "num_na": 0,
          "num_total": 714,
          "mean": 233.83928417366948,
          "std": 28.18026921524509,
          "min": 165.1467,
          "q1": null,
          "q2": null,
          "q3": null,
          "max": 339.0075
        }
      },
      {
        "variable": "ppmicategory",
        "dataset": "all datasets",
        "data": {
          "num_dtps": 714,
          "num_na": 0,
          "num_total": 714,
          "counts": {
            "PD": 405,
            "HC": 183,
            "GENPD": 81,
            "PRODROMA": 45
          }
        }
      }
    ]
  }
]

const createExperiment = (): Experiment => ({
  id: 'dummy-id',
  name: 'Testing purpose',
  algorithm: {
    name: DescriptiveHandler.ALGO_NAME,
  },
  datasets: ['desd-synthdata'],
  domain: 'dementia',
  variables: ['rightcerebralwhitematter'],
  coVariables: ['ppmicategory'],
  results: [],
});

const domain: Domain = {
  id: 'dummy-id',
  groups: [],
  rootGroup: {
    id: 'dummy-id',
  },
  datasets: [{ id: 'desd-synthdata', label: 'Dead Synthdata' }],
  variables: [
    { id: 'rightcerebralwhitematter', label: 'Example label' },
    { id: 'ppmicategory', label: 'Example label 2' },
  ],
};


describe('Descriptive Stats result handler', () => {
  const descriptiveHandler = new DescriptiveHandler();
  const exp = createExperiment();

  it('Test Descriptive Handler', () => {
    
    handlers(exp, data, domain);

    const result = exp.results[0] as GroupsResult
    expect(exp.results.length).toEqual(1);
    expect(result.groups[0].name).toBe('Variables')
    expect(result.groups[1].name).toBe('Model')

    const tableData1 = result.groups[0].results[0] as TableResult
    expect(tableData1.data[0][1]).toEqual(474)

    const tableData2 = result.groups[1].results[0] as TableResult
    expect(tableData2.data[0][1]).toBe('No Enough Data')

  });
});
