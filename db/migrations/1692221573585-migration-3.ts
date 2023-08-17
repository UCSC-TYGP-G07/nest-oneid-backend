import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration31692221573585 implements MigrationInterface {
    name = 'Migration31692221573585'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PID_Request" DROP CONSTRAINT "FK_59b448837239e59125763e7632f"`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP CONSTRAINT "PK_554628c1554f5a9d40526854053"`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD "user_id" character varying(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD CONSTRAINT "PK_554628c1554f5a9d40526854053" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP COLUMN "postal_code"`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD "postal_code" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "PID_Request" DROP CONSTRAINT "UQ_59b448837239e59125763e7632f"`);
        await queryRunner.query(`ALTER TABLE "PID_Request" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "PID_Request" ADD "user_id" character varying(36)`);
        await queryRunner.query(`ALTER TABLE "PID_Request" ADD CONSTRAINT "UQ_59b448837239e59125763e7632f" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "PID_Request" ADD CONSTRAINT "FK_59b448837239e59125763e7632f" FOREIGN KEY ("user_id") REFERENCES "App_User"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PID_Request" DROP CONSTRAINT "FK_59b448837239e59125763e7632f"`);
        await queryRunner.query(`ALTER TABLE "PID_Request" DROP CONSTRAINT "UQ_59b448837239e59125763e7632f"`);
        await queryRunner.query(`ALTER TABLE "PID_Request" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "PID_Request" ADD "user_id" character varying`);
        await queryRunner.query(`ALTER TABLE "PID_Request" ADD CONSTRAINT "UQ_59b448837239e59125763e7632f" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP COLUMN "postal_code"`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD "postal_code" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP CONSTRAINT "PK_554628c1554f5a9d40526854053"`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD CONSTRAINT "PK_554628c1554f5a9d40526854053" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "PID_Request" ADD CONSTRAINT "FK_59b448837239e59125763e7632f" FOREIGN KEY ("user_id") REFERENCES "App_User"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
