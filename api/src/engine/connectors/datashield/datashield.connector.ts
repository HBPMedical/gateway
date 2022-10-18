import { HttpService } from '@nestjs/axios';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Request } from 'express';
import { catchError, firstValueFrom } from 'rxjs';
import { ExperimentResult } from '../../../common/interfaces/utilities.interface';
import { errorAxiosHandler } from '../../../common/utils/shared.utils';
import EngineService from '../../../engine/engine.service';
import ConnectorConfiguration from '../../../engine/interfaces/connector-configuration.interface';
import Connector, {
  RunResult,
} from '../../../engine/interfaces/connector.interface';
import EngineOptions from '../../../engine/interfaces/engine-options.interface';
import { Domain } from '../../../engine/models/domain.model';
import { Algorithm } from '../../../engine/models/experiment/algorithm.model';
import { AllowedLink } from '../../../engine/models/experiment/algorithm/nominal-parameter.model';
import { Experiment } from '../../../engine/models/experiment/experiment.model';
import { AlertLevel } from '../../../engine/models/result/alert-result.model';
import { Variable } from '../../../engine/models/variable.model';
import { ExperimentCreateInput } from '../../../experiments/models/input/experiment-create.input';
import { User } from '../../../users/models/user.model';
import handlers from './handlers';
import {
  dataToGroups,
  dsGroup,
  transformToDomain,
  transformToHisto,
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
      hasFilters: false,
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
            hint: 'All other categories will be considered negative',
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
  ): Promise<ExperimentResult> {
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
        level: AlertLevel.ERROR,
        message:
          'Engine error when processing the request. Reason: ' + response.data,
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
    experiment: Experiment,
    vars: Variable[],
    cookie: string,
  ) {
    const url = new URL(this.options.baseurl + 'descriptivestats');
    const { variables, coVariables, datasets } = experiment;

    const inputData = {
      variables,
      covariables: coVariables,
      datasets,
    };

    const path = url.href;

    const { data } = await firstValueFrom(
      this.httpService.post(path, inputData, {
        headers: {
          cookie,
        },
      }),
    );

    handlers(experiment, data, vars);
  }

  async runExperiment(
    data: ExperimentCreateInput,
    request: Request,
  ): Promise<RunResult> {
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
      results: [],
      algorithm: {
        name: data.algorithm.id,
        parameters: data.algorithm.parameters.map((p) => ({
          name: p.id,
          value: p.value,
        })),
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
        expResult.results = await Promise.all<ExperimentResult>(
          allVariables.map((variable) =>
            this.getHistogram(variable, expResult.datasets, cookie),
          ),
        );
        break;
      }
      case 'DESCRIPTIVE_STATS': {
        await this.getDescriptiveStats(expResult, allVariables, cookie);
        break;
      }
      default: {
        await this.runAlgorithm(expResult, allVariables, cookie);
      }
    }

    return {
      results: expResult.results,
      status: expResult.status,
    };
  }

  private async runAlgorithm(
    experiment: Experiment,
    vars: Variable[],
    cookie?: string,
  ) {
    const path = new URL('/runAlgorithm', this.options.baseurl);

    const expToInput = {
      algorithm: {
        id: experiment.algorithm.name,
        variables: experiment.variables,
        covariables: experiment.coVariables,
      },
      datasets: experiment.datasets,
    };

    experiment.algorithm.parameters?.forEach((param) => {
      if (!expToInput.algorithm[param.name]) {
        // FIXME: Parameters should be added in a specific key entry (e.g. expToInput.algorithm.parameters')
        // Should be fixed inside the Datashield API
        expToInput.algorithm[param.name] = param.value;
      }
    });

    const { data } = await firstValueFrom(
      this.httpService.post(path.href, expToInput, {
        headers: { cookie, 'Content-Type': 'application/json' },
      }),
    );

    handlers(experiment, data, vars);
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

  async isSessionValid(user: User): Promise<boolean> {
    const sid = user && user.extraFields && user.extraFields['sid'];

    if (!sid) return false;

    try {
      const cookies = [`sid=${user.extraFields['sid']}`, `user=${user.id}`];
      const path = this.options.baseurl + 'getvars';

      await firstValueFrom(
        this.httpService.get(path, {
          headers: {
            cookie: cookies.join(';'),
          },
        }),
      );

      return true;
    } catch (err) {
      DataShieldConnector.logger.verbose(
        `User ${user.id} is not connected to Datashield`,
      );
      DataShieldConnector.logger.debug(err);
      return false;
    }
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
