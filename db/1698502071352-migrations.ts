import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1698502071352 implements MigrationInterface {
    name = 'Migrations1698502071352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Auth_User_role_enum" AS ENUM('app-user', 'gov-officer', 'organisation')`);
        await queryRunner.query(`CREATE TABLE "Auth_User" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(36) NOT NULL, "password" character varying(64) NOT NULL, "role" "public"."Auth_User_role_enum" NOT NULL, "created_date" TIMESTAMP NOT NULL, "last_login_date" TIMESTAMP, "password_expiry_date" TIMESTAMP NOT NULL, "is_locked" boolean NOT NULL, "last_login_ip" character varying, CONSTRAINT "UQ_6a754d9d5c80c57a4e793597e01" UNIQUE ("email"), CONSTRAINT "PK_1976d99b1cf8439a3fbf9d4cddd" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."App_User_civil_status_enum" AS ENUM('single', 'married', 'widowed', 'separated', 'divorced')`);
        await queryRunner.query(`CREATE TYPE "public"."App_User_gender_enum" AS ENUM('male', 'female')`);
        await queryRunner.query(`CREATE TABLE "App_User" ("user_id" uuid NOT NULL, "first_name" character varying(64) NOT NULL, "last_name" character varying(64) NOT NULL, "email" character varying(64) NOT NULL, "civil_status" "public"."App_User_civil_status_enum" NOT NULL, "phone_number" character varying(10) NOT NULL, "birth_place" character varying(64) NOT NULL, "occupation" character varying(64) NOT NULL, "gender" "public"."App_User_gender_enum" NOT NULL, "dob" TIMESTAMP, "postal_code" character varying NOT NULL, "permanent_address" character varying(128) NOT NULL, CONSTRAINT "PK_554628c1554f5a9d40526854053" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "PID_Request" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pid_type" character varying NOT NULL, "req_date" TIMESTAMP NOT NULL, "req_status" character varying NOT NULL, CONSTRAINT "PK_59b448837239e59125763e7632f" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "NIC_Request" ("request_id" uuid NOT NULL, "birthcert_no" character varying(128) NOT NULL, "birthcert_url" character varying(1024) NOT NULL, CONSTRAINT "PK_7f3bf802d5af69e7ed63847b350" PRIMARY KEY ("request_id"))`);
        await queryRunner.query(`ALTER TABLE "App_User" ADD CONSTRAINT "FK_554628c1554f5a9d40526854053" FOREIGN KEY ("user_id") REFERENCES "Auth_User"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PID_Request" ADD CONSTRAINT "FK_59b448837239e59125763e7632f" FOREIGN KEY ("user_id") REFERENCES "App_User"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "NIC_Request" ADD CONSTRAINT "FK_7f3bf802d5af69e7ed63847b350" FOREIGN KEY ("request_id") REFERENCES "PID_Request"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "NIC_Request" DROP CONSTRAINT "FK_7f3bf802d5af69e7ed63847b350"`);
        await queryRunner.query(`ALTER TABLE "PID_Request" DROP CONSTRAINT "FK_59b448837239e59125763e7632f"`);
        await queryRunner.query(`ALTER TABLE "App_User" DROP CONSTRAINT "FK_554628c1554f5a9d40526854053"`);
        await queryRunner.query(`DROP TABLE "NIC_Request"`);
        await queryRunner.query(`DROP TABLE "PID_Request"`);
        await queryRunner.query(`DROP TABLE "App_User"`);
        await queryRunner.query(`DROP TYPE "public"."App_User_gender_enum"`);
        await queryRunner.query(`DROP TYPE "public"."App_User_civil_status_enum"`);
        await queryRunner.query(`DROP TABLE "Auth_User"`);
        await queryRunner.query(`DROP TYPE "public"."Auth_User_role_enum"`);
    }

}
