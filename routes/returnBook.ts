import fs from 'fs/promises';
import path from 'path';
import { BorrowedRecord } from '../models/borowedRecord';

const dataPath = path.join(__dirname, '../data/borrows.json');

export async function returnBook(userId: number, bookId: number, returnDateInput?: string) {
  const data = await fs.readFile(dataPath, 'utf-8').catch(() => '[]');
  const records: BorrowedRecord[] = JSON.parse(data.trim() || '[]');

  const returnDate = returnDateInput ? new Date(returnDateInput) : new Date();

  const index = records.findIndex(
    r => r.userId === userId && r.bookId === bookId && r.status === 'borrowed'
  );

  if (index === -1) {
    console.log(`⚠️ Không tìm thấy bản ghi "chưa trả" cho userId=${userId}, bookId=${bookId}`);
    return;
  }

  const record = records[index];
  const due = new Date(record.dueDate);
  const lateDays = Math.max(0, Math.ceil((returnDate.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)));
  const fine = lateDays * 5000;

  records[index] = {
    ...record,
    returnDate: returnDate.toISOString(),
    status: 'returned',
    fine
  };

  await fs.writeFile(dataPath, JSON.stringify(records, null, 2));

  console.log(`✅ Trả sách: userId=${userId}, bookId=${bookId}, ngày trả: ${returnDate.toISOString()}, phạt: ${fine}đ`);
}

