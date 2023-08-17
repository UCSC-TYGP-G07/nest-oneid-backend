import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration41692221872964 implements MigrationInterface {
    name = 'Migration41692221872964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "App_User" DROP CONSTRAINT "FK_69ae8de23f6f85b6edcc597fd68"`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP CONSTRAINT "UQ_69ae8de23f6f85b6edcc597fd68"`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP COLUMN "authUserUserId"`);
        await queryRunner.query(`ALTER TABLE "PID_Request" DROP CONSTRAINT "FK_59b448837239e59125763e7632f"`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP CONSTRAINT "PK_554628c1554f5a9d40526854053"`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD CONSTRAINT "PK_554628c1554f5a9d40526854053" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "PID_Request" DROP CONSTRAINT "UQ_59b448837239e59125763e7632f"`);
        await queryRunner.query(`ALTER TABLE "PID_Request" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "PID_Request" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "PID_Request" ADD CONSTRAINT "UQ_59b448837239e59125763e7632f" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD CONSTRAINT "FK_554628c1554f5a9d40526854053" FOREIGN KEY ("user_id") REFERENCES "Auth_User"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PID_Request" ADD CONSTRAINT "FK_59b448837239e59125763e7632f" FOREIGN KEY ("user_id") REFERENCES "App_User"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PID_Request" DROP CONSTRAINT "FK_59b448837239e59125763e7632f"`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP CONSTRAINT "FK_554628c1554f5a9d40526854053"`);
        await queryRunner.query(`ALTER TABLE "PID_Request" DROP CONSTRAINT "UQ_59b448837239e59125763e7632f"`);
        await queryRunner.query(`ALTER TABLE "PID_Request" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "PID_Request" ADD "user_id" character varying(36)`);
        await queryRunner.query(`ALTER TABLE "PID_Request" ADD CONSTRAINT "UQ_59b448837239e59125763e7632f" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP CONSTRAINT "PK_554628c1554f5a9d40526854053"`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD "user_id" character varying(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD CONSTRAINT "PK_554628c1554f5a9d40526854053" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "PID_Request" ADD CONSTRAINT "FK_59b448837239e59125763e7632f" FOREIGN KEY ("user_id") REFERENCES "App_User"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD "authUserUserId" uuid`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD CONSTRAINT "UQ_69ae8de23f6f85b6edcc597fd68" UNIQUE ("authUserUserId")`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD CONSTRAINT "FK_69ae8de23f6f85b6edcc597fd68" FOREIGN KEY ("authUserUserId") REFERENCES "Auth_User"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
