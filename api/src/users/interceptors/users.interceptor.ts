import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { UsersService } from '../users.service';

@Injectable()
export class UsersInterceptor implements NestInterceptor {
  constructor(private readonly usersService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req ?? ctx.switchToHttp().getRequest();

    const user: User = req.user;
    if (user && user.id) {
      await this.usersService.extendedUser(user);
    }

    return next.handle();
  }
}
