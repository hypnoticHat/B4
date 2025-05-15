import fs from 'fs/promises';
import path from 'path';
import { User } from '../models/users';

const dataPath = path.join(__dirname, '../data/users.json');

export async function addUser(name: string, email?: string, phone?: string) {
  let users: User[] = [];

  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    users = JSON.parse(data.trim() || '[]');
  } catch {
    console.warn('⚠️ Không thể đọc file, tạo danh sách mới.');
    users = [];
  }

  const newUser: User = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    name,
    email: email || undefined,
    phone: phone || undefined,
  };

  users.push(newUser);
  await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
  console.log(`✅ User added: ${JSON.stringify(newUser)}`);
}
