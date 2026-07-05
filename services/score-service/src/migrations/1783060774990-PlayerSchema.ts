import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitSchema1783060774990 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'player',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'email', type: 'varchar', isNullable: true, isUnique: true },
          { name: 'passwordHash', type: 'varchar', isNullable: true },
          { name: 'currentScore', type: 'int', default: 0 },
          { name: 'highScore', type: 'int', default: 0 },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp', default: 'now()' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('player');
  }
}
