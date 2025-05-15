import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';
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

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => {
    rl.close();
    resolve(ans);
  }));
}

export async function searchUser() {
  console.log(`
🔍 Tìm người dùng theo:
1. ID
2. Tên
3. Email
4. SĐT
0. quay lại
`);

  const input = await ask('👉 Nhập lựa chọn (1-4): ');
  let key: UserSearchKey;

  switch (input.trim()) {
    case '1': key = 'id'; break;
    case '2': key = 'name'; break;
    case '3': key = 'email'; break;
    case '4': key = 'phone'; break;
    case '0':
        console.log('Quay lại menu chính');
        return;
    default:
      console.log('❌ Lựa chọn không hợp lệ.');
      return;
  }

  const value = await ask(`🔎 Nhập giá trị cần tìm theo ${key.toUpperCase()}: `);

  const data = await fs.readFile(usersPath, 'utf-8');
  const users: User[] = JSON.parse(data.trim() || '[]');

  let found: User[] = [];

  if (key === 'id') {
    const id = Number(value);
    if (!isNaN(id)) {
      found = users.filter(user => user.id === id);
    }
  } else {
    found = users.filter(user =>
      (user[key] || '').toLowerCase().includes(value.toLowerCase())
    );
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
