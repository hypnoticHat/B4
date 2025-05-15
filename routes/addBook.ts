import fs from 'fs/promises';
import path from 'path';
import { Book } from '../models/books';

const booksFilePath = path.join(__dirname, '../data/books.json');

export async function addBook(
  title: string,
  author: string,
  publishedDate: string,
  category: string,
  quantity: number,
  available?: number
) {
  if (quantity <= 0) {
    console.log('❌ Số lượng phải là số nguyên dương');
    return;
  }

  const availableFinal = available !== undefined ? available : quantity;

  if (availableFinal < 0 || availableFinal > quantity) {
    console.log('❌ Số lượng còn sẵn không hợp lệ (0 đến quantity)');
    return;
  }

  const data = await fs.readFile(booksFilePath, 'utf-8').catch(() => '[]');
  const books: Book[] = JSON.parse(data.trim() || '[]');

  const newBook: Book = {
    id: books.length > 0 ? books[books.length - 1].id + 1 : 1,
    title,
    author,
    publishedDate,
    category,
    quantity,
    available: availableFinal,
  };

  books.push(newBook);
  await fs.writeFile(booksFilePath, JSON.stringify(books, null, 2));
  console.log(`✅ Book added: ${JSON.stringify(newBook)}`);
}
