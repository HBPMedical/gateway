import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExperimentDateTypeUpdate1653487335545
  implements MigrationInterface
{
  name = 'ExperimentDateTypeUpdate1653487335545';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "experiment" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "experiment" ADD "createdAt" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "experiment" DROP COLUMN "updateAt"`);
    await queryRunner.query(
      `ALTER TABLE "experiment" ADD "updateAt" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "experiment" DROP COLUMN "updateAt"`);
    await queryRunner.query(
      `ALTER TABLE "experiment" ADD "updateAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "experiment" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "experiment" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }
}
