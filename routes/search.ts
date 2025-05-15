import fs from 'fs/promises';
import path from 'path';
import { BorrowedRecord } from '../models/borowedRecord';

const dataPath = path.join(__dirname, '../data/borrows.json');

async function loadRecords(): Promise<BorrowedRecord[]> {
  const data = await fs.readFile(dataPath, 'utf-8').catch(() => '[]');
  return JSON.parse(data.trim() || '[]');
}

function showRecords(records: BorrowedRecord[]) {
  if (records.length === 0) {
    console.log('👉 Không có kết quả phù hợp.');
    return;
  }
  for (const r of records) {
    console.log(`- ID:${r.id}, User:${r.userId}, Book:${r.bookId}, Status:${r.status}, Fine:${r.fine}đ`);
  }
}

export async function search(option: number) {
  const records = await loadRecords();
  const now = new Date();

  switch (option) {
    case 1: {
      const debtors = records.filter(r => r.fine > 0);
      console.log('📜 Danh sách người đang nợ tiền phạt:');
      showRecords(debtors);
      break;
    }
    case 2: {
      const unreturned = records.filter(r => r.status === 'borrowed');
      console.log('📕 Danh sách sách chưa trả:');
      showRecords(unreturned);
      break;
    }
    case 3: {
      const overdue = records.filter(r =>
        r.status === 'borrowed' && new Date(r.dueDate) < now
      );
      console.log('🕒 Danh sách sách đã quá hạn nhưng chưa trả:');
      showRecords(overdue);
      break;
    }
    case 4: {
      const borrowing = records.filter(r => r.status === 'borrowed');
      console.log('📚 Tất cả sách đang được mượn:');
      showRecords(borrowing);
      break;
    }
    case 5: {
      console.log('📈 Lịch sử giao dịch (mượn + trả):');
      showRecords(records);
      break;
    }
    case 0:
      console.log('Quay lại menu chính');
      return;
    default:
      console.log('❌ Lựa chọn không hợp lệ.');
  }
}
