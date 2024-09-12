import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Paginate, PaginateQuery, PaginatedSwaggerDocs } from 'nestjs-paginate';
import { PaginateResult } from '@common/base';
import { BorrowingService } from '../services/borrowing.service';
import { BorrowingReadDTO } from '../services/dtos/borrowing-read.dto';
import { BorrowingCreateDTO } from '../services/dtos/borrowing-create.dto';
import { BorrowingUpdateDTO } from '../services/dtos/borrowing-update.dto';

@Controller('borrowing')
@ApiBearerAuth()
@ApiTags('Web - Borrowing API')
export class BorrowingController {
  constructor(private readonly borrowing: BorrowingService) {}

  @Get()
  @ApiOperation({ summary: 'Get all data borrowings' })
  @PaginatedSwaggerDocs(BorrowingReadDTO, {
    sortableColumns: ['code', 'status', 'borrowingDate'],
    searchableColumns: ['code', 'status', 'borrowingDate'],
    maxLimit: 9999999,
  })
  async getAllborrowings(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginateResult> {
    return await this.borrowing.findAllBorrowings(query);
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Get borrowing by id' })
  @ApiResponse({
    status: 200,
    description: 'Successfully get data borrowing',
    type: BorrowingReadDTO,
  })
  async findborrowingById(@Param('id') id: string) {
    return await this.borrowing.findById(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get borrowing by code' })
  @ApiResponse({
    status: 200,
    description: 'Successfully get data borrowing',
    type: BorrowingReadDTO,
  })
  async findborrowingByCode(@Param('code') code: string) {
    return await this.borrowing.findByCode(code);
  }

  @Post('borrow-book')
  @ApiOperation({ summary: 'Create new data borrowing' })
  @ApiBody({ type: BorrowingCreateDTO })
  @ApiResponse({
    status: 201,
    description: 'New data borrowing has been created',
    type: BorrowingReadDTO,
  })
  async addNewborrowing(@Body() borrowingCreateDTO: BorrowingCreateDTO) {
    return await this.borrowing.addNewBorrowing(borrowingCreateDTO);
  }

  @Patch('returned-book/:id')
  @ApiOperation({ summary: 'Return borrowed books' })
  @ApiBody({ type: BorrowingUpdateDTO })
  @ApiResponse({
    status: 200,
    description: 'Book has been returned',
  })
  async returnedBorrowing(
    @Param('id') id: string,
    @Body() borrowingUpdateDTO: BorrowingUpdateDTO,
  ) {
    return await this.borrowing.returnedBook(id, borrowingUpdateDTO);
  }
}
