import fs from 'fs/promises';
import path from 'path';
import { User } from '../models/users';

const dataPath = path.join(__dirname, '../data/users.json');

async function listUsers() {
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    const users: User[] = JSON.parse(data.trim() || '[]');

    if (users.length === 0) {
      console.log('📭 Không có độc giả nào.');
      return;
    }

    console.log('📋 Danh sách độc giả:\n');
    users.forEach((user) => {
      console.log(`ID: ${user.id}` + `Name: ${user.name}`);
    });
  } catch (err) {
    console.error('❌ Lỗi khi đọc danh sách độc giả:', err);
  }
}

listUsers();
