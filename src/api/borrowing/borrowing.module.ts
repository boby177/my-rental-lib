import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrowing } from './entities/borrowing.entity';
import { BorrowingController } from './controllers/borrowing.controller';
import { BorrowingService } from './services/borrowing.service';
import { BorrowingRepository } from './repositories/borrowing.repository';
import { BookRepository } from '../book/repositories/book.repository';
import { MemberRepository } from '../member/repositories/member.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Borrowing])],
  controllers: [BorrowingController],
  providers: [
    BorrowingService,
    BorrowingRepository,
    MemberRepository,
    BookRepository,
  ],
})
export class BorrowingModule {}
