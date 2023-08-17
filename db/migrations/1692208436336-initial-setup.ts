import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSetup1692208436336 implements MigrationInterface {
    name = 'InitialSetup1692208436336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "App_User" ("user_id" SERIAL NOT NULL, "first_name" character varying(64) NOT NULL, "last_name" character varying(64) NOT NULL, "email" character varying(64) NOT NULL, "civil_status" character varying(32) NOT NULL, "phone_number" character varying(10) NOT NULL, "birth_place" character varying(64) NOT NULL, "occupation" character varying(64) NOT NULL, "sex" character varying(8) NOT NULL, "dob" TIMESTAMP, "postal_code" integer NOT NULL, "permenant_address" character varying(128) NOT NULL, CONSTRAINT "PK_554628c1554f5a9d40526854053" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "PID_Request" ("request_id" SERIAL NOT NULL, "pid_type" character varying NOT NULL, "req_date" TIMESTAMP NOT NULL, "req_status" character varying NOT NULL, "user_id" integer, CONSTRAINT "REL_59b448837239e59125763e7632" UNIQUE ("user_id"), CONSTRAINT "PK_8b3222f27fab3176a4169abbb45" PRIMARY KEY ("request_id"))`);
        await queryRunner.query(`CREATE TABLE "NIC_Request" ("request_id" integer NOT NULL, "birthcert_no" character varying(128) NOT NULL, "birthcert_url" character varying(1024) NOT NULL, CONSTRAINT "PK_7f3bf802d5af69e7ed63847b350" PRIMARY KEY ("request_id"))`);
        await queryRunner.query(`CREATE TABLE "Auth_User" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(36) NOT NULL, "password" character varying(64) NOT NULL, "role" character varying(36) NOT NULL, "created_date" TIMESTAMP NOT NULL, "last_login_date" TIMESTAMP NOT NULL, "password_expiry_date" TIMESTAMP NOT NULL, "is_locked" boolean NOT NULL, "last_login_ip" character varying NOT NULL, CONSTRAINT "UQ_6a754d9d5c80c57a4e793597e01" UNIQUE ("email"), CONSTRAINT "PK_1976d99b1cf8439a3fbf9d4cddd" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`ALTER TABLE "PID_Request" ADD CONSTRAINT "FK_59b448837239e59125763e7632f" FOREIGN KEY ("user_id") REFERENCES "App_User"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "NIC_Request" ADD CONSTRAINT "FK_7f3bf802d5af69e7ed63847b350" FOREIGN KEY ("request_id") REFERENCES "PID_Request"("request_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "NIC_Request" DROP CONSTRAINT "FK_7f3bf802d5af69e7ed63847b350"`);
        await queryRunner.query(`ALTER TABLE "PID_Request" DROP CONSTRAINT "FK_59b448837239e59125763e7632f"`);
        await queryRunner.query(`DROP TABLE "Auth_User"`);
        await queryRunner.query(`DROP TABLE "NIC_Request"`);
        await queryRunner.query(`DROP TABLE "PID_Request"`);
        await queryRunner.query(`DROP TABLE "App_User"`);
    }

}
