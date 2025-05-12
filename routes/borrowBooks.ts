import fs from 'fs/promises';
import path from 'path';
import { BorrowedRecord } from '../models/borowedRecord';

type BookInput = number | number[];

const dataPath = path.join(__dirname, '../data/borrows.json');

async function borrowBooks(userId: number, bookInput: BookInput) {
  const data = await fs.readFile(dataPath, 'utf-8').catch(() => '[]');
  const records: BorrowedRecord[] = JSON.parse(data.trim() || '[]');

  const bookIds = Array.isArray(bookInput) ? bookInput : [bookInput];
  const now = new Date();
  const borrowedDate = now.toISOString();
  const dueDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(); // +7 ngày

  const newRecords: BorrowedRecord[] = bookIds.map(bookId => {
    return {
      id: records.length > 0 ? records[records.length - 1].id + 1 : 1 + records.length,
      userId,
      bookId,
      borrowedDate,
      dueDate,
      status: 'borrowed',
      fine: 0
    };
  });

  records.push(...newRecords);
  await fs.writeFile(dataPath, JSON.stringify(records, null, 2));

  console.log(`✅ Người dùng ${userId} đã mượn ${bookIds.length} sách thành công.`);
}

// --- CLI Entry Point ---
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('How to use:');
  console.log('1 Book:    npx ts-node routes/borrowBook.ts <userId> <bookId>');
  console.log('Many book: npx ts-node routes/borrowBook.ts <userId> "[1,2,3]"');
} else {
  const userId = parseInt(args[0]);
  let bookInput: BookInput;

  try {
    bookInput = JSON.parse(args[1]); // JSON mảng như "[1,2,3]"
  } catch {
    bookInput = parseInt(args[1]); // đơn số
  }

  borrowBooks(userId, bookInput).catch(console.error);
}
