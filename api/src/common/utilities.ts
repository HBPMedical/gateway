import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';

export const errorAxiosHandler = (e: any) => {
  if (!axios.isAxiosError(e)) throw new InternalServerErrorException(e);

  if (e.response.status === 401) throw new UnauthorizedException();
  if (e.response.status === 404) throw new NotFoundException();
  if (e.response.status === 408) throw new RequestTimeoutException();
  if (e.response.status === 500) throw new InternalServerErrorException();

  if (e.response) throw new HttpException(e.response.data, e.response.status);

  throw new InternalServerErrorException('Unknown error');
};
