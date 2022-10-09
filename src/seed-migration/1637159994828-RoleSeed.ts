import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { RoleSeed } from '../master/role-seed';

export class RoleSeed1637159994828 implements MigrationInterface {
  name = 'RoleSeed1637159994828';

  public async up(): Promise<void> {
    await this.insertNewRecord('role', RoleSeed);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE "role" CASCADE`);
  }

  public async insertNewRecord(table, seedData): Promise<void> {
    for (const data of seedData) {
      const isRecordExist = await this.findByName(table, data);
      if (!isRecordExist) {
        const taskType = getRepository(table).create(data);
        await getRepository(table).save(taskType);
      }
    }
  }

  public async findByName(table, data): Promise<boolean> {
    const result = await getRepository(table).findOne(data);
    return result ? true : false;
  }
}
