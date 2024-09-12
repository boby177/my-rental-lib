import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Borrowing } from '../entities/borrowing.entity';

@Injectable()
export class BorrowingRepository extends Repository<Borrowing> {
  constructor(private dataSource: DataSource) {
    super(Borrowing, dataSource.createEntityManager());
  }

  async getAllBorrowingPagination(
    query: PaginateQuery,
  ): Promise<Paginated<Borrowing>> {
    try {
      const paginated = await paginate(query, this, {
        sortableColumns: ['code', 'status', 'borrowingDate'],
        searchableColumns: ['code', 'status', 'borrowingDate'],
        maxLimit: 9999999,
        relations: ['book', 'member'],
      });

      return paginated;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findBorrowingById(id: string): Promise<Borrowing> {
    try {
      const Borrowing = await this.findOne({
        where: { id },
        relations: ['book', 'member'],
        select: [
          'id',
          'code',
          'status',
          'borrowingDate',
          'returnedDate',
          'member',
          'book',
        ],
      });

      if (!Borrowing) {
        throw new NotFoundException('Data borrowing not found');
      }

      return Borrowing;
    } catch (error) {
      console.error(error);
      throw new NotFoundException(error.message);
    }
  }

  async findBorrowingByCode(code: string): Promise<Borrowing> {
    try {
      const Borrowing = await this.findOne({
        where: { code },
        relations: ['book', 'member'],
        select: [
          'id',
          'code',
          'status',
          'borrowingDate',
          'returnedDate',
          'member',
          'book',
        ],
      });

      if (!Borrowing) {
        throw new NotFoundException(`Data borrowing code ${code} is not found`);
      }

      return Borrowing;
    } catch (error) {
      console.error(error);
      throw new NotFoundException(error.message);
    }
  }

  async borrowingCodeValidation(code: string) {
    try {
      const borrowing = await this.findOne({
        where: { code },
        select: ['id', 'code'],
      });

      if (borrowing !== null) {
        throw new UnprocessableEntityException(
          `Borrowing data with code ${code} is already exist`,
        );
      }

      return null;
    } catch (error) {
      console.error(error);
      throw new UnprocessableEntityException(error.message);
    }
  }
}
