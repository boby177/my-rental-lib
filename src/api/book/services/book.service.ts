import { HttpStatus, Injectable } from '@nestjs/common';
import { PaginateQuery } from 'nestjs-paginate';
import { BookRepository } from '../repositories/book.repository';
import { BookCreateDTO } from './dtos/book-create.dto';
import { BookUpdateDTO } from './dtos/book-update.dto';

@Injectable()
export class BookService {
  constructor(private readonly bookRepo: BookRepository) {}

  async findAllBooks(query: PaginateQuery) {
    const books = await this.bookRepo.getAllBookPagination(query);

    return {
      status: HttpStatus.OK,
      message: 'Successfully get all data books',
      data: books.data,
      meta: books.meta,
      links: books.links,
    };
  }

  async findById(id: string) {
    const book = await this.bookRepo.findBookById(id);

    return {
      status: HttpStatus.OK,
      message: 'Successfully get data books',
      data: book,
    };
  }

  async findByCode(code: string) {
    const book = await this.bookRepo.findBookByCode(code);

    return {
      status: HttpStatus.OK,
      message: 'Successfully get data books',
      data: book,
    };
  }

  async getBorrowedBooks() {
    const book = await this.bookRepo.getAllBook();
    let borrowedBook = [];

    // Get data with field borrowed book is not empty
    for (const item of book) {
      let data = {};

      if (item.borrowedBooks.length !== 0) {
        data = item;
        borrowedBook.push(data);
      }
    }

    return {
      status: HttpStatus.OK,
      message: 'Successfully get data borrowed books',
      data: borrowedBook,
    };
  }

  async getNotBorrowedBooks() {
    const book = await this.bookRepo.getAllBook();
    let borrowedBook = [];

    // Get data with field borrowed book is empty
    for (const item of book) {
      let data = {};

      if (item.borrowedBooks.length === 0) {
        data = item;
        borrowedBook.push(data);
      }
    }

    return {
      status: HttpStatus.OK,
      message: 'Successfully get data books',
      data: borrowedBook,
    };
  }

  async addNewBook(bookCreateDTO: BookCreateDTO) {
    const { code, title, author, stock } = bookCreateDTO;

    // Checking data existing code book
    await this.bookRepo.bookCodeValidation(code);

    const newBook = this.bookRepo.create({
      code,
      title,
      author,
      stock,
    });

    await this.bookRepo.save(newBook);
    return {
      status: HttpStatus.CREATED,
      message: `New data book ${title} has been created`,
      data: newBook,
    };
  }

  async updateBook(id: string, bookUpdateDTO: BookUpdateDTO) {
    const { code, title, author, stock } = bookUpdateDTO;

    const book = await this.bookRepo.findBookById(id);
    await this.bookRepo.update(book.id, {
      code,
      title,
      author,
      stock,
    });

    // Get newest updated data from book
    const updatedBook = await this.bookRepo.findBookById(id);

    return {
      status: HttpStatus.OK,
      message: `Data book ${updatedBook.title} has been updated`,
      data: updatedBook,
    };
  }

  async deleteBook(id: string) {
    const book = await this.bookRepo.findBookById(id);
    await this.bookRepo.delete(book.id);

    return {
      status: HttpStatus.OK,
      message: `Data book ${book.title} has been deleted`,
    };
  }
}
