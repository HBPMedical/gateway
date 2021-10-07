import { Field, ObjectType } from '@nestjs/graphql';
import { ResultUnion } from './common/result-union.model';
import { Result } from './common/result.model';

@ObjectType()
export class GroupResult {
  public constructor(init?: Partial<GroupResult>) {
    Object.assign(this, init);
  }

  @Field()
  name: string;

  @Field(() => [ResultUnion])
  results: Array<typeof ResultUnion>;
}

@ObjectType()
export class GroupsResult extends Result {
  @Field(() => [GroupResult])
  groups: GroupResult[];
}
