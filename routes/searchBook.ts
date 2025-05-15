import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';
import { Book } from '../models/books';

const booksFilePath = path.join(__dirname, '../data/books.json');

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => {
    rl.close();
    resolve(ans);
  }));
}

export async function searchBook() {
  const booksData = await fs.readFile(booksFilePath, 'utf-8');
  const books: Book[] = JSON.parse(booksData.trim() || '[]');

  console.log(`
🔍 Tìm sách theo:
1. ID
2. Tên sách
3. Tác giả
0. Quay lại
`);

  const choice = await ask('👉 Nhập lựa chọn (0-3): ');
  const input = await ask('🔎 Nhập từ khóa tìm kiếm: ');

  let results: Book[] = [];

  switch (choice.trim()) {
    case '1': {
      const id = parseInt(input);
      if (!isNaN(id)) {
        results = books.filter(b => b.id === id);
      }
      break;
    }
    case '2': {
      results = books.filter(b => b.title.toLowerCase().includes(input.toLowerCase()));
      break;
    }
    case '3': {
      results = books.filter(b => b.author.toLowerCase().includes(input.toLowerCase()));
      break;
    }
    case '0':
      console.log('Quay lại menu chính');
      return;
    default:
      console.log('❌ Lựa chọn không hợp lệ.');
      return;
  }

  if (results.length === 0) {
    console.log('❌ Không tìm thấy sách phù hợp.');
  } else {
    console.log(`✅ Tìm thấy ${results.length} sách:\n`);
    for (const book of results) {
      console.log(`ID: ${book.id}`);
      console.log(`Tiêu đề: ${book.title}`);
      console.log(`Tác giả: ${book.author}`);
      console.log(`Xuất bản: ${book.publishedDate}`);
      console.log(`Thể loại: ${book.category}`);
      console.log(`Số lượng: ${book.quantity}`);
      console.log(`Còn sẵn: ${book.available}`);
      console.log('---');
    }
  }
}
