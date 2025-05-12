import fs from 'fs/promises';
import path from 'path';
import { User } from '../models/users';
import { BorrowedRecord } from '../models/borowedRecord';

type UserSearchKey = 'id' | 'name' | 'email' | 'phone';

const usersPath = path.join(__dirname, '../data/users.json');
const borrowsPath = path.join(__dirname, '../data/borrows.json');

async function countBooksBorrowed(userId: number): Promise<number> {
  const data = await fs.readFile(borrowsPath, 'utf-8').catch(() => '[]');
  const allRecords: BorrowedRecord[] = JSON.parse(data.trim() || '[]');
  return allRecords.filter(r => r.userId === userId && r.status === 'borrowed').length;
}

async function searchUser(key: UserSearchKey, value: string) {
  const data = await fs.readFile(usersPath, 'utf-8');
  const users: User[] = JSON.parse(data.trim() || '[]');

  let found: User[] = [];

  switch (key) {
    case 'id':
      const id = Number(value);
      if (!isNaN(id)) {
        found = users.filter(user => user.id === id);
      }
      break;
    case 'name':
    case 'email':
    case 'phone':
      found = users.filter(user =>
        (user[key] || '').toLowerCase().includes(value.toLowerCase())
      );
      break;
    default:
      console.log('❌ Trường tìm kiếm không hợp lệ.');
      return;
  }

  if (found.length === 0) {
    console.log('🔍 Không tìm thấy người dùng nào.');
  } else {
    console.log(`✅ Tìm thấy ${found.length} kết quả:\n`);
    for (const u of found) {
      const count = await countBooksBorrowed(u.id);
      console.log(`ID: ${u.id}`);
      console.log(`Tên: ${u.name}`);
      console.log(`Email: ${u.email || 'N/A'}`);
      console.log(`SĐT: ${u.phone || 'N/A'}`);
      console.log(`Sách đang mượn: ${count}`);
      console.log('---');
    }
  }
}

// --- CLI entry point ---
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('📌 Cách dùng: npx ts-node routes/searchUser.ts <key> <value>');
} else {
  const [key, value] = args;
  searchUser(key as UserSearchKey, value).catch(console.error);
}
