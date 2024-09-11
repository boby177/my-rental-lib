import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Logger } from '@nestjs/common';
import { Member } from 'src/api/member/entities/member.entity';

export default class MemberSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const member = dataSource.getRepository(Member);

    Logger.log('Creating members seeding...');

    await member.save([
      {
        code: 'M001',
        name: 'Angga',
      },
      {
        code: 'M002',
        name: 'Ferry',
      },
      {
        code: 'M003',
        name: 'Putri',
      },
      {
        code: 'M004',
        name: 'Boby',
      },
      {
        code: 'M005',
        name: 'Indri',
      },
    ]);

    Logger.log('Seeding members done.');
  }
}
