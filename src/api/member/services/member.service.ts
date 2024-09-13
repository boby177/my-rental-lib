import { HttpStatus, Injectable } from '@nestjs/common';
import { PaginateQuery } from 'nestjs-paginate';
import { MemberRepository } from '../repositories/member.repository';
import { MemberCreateDTO } from './dtos/member-create.dto';
import { MemberUpdateDTO } from './dtos/member-update.dto';
import { BorrowingRepository } from 'src/api/borrowing/repositories/borrowing.repository';

@Injectable()
export class MemberService {
  constructor(
    private readonly memberRepo: MemberRepository,
    private readonly borrowingRepo: BorrowingRepository,
  ) {}

  async findAllMembers(query: PaginateQuery) {
    const members = await this.memberRepo.getAllMemberPagination(query);

    return {
      status: HttpStatus.OK,
      message: 'Successfully get all data members',
      data: members.data,
      meta: members.meta,
      links: members.links,
    };
  }

  async findById(id: string) {
    const member = await this.memberRepo.findMemberById(id);

    return {
      status: HttpStatus.OK,
      message: 'Successfully get data members',
      data: member,
    };
  }

  async findByCode(code: string) {
    const member = await this.memberRepo.findMemberByCode(code);

    return {
      status: HttpStatus.OK,
      message: 'Successfully get data members',
      data: member,
    };
  }

  async findBorrowedBooksMember(code: string) {
    const member = await this.memberRepo.findMemberByCode(code);

    const borrowing = await this.borrowingRepo.find({
      where: {
        member: {
          id: member.id,
        },
      },
      relations: { book: true },
      select: {
        id: true,
        code: true,
        status: true,
        borrowingDate: true,
        returnedDate: true,
        book: {
          id: true,
          code: true,
          title: true,
          author: true,
        },
      },
    });

    if (borrowing.length === 0) {
      return {
        status: HttpStatus.OK,
        bookBorrowed: 0,
        message: 'This member is not borrowing any book',
      };
    } else {
      return {
        status: HttpStatus.OK,
        bookBorrowed: borrowing.length,
        books: borrowing,
      };
    }
  }

  async addNewMember(memberCreateDto: MemberCreateDTO) {
    const { name, code } = memberCreateDto;

    // Checking data existing code member
    await this.memberRepo.memberCodeValidation(code);

    const newMember = this.memberRepo.create({
      code,
      name,
      isPenalized: false,
    });

    await this.memberRepo.save(newMember);
    return {
      status: HttpStatus.CREATED,
      message: `New data member ${name} has been created`,
      data: newMember,
    };
  }

  async updateMember(id: string, memberUpdateDto: MemberUpdateDTO) {
    const { name, code, isPenalized } = memberUpdateDto;

    const member = await this.memberRepo.findMemberById(id);
    await this.memberRepo.update(member.id, {
      name,
      code,
      isPenalized,
    });

    // Get newest updated data from member
    const updatedMember = await this.memberRepo.findMemberById(id);

    return {
      status: HttpStatus.OK,
      message: `Data member ${member.name} has been updated`,
      data: updatedMember,
    };
  }

  async deleteMember(id: string) {
    const member = await this.memberRepo.findMemberById(id);
    await this.memberRepo.delete(member.id);

    return {
      status: HttpStatus.OK,
      message: `Data member ${member.name} has been deleted`,
    };
  }
}
