import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Experiment,
  ExperimentStatus,
} from 'src/engine/models/experiment/experiment.model';
import { User } from 'src/users/models/user.model';
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
   * It takes a pagination object and a name, and returns a list of experiments
   * @param {PaginationArgsInput} pagination - PaginationArgsInput
   * @param {string} name - The name of the experiment to search for.
   * @returns An array of experiments
   */
  findAll(pagination: PaginationArgsInput, name: string) {
    const options: FindManyOptions<Experiment> = {};

    if (name && name != '') {
      options.where = { name: Like(`%${name}%`) };
    }
    options.skip = pagination.offset ?? 0;
    options.take = pagination.limit ?? 10;

    return this.experimentRepository.find(options);
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
    const experiment = await this.experimentRepository.findOne();

    if (!experiment) throw new NotFoundException(`Experiment #${id} not found`);

    if (user && experiment.author.username !== user.username)
      throw new ForbiddenException(
        `Experiment #${id} is not available for user ${user.username}`,
      );

    return experiment;
  }

  /**
   * It creates a new experiment and saves it to the database
   * @param {ExperimentCreateInput} data - ExperimentCreateInput
   * @param {User} user - User - This is the user that is currently logged in.
   * @returns The experiment that was created.
   */
  create(data: ExperimentCreateInput, user: User): Promise<Experiment> {
    const experiment = this.experimentRepository.create({
      ...data,
      status: ExperimentStatus.INIT,
      author: {
        username: user.username,
        fullname: user.fullname,
      },
    });

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
