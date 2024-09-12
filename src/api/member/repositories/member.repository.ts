import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Member } from '../entities/member.entity';

@Injectable()
export class MemberRepository extends Repository<Member> {
  constructor(private dataSource: DataSource) {
    super(Member, dataSource.createEntityManager());
  }

  async getAllMemberPagination(
    query: PaginateQuery,
  ): Promise<Paginated<Member>> {
    try {
      const paginated = await paginate(query, this, {
        sortableColumns: ['name', 'code', 'isPenalized'],
        searchableColumns: ['name', 'code', 'isPenalized'],
        maxLimit: 9999999,
      });

      return paginated;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findMemberById(id: string): Promise<Member> {
    try {
      const member = await this.findOne({
        where: { id },
        relations: ['borrowedBooks'],
        select: [
          'id',
          'code',
          'name',
          'isPenalized',
          'createdAt',
          'borrowedBooks',
        ],
      });

      if (!member) {
        throw new NotFoundException('Data member not found');
      }

      return member;
    } catch (error) {
      console.error(error);
      throw new NotFoundException(error.message);
    }
  }

  async findMemberByCode(code: string): Promise<Member> {
    try {
      const member = await this.findOne({
        where: { code },
        relations: ['borrowedBooks'],
        select: [
          'id',
          'code',
          'name',
          'isPenalized',
          'createdAt',
          'borrowedBooks',
        ],
      });

      if (!member) {
        throw new NotFoundException(`Data member code ${code} is not found`);
      }

      return member;
    } catch (error) {
      console.error(error);
      throw new NotFoundException(error.message);
    }
  }

  async memberCodeValidation(code: string) {
    try {
      const member = await this.findOne({
        where: { code },
        select: ['id', 'code'],
      });

      if (member !== null) {
        throw new UnprocessableEntityException(
          `Member data with code ${code} is already exist`,
        );
      }

      return null;
    } catch (error) {
      console.error(error);
      throw new UnprocessableEntityException(error.message);
    }
  }
}
