import fs from 'fs/promises';
import path from 'path';
import { BorrowedRecord } from '../models/borowedRecord';
import { Book } from '../models/books';

type BookInput = number | number[];

const borrowsDataPath = path.join(__dirname, '../data/borrows.json');
const booksDataPath = path.join(__dirname, '../data/books.json');

export async function borrowBooks(userId: number, bookInput: BookInput) {
  const borrowsData = await fs.readFile(borrowsDataPath, 'utf-8').catch(() => '[]');
  const borrowRecords: BorrowedRecord[] = JSON.parse(borrowsData.trim() || '[]');

  const booksData = await fs.readFile(booksDataPath, 'utf-8').catch(() => '[]');
  const books: Book[] = JSON.parse(booksData.trim() || '[]');

  const bookIds = Array.isArray(bookInput) ? bookInput : [bookInput];
  const now = new Date();
  const borrowedDate = now.toISOString();
  const dueDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(); // +7 ngày

  // Kiểm tra số lượng sách có sẵn
  for (const bookId of bookIds) {
    const book = books.find(b => b.id === bookId);
    if (!book || book.available <= 0) {
      console.log(`❌ Sách ID ${bookId} không có sẵn hoặc đã hết.`);
      return;
    }
  }

  // Tạo các record mượn sách mới
  const newRecords: BorrowedRecord[] = bookIds.map(bookId => {
    const book = books.find(b => b.id === bookId);
    if (book) {
      book.available -= 1; // Giảm số lượng sách có sẵn
    }

    return {
      id: borrowRecords.length > 0 ? borrowRecords[borrowRecords.length - 1].id + 1 : 1 + borrowRecords.length,
      userId,
      bookId,
      borrowedDate,
      dueDate,
      status: 'borrowed',
      fine: 0
    };
  });

  borrowRecords.push(...newRecords);
  await fs.writeFile(borrowsDataPath, JSON.stringify(borrowRecords, null, 2));
  await fs.writeFile(booksDataPath, JSON.stringify(books, null, 2));

  console.log(`✅ Người dùng ${userId} đã mượn ${bookIds.length} sách thành công.`);
}
