import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration11692219532026 implements MigrationInterface {
    name = 'Migration11692219532026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "App_User" DROP COLUMN "sex"`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP COLUMN "permenant_address"`);
        await queryRunner.query(`CREATE TYPE "public"."App_User_gender_enum" AS ENUM('male', 'female')`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD "gender" "public"."App_User_gender_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD "permanent_address" character varying(128) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD "authUserUserId" uuid`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD CONSTRAINT "UQ_69ae8de23f6f85b6edcc597fd68" UNIQUE ("authUserUserId")`);
        await queryRunner.query(`ALTER TABLE "Auth_User" DROP COLUMN "role"`);
        await queryRunner.query(`CREATE TYPE "public"."Auth_User_role_enum" AS ENUM('app-user', 'gov-officer', 'organisation')`);
        await queryRunner.query(`ALTER TABLE "Auth_User" ADD "role" "public"."Auth_User_role_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Auth_User" ALTER COLUMN "last_login_date" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Auth_User" ALTER COLUMN "last_login_ip" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "PID_Request" DROP CONSTRAINT "FK_59b448837239e59125763e7632f"`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP CONSTRAINT "PK_554628c1554f5a9d40526854053"`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD CONSTRAINT "PK_554628c1554f5a9d40526854053" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP COLUMN "civil_status"`);
        await queryRunner.query(`CREATE TYPE "public"."App_User_civil_status_enum" AS ENUM('single', 'married', 'widowed', 'separated', 'divorced')`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD "civil_status" "public"."App_User_civil_status_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "PID_Request" DROP CONSTRAINT "REL_59b448837239e59125763e7632"`);
        await queryRunner.query(`ALTER TABLE "PID_Request" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "PID_Request" ADD "user_id" character varying`);
        await queryRunner.query(`ALTER TABLE "PID_Request" ADD CONSTRAINT "UQ_59b448837239e59125763e7632f" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD CONSTRAINT "FK_69ae8de23f6f85b6edcc597fd68" FOREIGN KEY ("authUserUserId") REFERENCES "Auth_User"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PID_Request" ADD CONSTRAINT "FK_59b448837239e59125763e7632f" FOREIGN KEY ("user_id") REFERENCES "App_User"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PID_Request" DROP CONSTRAINT "FK_59b448837239e59125763e7632f"`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP CONSTRAINT "FK_69ae8de23f6f85b6edcc597fd68"`);
        await queryRunner.query(`ALTER TABLE "PID_Request" DROP CONSTRAINT "UQ_59b448837239e59125763e7632f"`);
        await queryRunner.query(`ALTER TABLE "PID_Request" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "PID_Request" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "PID_Request" ADD CONSTRAINT "REL_59b448837239e59125763e7632" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP COLUMN "civil_status"`);
        await queryRunner.query(`DROP TYPE "public"."App_User_civil_status_enum"`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD "civil_status" character varying(32) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP CONSTRAINT "PK_554628c1554f5a9d40526854053"`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD "user_id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD CONSTRAINT "PK_554628c1554f5a9d40526854053" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "PID_Request" ADD CONSTRAINT "FK_59b448837239e59125763e7632f" FOREIGN KEY ("user_id") REFERENCES "App_User"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Auth_User" ALTER COLUMN "last_login_ip" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Auth_User" ALTER COLUMN "last_login_date" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Auth_User" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."Auth_User_role_enum"`);
        await queryRunner.query(`ALTER TABLE "Auth_User" ADD "role" character varying(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP CONSTRAINT "UQ_69ae8de23f6f85b6edcc597fd68"`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP COLUMN "authUserUserId"`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP COLUMN "permanent_address"`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP COLUMN "gender"`);
        await queryRunner.query(`DROP TYPE "public"."App_User_gender_enum"`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD "permenant_address" character varying(128) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD "sex" character varying(8) NOT NULL`);
    }

}
