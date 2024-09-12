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

    for (const data of book) {
      let item = {};
      if (data.borrowedBooks.length === 0) {
        item = [];
      } else {
        item = data;
      }

      borrowedBook.push(item);
    }

    const nonEmptyArrays = borrowedBook.filter(
      (item) => !(Array.isArray(item) && item.length === 0),
    );

    return {
      status: HttpStatus.OK,
      message: 'Successfully get data borrowed books',
      data: nonEmptyArrays,
    };
  }

  async getNotBorrowedBooks() {
    const book = await this.bookRepo.getAllBook();
    let borrowedBook = [];

    // book.filter((item) => Array.isArray(item) && item.length === 0);

    // borrowedBook.push(book);

    for (const data of book) {
      let item = {};
      if (data.borrowedBooks.length === 0) {
        item = [];
      } else {
        item = data;
      }

      borrowedBook.push(item);
    }

    const nonEmptyArrays = borrowedBook.filter(
      (item) => !(Array.isArray(item) && item.length === 0),
    );

    return {
      status: HttpStatus.OK,
      message: 'Successfully get data books',
      data: nonEmptyArrays,
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
      data: {
        id: newBook.id,
        code: newBook.code,
        title: newBook.title,
        author: newBook.author,
        stock: newBook.stock,
        createdAt: newBook.createdAt,
        createdBy: newBook.createdBy,
        updatedAt: newBook.updatedAt,
        deletedAt: newBook.deletedAt,
      },
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
      data: {
        id: updatedBook.id,
        code: updatedBook.code,
        title: updatedBook.title,
        author: updatedBook.author,
        stock: updatedBook.stock,
        createdAt: updatedBook.createdAt,
        createdBy: updatedBook.createdBy,
        updatedAt: updatedBook.updatedAt,
        deletedAt: updatedBook.deletedAt,
      },
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
