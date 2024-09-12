import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PaginateQuery } from 'nestjs-paginate';
import { BorrowingRepository } from '../repositories/borrowing.repository';
import { BorrowingCreateDTO } from './dtos/borrowing-create.dto';
import { MemberRepository } from 'src/api/member/repositories/member.repository';
import { BookRepository } from 'src/api/book/repositories/book.repository';
import { BorrowingStatus } from '@common/enums/borrowing-status.enum';
import { BorrowingUpdateDTO } from './dtos/borrowing-update.dto';

@Injectable()
export class BorrowingService {
  constructor(
    private readonly borrowingRepo: BorrowingRepository,
    private readonly memberRepo: MemberRepository,
    private readonly bookRepo: BookRepository,
  ) {}

  async findAllBorrowings(query: PaginateQuery) {
    const borrowings =
      await this.borrowingRepo.getAllBorrowingPagination(query);

    return {
      status: HttpStatus.OK,
      message: 'Successfully get all data borrowings',
      data: borrowings.data,
      meta: borrowings.meta,
      links: borrowings.links,
    };
  }

  async findById(id: string) {
    const borrowing = await this.borrowingRepo.findBorrowingById(id);

    return {
      status: HttpStatus.OK,
      message: 'Successfully get data borrowings',
      data: borrowing,
    };
  }

  async findByCode(code: string) {
    const borrowing = await this.borrowingRepo.findBorrowingByCode(code);

    return {
      status: HttpStatus.OK,
      message: 'Successfully get data borrowings',
      data: borrowing,
    };
  }

  async addNewBorrowing(borrowingCreateDTO: BorrowingCreateDTO) {
    const { code, bookCode, memberCode } = borrowingCreateDTO;

    // Checking data existing code Borrowing
    await this.borrowingRepo.borrowingCodeValidation(code);

    // Checking data code Member
    const member = await this.memberRepo.findMemberByCode(memberCode);

    // Check is member already borrowed 2 books and not penalized
    if (member.borrowedBooks.length === 2) {
      throw new UnprocessableEntityException(
        'This member has already borrowed 2 books, please return another book first',
      );
    } else if (member.isPenalized === true) {
      throw new UnprocessableEntityException(
        'This member status is penalized, please wait more less 3 days to borrow the book again',
      );
    }

    // Checking data code Book
    const book = await this.bookRepo.findBookByCode(bookCode);

    // Check data stock from the book
    if (book.stock === 0) {
      throw new UnprocessableEntityException(
        'This book is out of stock, please restock the book or borrow another book',
      );
    } else {
      // Update data book stock
      await this.bookRepo.update(book.id, {
        stock: book.stock - 1,
      });
    }

    // Get data date now
    const dateNow = new Date();
    dateNow.toISOString().split('T')[0];

    const newBorrowing = this.borrowingRepo.create({
      code,
      borrowingDate: dateNow,
      status: BorrowingStatus.BORROWED,
      member: {
        id: member.id,
      },
      book: {
        id: book.id,
      },
    });

    await this.borrowingRepo.save(newBorrowing);
    return {
      status: HttpStatus.CREATED,
      message: `New data borrowing with code ${code} has been created`,
      data: newBorrowing,
    };
  }

  async returnedBook(id: string, borrowingUpdateDTO: BorrowingUpdateDTO) {
    const { memberCode, bookCode } = borrowingUpdateDTO;

    // Check data member code
    const member = await this.memberRepo.findMemberByCode(memberCode);

    // Check data code Book
    const book = await this.bookRepo.findBookByCode(bookCode);

    // Check data borrowing
    const borrowing = await this.borrowingRepo.findBorrowingById(id);
    let borrowedBooksMember = member.borrowedBooks;
    let borrowedBooksCount = book.borrowedBooks;

    // Check book member has borrowed
    const borrowedBook = borrowedBooksCount.find(
      (borrowed) => borrowed.code === borrowing.code,
    );

    if (borrowedBook === undefined) {
      throw new UnprocessableEntityException(
        `This member is not borrowing book ${book.title}`,
      );
    } else {
      const indexBookMember = borrowedBooksMember.findIndex(
        (borrowed) => borrowed.code === borrowing.code,
      );

      const indexBook = borrowedBooksCount.findIndex(
        (borrowed) => borrowed.code === borrowing.code,
      );

      // Remove data borrowing on table member
      if (indexBookMember !== -1) {
        borrowedBooksMember.splice(indexBookMember, 1);
      }

      // Remove data borrowing on table book
      if (indexBook !== -1) {
        borrowedBooksCount.splice(indexBook, 1);
      }
    }

    // Check date returned book by member
    const borrowedDate = new Date(borrowing.borrowingDate);

    const dateNow = new Date();
    dateNow.toISOString().split('T')[0];

    // Comparing time distance borrowed date with date now
    const comparingInMs = borrowedDate.getTime() - dateNow.getTime();

    // Calculating the difference in days
    const comparingInDays = Math.abs(comparingInMs / (1000 * 60 * 60 * 24));

    // Update data borrowing book by member
    if (comparingInDays > 7) {
      await this.borrowingRepo.update(member.id, {
        member: {
          isPenalized: true,
          borrowedBooks: borrowedBooksMember,
        },
        book: {
          borrowedBooks: borrowedBooksCount,
        },
      });

      // TODO: Running cron job to make it data penalized false into 3 days later
    } else {
      await this.memberRepo.update(member.id, {
        borrowedBooks: borrowedBooksMember,
      });

      await this.bookRepo.update(book.id, {
        borrowedBooks: borrowedBooksMember,
      });
    }

    // Update stock book
    await this.bookRepo.update(book.id, {
      stock: book.stock + 1,
      borrowedBooks: borrowedBooksCount,
    });

    // Update status borrowing
    await this.borrowingRepo.update(borrowing.id, {
      status: BorrowingStatus.RETURNED,
    });

    // Get data updated member
    const updatedMember = await this.memberRepo.findMemberByCode(member.code);

    // Return response based on member status penalizaed
    if (updatedMember.isPenalized === false) {
      return {
        status: HttpStatus.OK,
        message: `Successfully returned book ${book.title} by member ${member.code}`,
        data: updatedMember,
      };
    } else {
      return {
        status: HttpStatus.OK,
        message: `Successfully returned book ${book.title} by member ${member.name}`,
        warning:
          'This member got penalized, and only can borrowing book again in 3 days later',
        data: updatedMember,
      };
    }
  }
}
