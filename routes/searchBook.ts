import fs from 'fs/promises';
import path from 'path';
import { Book } from '../models/books';

const booksFilePath = path.join(__dirname, '../data/books.json');

async function searchBook() {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.error('please provide a search term');
        return;
    }
    const id = parseInt(args[0], 10);
    if(isNaN(id) || id <= 0) {
        console.error('ID must be a positive integer');
        return;
    }
    const data = await fs.readFile(booksFilePath, 'utf-8');
    const books: Book[] = JSON.parse(data);
    const book = books.find((book) => book.id === id);
    if (book) {
        console.log(`  Tìm thấy sách: #${book.id}:`);
        console.log(`  Tiêu đề      : ${book.title}`);
        console.log(`  Tác giả      : ${book.author}`);
        console.log(`  Ngày xuất bản: ${book.publishedDate}`);
        console.log(`  Thể loại     : ${book.category}`);
        console.log(`  Số lượng     : ${book.quantity}`);
        console.log(`  Còn sẵn      : ${book.available}`);
    }
    else {
        console.log(`No book found with ID: ${id}`);
    }
}
searchBook().catch(console.error);