import { MigrationInterface, QueryRunner } from "typeorm";

export class NewTableBorrowingRelationsWithBookAndMember1726108508316 implements MigrationInterface {
    name = 'NewTableBorrowingRelationsWithBookAndMember1726108508316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "borrowing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "code" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'Borrowed', "borrowingDate" date NOT NULL, "returnedDate" date, "memberId" uuid, "bookId" uuid, CONSTRAINT "UQ_9b7974d6c2ebc54f263b4200a96" UNIQUE ("code"), CONSTRAINT "PK_5bfeaa4e275c1a2e2ab257f2ee2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "borrowing" ADD CONSTRAINT "FK_425b0963448e14be633554088ff" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "borrowing" ADD CONSTRAINT "FK_6d4de218bbdb605c1d33de6242f" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "borrowing" DROP CONSTRAINT "FK_6d4de218bbdb605c1d33de6242f"`);
        await queryRunner.query(`ALTER TABLE "borrowing" DROP CONSTRAINT "FK_425b0963448e14be633554088ff"`);
        await queryRunner.query(`DROP TABLE "borrowing"`);
    }

}
