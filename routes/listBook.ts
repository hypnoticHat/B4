import fs from 'fs/promises';
import path from 'path';
import { Book } from '../models/books';

const dataPath = path.join(__dirname, '../data/books.json');

async function listBooks() {
    try{
        const data = await fs.readFile(dataPath, 'utf-8');
        const books: Book[] = JSON.parse(data);

        if (books.length === 0) {
            console.log('No books available.');
            return;
        }
        console.log('List of books:');
        books.forEach((book) => {
            console.log(`ID: ${book.id}` + ` Tên: ${book.title}`);
        }
        );
    } catch (error) {
        console.error('Error reading books data:', error);
    }
}

listBooks().catch(console.error);