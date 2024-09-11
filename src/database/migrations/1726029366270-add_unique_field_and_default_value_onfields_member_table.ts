import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueFieldAndDefaultValueOnfieldsMemberTable1726029366270 implements MigrationInterface {
    name = 'AddUniqueFieldAndDefaultValueOnfieldsMemberTable1726029366270'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" ADD CONSTRAINT "UQ_87dbb39d7c7c430faa5bf1af3bb" UNIQUE ("code")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "UQ_87dbb39d7c7c430faa5bf1af3bb"`);
    }

}
