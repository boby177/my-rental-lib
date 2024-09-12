import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Logger } from '@nestjs/common';
import { Book } from 'src/api/book/entities/book.entity';

export default class BookSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const book = dataSource.getRepository(Book);

    Logger.log('Creating books seeding...');

    await book.save([
      {
        code: 'JK-45',
        title: 'Harry Potter',
        author: 'J.K Rowling',
        stock: 1,
      },
      {
        code: 'SHR-1',
        title: 'A Study in Scarlet',
        author: 'Arthur Conan Doyle',
        stock: 1,
      },
      {
        code: 'TW-11',
        title: 'Twilight',
        author: 'Stephenie Meyer',
        stock: 1,
      },
      {
        code: 'HOB-83',
        title: 'The Hobbit, or There and Back Again',
        author: 'J.R.R. Tolkien',
        stock: 1,
      },
      {
        code: 'NRN-7',
        title: 'The Lion, the Witch and the Wardrobe',
        author: 'C.S. Lewis',
        stock: 1,
      },
    ]);

    Logger.log('Seeding books done.');
  }
}
