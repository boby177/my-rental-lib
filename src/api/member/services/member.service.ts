import { HttpStatus, Injectable } from '@nestjs/common';
import { PaginateQuery } from 'nestjs-paginate';
import { MemberRepository } from '../repositories/member.repository';
import { MemberCreateDTO } from './dtos/member-create.dto';
import { MemberUpdateDTO } from './dtos/member-update.dto';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepo: MemberRepository) {}

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

    if (member.borrowedBooks.length === 0) {
      return {
        status: HttpStatus.OK,
        bookBorrowed: 0,
        message: 'This member is not borrowing any book',
      };
    } else {
      return {
        status: HttpStatus.OK,
        bookBorrowed: member.borrowedBooks.length,
        books: member.borrowedBooks,
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
      data: {
        id: newMember.id,
        code: newMember.code,
        name: newMember.name,
        isPenalized: newMember.isPenalized,
        createdAt: newMember.createdAt,
        createdBy: newMember.createdBy,
        updatedAt: newMember.updatedAt,
        deletedAt: newMember.deletedAt,
      },
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
      data: {
        id: updatedMember.id,
        code: updatedMember.code,
        name: updatedMember.name,
        isPenalized: updatedMember.isPenalized,
        createdAt: updatedMember.createdAt,
        createdBy: updatedMember.createdBy,
        updatedAt: updatedMember.updatedAt,
        deletedAt: updatedMember.deletedAt,
      },
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
