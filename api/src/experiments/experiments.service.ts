import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Experiment,
  ExperimentStatus,
} from '../engine/models/experiment/experiment.model';
import { User } from '../users/models/user.model';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { ExperimentCreateInput } from './models/input/experiment-create.input';
import { PaginationArgsInput } from './models/input/pagination-args.input';
import { ExperimentUpdateDto } from './dto/experiment-update.dto';

@Injectable()
export class ExperimentsService {
  constructor(
    @InjectRepository(Experiment)
    private readonly experimentRepository: Repository<Experiment>,
  ) {}

  /**
   * It takes in a pagination object and a name, and returns a promise that resolves to an array of
   * experiments and the total number of experiments
   * @param {PaginationArgsInput} pagination - PaginationArgsInput = {}
   * @param [name] - The name of the experiment.
   * @returns An array of experiments and the total count of experiments.
   */
  async findAll(pagination: PaginationArgsInput = {}, name = '') {
    const options: FindManyOptions<Experiment> = {};

    if (name && name != '') {
      options.where = { name: Like(`%${name}%`) };
    }
    options.order = {
      createdAt: 'DESC',
    };
    options.skip = pagination.offset ?? 0;
    options.take = pagination.limit ?? 10;

    return this.experimentRepository.findAndCount(options);
  }

  /**
   * It finds an experiment by its id, if the experiment does not exist throws a NotFoundException
   * @param {string} id - string - the id of the experiment we want to find
   * @returns The experiment object
   */
  async findOne(id: string): Promise<Experiment>;

  /**
   * It finds an experiment by its id, and if the user is not the author of the experiment, it throws a
   * ForbiddenException
   * @param {string} id - string - the id of the experiment we want to find
   * @param {User} [user] - User - the user that is making the request
   * @returns The experiment object
   */
  async findOne(id: string, user: User): Promise<Experiment>;
  async findOne(id: string, user?: User): Promise<Experiment> {
    const experiment = await this.experimentRepository.findOneBy({ id });

    if (!experiment) throw new NotFoundException(`Experiment #${id} not found`);

    if (user && experiment.author.username !== user.username)
      throw new ForbiddenException(
        `Experiment #${id} is not available for user ${user.username}`,
      );

    return experiment;
  }

  dataToExperiment(
    data: ExperimentCreateInput,
    user: User,
    status?: ExperimentStatus,
  ): Partial<Experiment> {
    return {
      ...data,
      status,
      author: {
        username: user.username,
        fullname: user.fullname ?? user.username,
      },
      createdAt: new Date().toISOString(),
      algorithm: {
        name: data.algorithm.id,
        parameters: data.algorithm.parameters.map((p) => ({
          name: p.id,
          value: p.value,
        })),
      },
    };
  }

  /**
   * It creates a new experiment and saves it to the database
   * @param {ExperimentCreateInput} data - ExperimentCreateInput
   * @param {User} user - User - This is the user that is currently logged in.
   * @returns The experiment that was created.
   */
  create(
    data: ExperimentCreateInput,
    user: User,
    status = ExperimentStatus.INIT,
  ): Promise<Experiment> {
    const experiment = this.experimentRepository.create(
      this.dataToExperiment(data, user, status),
    );

    return this.experimentRepository.save(experiment);
  }

  /**
   * It finds an experiment by id and user, then updates it with the new data
   * @param {string} id - The id of the experiment to update
   * @param {ExperimentUpdateDto} data - ExperimentUpdateDto
   * @param {User} user - User - this is the user that is currently logged in.
   * @returns The updated experiment
   */
  async update(id: string, data: ExperimentUpdateDto, user: User) {
    const experiment = await this.findOne(id, user);

    return this.experimentRepository.save({
      ...experiment,
      ...data,
      id,
      updateAt: new Date().toISOString(),
    });
  }

  /**
   * Find an experiment by id, then remove it.
   *
   * @param {string} id - The id of the experiment to be deleted.
   * @param {User} user - User - This is the user that is currently logged in.
   * @returns The experiment that was removed.
   */
  async remove(id: string, user: User): Promise<Experiment> {
    const experiment = await this.findOne(id, user);

    return this.experimentRepository.remove(experiment);
  }
}
