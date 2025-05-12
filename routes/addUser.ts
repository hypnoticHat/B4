import fs from 'fs/promises';
import path from 'path';
import { User } from '../models/users';

const dataPath = path.join(__dirname, '../data/users.json');

async function addUser() {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.error('Please provide a name');
        return;
    }
    const [name, email, phone] = args;
    let users: User[] = [];

try {
  const data = await fs.readFile(dataPath, 'utf-8');
  users = JSON.parse(data.trim() || '[]');
} catch (err) {
  console.warn('⚠️ Không thể đọc file hoặc JSON lỗi, tạo mảng mới.');
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
    console.log(`User added: ${JSON.stringify(newUser)}`);

}
addUser().catch(console.error);