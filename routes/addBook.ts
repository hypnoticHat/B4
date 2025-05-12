import fs from 'fs/promises';
import path from 'path';
import { Book } from '../models/books';

const booksFilePath = path.join(__dirname, '../data/books.json');

async function addBook(){
    const args = process.argv.slice(2);
    if (args.length < 5) {
        console.error('Please provide all required fields: title, author, publishedDate, category, quantity');
        return;
    }
    const [title, author, publishedDate, category, quantityStr, availableStr] = args;
    const quantity = parseInt(quantityStr, 10);

    if (isNaN(quantity) || quantity <= 0) {
        console.log('❌ Số lượng phải là một số nguyên dương');
        return;
      }

    const available = availableStr !== undefined ? parseInt(availableStr, 10) : quantity;

    if (isNaN(available) || available < 0 || available > quantity) {
        console.log('❌ Số lượng còn sẵn không hợp lệ (phải từ 0 đến quantity)');
        return;
      }

    const data = await fs.readFile(booksFilePath, 'utf-8');
    const books: Book[] = JSON.parse(data);

    const newBook: Book = {
        id: books.length > 0 ? books[books.length - 1].id + 1 : 1,
        title,
        author,
        publishedDate,
        category,
        quantity,
        available,
    };

    books.push(newBook);
    await fs.writeFile(booksFilePath, JSON.stringify(books, null, 2));
    console.log(`Book added: ${JSON.stringify(newBook)}`);

}

addBook().catch(console.error);