import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Book } from '../entities/book.entity';

@Injectable()
export class BookRepository extends Repository<Book> {
  constructor(private dataSource: DataSource) {
    super(Book, dataSource.createEntityManager());
  }

  async getAllBookPagination(query: PaginateQuery): Promise<Paginated<Book>> {
    try {
      const paginated = await paginate(query, this, {
        sortableColumns: ['code', 'author', 'title', 'stock'],
        searchableColumns: ['code', 'author', 'title', 'stock'],
        maxLimit: 9999999,
        relations: ['borrowedBooks'],
      });

      return paginated;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findBookById(id: string): Promise<Book> {
    try {
      const book = await this.findOne({
        where: { id },
        relations: ['borrowedBooks'],
        select: ['id', 'code', 'author', 'title', 'stock', 'borrowedBooks'],
      });

      if (!book) {
        throw new NotFoundException('Data book not found');
      }

      return book;
    } catch (error) {
      console.error(error);
      throw new NotFoundException(error.message);
    }
  }

  async findBookByCode(code: string): Promise<Book> {
    try {
      const book = await this.findOne({
        where: { code },
        relations: ['borrowedBooks'],
        select: ['id', 'code', 'author', 'title', 'stock', 'borrowedBooks'],
      });

      if (!book) {
        throw new NotFoundException(`Data book code ${code} is not found`);
      }

      return book;
    } catch (error) {
      console.error(error);
      throw new NotFoundException(error.message);
    }
  }

  async bookCodeValidation(code: string) {
    try {
      const book = await this.findOne({
        where: { code },
        select: ['id', 'code'],
      });

      if (book !== null) {
        throw new UnprocessableEntityException(
          `Book data with code ${code} is already exist`,
        );
      }

      return null;
    } catch (error) {
      console.error(error);
      throw new UnprocessableEntityException(error.message);
    }
  }
}
