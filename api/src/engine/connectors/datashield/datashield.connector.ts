import { HttpService } from '@nestjs/axios';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Request } from 'express';
import { catchError, firstValueFrom } from 'rxjs';
import {
  ExperimentResult,
  MIME_TYPES,
} from 'src/common/interfaces/utilities.interface';
import { errorAxiosHandler } from 'src/common/utils/shared.utils';
import EngineService from 'src/engine/engine.service';
import ConnectorConfiguration from 'src/engine/interfaces/connector-configuration.interface';
import Connector from 'src/engine/interfaces/connector.interface';
import EngineOptions from 'src/engine/interfaces/engine-options.interface';
import { Domain } from 'src/engine/models/domain.model';
import { Algorithm } from 'src/engine/models/experiment/algorithm.model';
import { AllowedLink } from 'src/engine/models/experiment/algorithm/nominal-parameter.model';
import { Experiment } from 'src/engine/models/experiment/experiment.model';
import { RawResult } from 'src/engine/models/result/raw-result.model';
import {
  TableResult,
  TableStyle,
} from 'src/engine/models/result/table-result.model';
import { Variable } from 'src/engine/models/variable.model';
import { ExperimentCreateInput } from 'src/experiments/models/input/experiment-create.input';
import { User } from 'src/users/models/user.model';
import {
  dataToGroups,
  dsGroup,
  transformToDomain,
  transformToHisto,
  transformToTable,
  transformToTableNominal,
  transfoToHistoNominal as transformToHistoNominal,
} from './transformations';

export default class DataShieldConnector implements Connector {
  private static readonly logger = new Logger(DataShieldConnector.name);
  headers = {};
  constructor(
    private readonly options: EngineOptions,
    private readonly httpService: HttpService,
    private readonly engineService: EngineService,
  ) {}

  getConfiguration(): ConnectorConfiguration {
    return {
      hasGalaxy: false,
      hasGrouping: false,
    };
  }

  async login(username: string, password: string): Promise<User> {
    const loginPath = this.options.baseurl + 'login';

    const user: User = {
      id: username,
      username,
      extraFields: {
        sid: '',
      },
    };

    const loginData = await firstValueFrom(
      this.httpService
        .get(loginPath, {
          auth: { username, password },
        })
        .pipe(catchError((e) => errorAxiosHandler(e))),
    );

    const cookies = loginData.headers['set-cookie'] ?? [];
    if (loginData.headers && loginData.headers['set-cookie']) {
      cookies.forEach((cookie) => {
        const [key, value] = cookie.split(/={1}/);
        if (key === 'sid') {
          user.extraFields.sid = value;
        }
      });
    }

    return user;
  }

  async getAlgorithms(): Promise<Algorithm[]> {
    return [
      {
        id: 'linear-regression',
        label: 'Linear Regression',
        description:
          'Linear regression analysis is a method of statistical analysis that fits a linear function in order to predict the value of a covariate as a function of one or more variables. Linear regression is a simple model that is easy to understand and interpret.',
        variable: {
          isRequired: true,
          allowedTypes: ['number'],
          hasMultiple: false,
        },
        coVariable: {
          isRequired: true,
          allowedTypes: ['number'],
          hasMultiple: true,
        },
      },
      {
        id: 'logistic-regression',
        label: 'Logistic Regression',
        description:
          'Logistic regression is a statistical method for predicting the probability of a binary event.',
        variable: {
          isRequired: true,
          allowedTypes: ['nominal'],
          hasMultiple: false,
          hint: 'A binary event to predict',
        },
        coVariable: {
          isRequired: true,
          allowedTypes: ['number'],
          hasMultiple: true,
        },
        parameters: [
          {
            name: 'pos-level',
            label: 'Positive level',
            linkedTo: AllowedLink.VARIABLE,
            isRequired: true,
          },
          {
            name: 'neg-level',
            label: 'Negative level',
            linkedTo: AllowedLink.VARIABLE,
            isRequired: true,
          },
        ],
      },
    ];
  }

  async getHistogram(
    variable: Variable,
    datasets: string[],
    cookie?: string,
  ): Promise<RawResult> {
    const url = new URL(this.options.baseurl + `histogram`);

    url.searchParams.append('var', variable.id);
    url.searchParams.append('type', 'combine');
    url.searchParams.append('cohorts', datasets.join(','));

    const path = url.href;

    const response = await firstValueFrom(
      this.httpService.get(path, {
        headers: {
          cookie,
        },
      }),
    );

    if (response.data['global'] === undefined) {
      DataShieldConnector.logger.warn('Cannot parse histogram result');
      DataShieldConnector.logger.verbose(path);
      return {
        rawdata: {
          data:
            'Engine error when processing the request. Reason: ' +
            response.data,
          type: MIME_TYPES.ERROR,
        },
      };
    }

    const title = variable.label ?? variable.id;
    const data = { ...response.data, title };

    if (variable.type === 'nominal' && variable.enumerations) {
      data['lookup'] = variable.enumerations.reduce((prev, curr) => {
        prev[curr.value] = curr.label;
        return prev;
      }, {});
    }

    const chart =
      variable.type === 'nominal'
        ? transformToHistoNominal.evaluate(data)
        : transformToHisto.evaluate(data);

    return {
      rawdata: {
        data: chart,
        type: 'application/vnd.highcharts+json',
      },
    };
  }

  async getDescriptiveStats(
    variable: Variable,
    datasets: string[],
    cookie?: string,
  ): Promise<TableResult> {
    const url = new URL(this.options.baseurl + 'quantiles');

    url.searchParams.append('var', variable.id);
    url.searchParams.append('type', 'split');
    url.searchParams.append('cohorts', datasets.join(','));

    const path = url.href;

    const response = await firstValueFrom(
      this.httpService.get(path, {
        headers: {
          cookie,
        },
      }),
    );

    const title = variable.label ?? variable.id;
    const data = { ...response.data, title };

    const table = (
      variable.enumerations
        ? transformToTableNominal.evaluate(data)
        : transformToTable.evaluate(data)
    ) as TableResult;

    if (
      table &&
      table.headers &&
      variable.type === 'nominal' &&
      variable.enumerations
    ) {
      table.headers = table.headers.map((header) => {
        const category = variable.enumerations.find(
          (v) => v.value === header.name,
        );

        if (!category || !category.label) return header;

        return {
          ...header,
          name: category.label,
        };
      });
    }

    return {
      ...table,
      tableStyle: TableStyle.DEFAULT,
    };
  }

  async runExperiment(
    data: ExperimentCreateInput,
    request: Request,
  ): Promise<ExperimentResult[]> {
    const user = request.user as User;
    const cookie = [`sid=${user.extraFields['sid']}`, `user=${user.id}`].join(
      ';',
    );
    const expResult: Experiment = {
      id: `${data.algorithm.id}-${Date.now()}`,
      variables: data.variables,
      coVariables: data.coVariables,
      author: {
        username: user.username,
        fullname: user.fullname ?? user.username,
      },
      name: data.name,
      domain: data.domain,
      datasets: data.datasets,
      algorithm: {
        name: data.algorithm.id,
      },
    };

    const allVariablesId = [...data.variables, ...data.coVariables];

    const allVariables = await this.engineService.getVariables(
      expResult.domain,
      allVariablesId,
      request,
    );

    switch (data.algorithm.id) {
      case 'MULTIPLE_HISTOGRAMS': {
        expResult.results = await Promise.all<RawResult>(
          allVariables.map((variable) =>
            this.getHistogram(variable, expResult.datasets, cookie),
          ),
        );
        break;
      }
      case 'DESCRIPTIVE_STATS': {
        // Cannot be done in parallel because Datashield API has an issue with parallel request (response mismatching)
        const results = [];
        for (const variable of allVariables) {
          const result = await this.getDescriptiveStats(
            variable,
            expResult.datasets,
            cookie,
          );

          results.push(result);
        }

        expResult.results = results;
        break;
      }
    }

    return expResult.results;
  }

  async logout(request: Request): Promise<void> {
    const user = request.user as User;
    const cookie = [`sid=${user.extraFields['sid']}`, `user=${user.id}`].join(
      ';',
    );

    const path = new URL('/logout', this.options.baseurl).href;

    this.httpService.get(path, {
      headers: {
        cookie,
      },
    });
  }

  async getDomains(request: Request): Promise<Domain[]> {
    const user = request.user as User;
    const sid = user && user.extraFields && user.extraFields['sid'];

    if (!sid)
      throw new InternalServerErrorException(
        'Datashield sid is missing from the user',
      );

    const cookies = [`sid=${user.extraFields['sid']}`, `user=${user.id}`];
    const path = this.options.baseurl + 'getvars';

    const response = await firstValueFrom(
      this.httpService.get(path, {
        headers: {
          cookie: cookies.join(';'),
        },
      }),
    );

    const dsDomain = transformToDomain.evaluate(response.data);
    const groups = response.data['groups'] as dsGroup[];

    dataToGroups(dsDomain, groups);
    return [dsDomain];
  }

  async getActiveUser(req: Request): Promise<User> {
    const user = req.user as User;

    if (!user) throw new InternalServerErrorException('User not found');

    return {
      username: user.id,
      id: user.id,
      fullname: user.id,
    };
  }
}
