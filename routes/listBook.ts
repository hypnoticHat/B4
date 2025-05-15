import fs from 'fs/promises';
import path from 'path';
import { Book } from '../models/books';

const dataPath = path.join(__dirname, '../data/books.json');

export async function listBooks() {
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    const books: Book[] = JSON.parse(data);

    if (books.length === 0) {
      console.log('❌ Không có sách nào trong thư viện.');
      return;
    }

    console.log('📚 Danh sách sách:');
    books.forEach((book) => {
      console.log(`ID: ${book.id} | Tên: ${book.title} | Số lượng còn lại: ${book.available}`);
    });
  } catch (error) {
    console.error('❌ Lỗi khi đọc dữ liệu sách:', error);
  }
}

