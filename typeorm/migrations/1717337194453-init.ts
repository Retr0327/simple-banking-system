import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1717337194453 implements MigrationInterface {
  name = 'Init1717337194453';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`transactions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`account_id\` char(26) NULL, \`accountBalance\` int NOT NULL, \`amount\` int NOT NULL, \`target_account_id\` char(26) NULL, \`targetAccountBalance\` int NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`accounts\` (\`id\` char(26) NOT NULL, \`name\` text NOT NULL, \`email\` varchar(64) NOT NULL, \`password\` varchar(128) NOT NULL, \`balance\` int NOT NULL DEFAULT '0', \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_ee66de6cdc53993296d1ceb8aa\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` ADD CONSTRAINT \`FK_49c0d6e8ba4bfb5582000d851f0\` FOREIGN KEY (\`account_id\`) REFERENCES \`accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` ADD CONSTRAINT \`FK_8d4302b4adfc4e60d1d8a0164a4\` FOREIGN KEY (\`target_account_id\`) REFERENCES \`accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`transactions\` DROP FOREIGN KEY \`FK_8d4302b4adfc4e60d1d8a0164a4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transactions\` DROP FOREIGN KEY \`FK_49c0d6e8ba4bfb5582000d851f0\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_ee66de6cdc53993296d1ceb8aa\` ON \`accounts\``,
    );
    await queryRunner.query(`DROP TABLE \`accounts\``);
    await queryRunner.query(`DROP TABLE \`transactions\``);
  }
}
