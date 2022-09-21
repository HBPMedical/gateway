import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersRefreshToken1659096310828 implements MigrationInterface {
  name = 'UsersRefreshToken1659096310828';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "refreshToken" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refreshToken"`);
  }
}
