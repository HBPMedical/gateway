import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExperimentDB1653484967792 implements MigrationInterface {
  name = 'CreateExperimentDB1653484967792';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."experiment_status_enum" AS ENUM('init', 'pending', 'success', 'warn', 'error')`,
    );
    await queryRunner.query(
      `CREATE TABLE "experiment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "author" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "finishedAt" character varying, "viewed" boolean DEFAULT false, "status" "public"."experiment_status_enum" NOT NULL DEFAULT 'init', "shared" boolean DEFAULT false, "results" jsonb, "datasets" text array NOT NULL, "filter" character varying, "domain" character varying NOT NULL, "variables" text array NOT NULL, "coVariables" text array, "filterVariables" text array, "formula" jsonb, "algorithm" jsonb, CONSTRAINT "PK_4f6eec215c62eec1e0fde987caf" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "experiment"`);
    await queryRunner.query(`DROP TYPE "public"."experiment_status_enum"`);
  }
}
