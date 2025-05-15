import readline from 'readline';

async function showMenu() {
  console.log(`
📚 HỆ THỐNG QUẢN LÝ THƯ VIỆN
1. Thêm người dùng
2. Thêm sách
3. Mượn sách
4. Trả sách
5. Danh sách người dùng
6. Danh sách sách
7. Tìm kiếm nâng cao
8. Tìm sách theo tên/tác giả
9. Tìm người dùng theo tên/email
0. Thoát
  `);
}

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => {
    rl.close();
    resolve(ans);
  }));
}

async function main() {
  while (true) {
    await showMenu();
    const choice = await ask('👉 Chọn chức năng (0-9): ');

    switch (choice.trim()) {
      case '1': {
        const { addUser } = await import('./routes/addUser');
        const name = await ask('Tên người dùng: ');
        const email = await ask('Email (bỏ trống nếu không có): ');
        const phone = await ask('SĐT (bỏ trống nếu không có): ');
        await addUser(name.trim(), email.trim() || undefined, phone.trim() || undefined);
        break;
      }

      case '2': {
        const { addBook } = await import('./routes/addBook');
        const title = await ask('Tên sách: ');
        const author = await ask('Tác giả: ');
        const publishedDate = await ask('Ngày xuất bản (YYYY-MM-DD): ');
        const category = await ask('Thể loại: ');
        const quantity = parseInt(await ask('Số lượng: '));
        const availableStr = await ask('Số lượng còn lại (bỏ trống để bằng tổng): ');
        const available = availableStr ? parseInt(availableStr) : undefined;
        await addBook(title, author, publishedDate, category, quantity, available);
        break;
      }

      case '3': {
        const { borrowBooks } = await import('./routes/borrowBooks');
        const userId = parseInt(await ask('Nhập ID người dùng: '));
        const bookInput = await ask('Nhập ID sách (hoặc mảng sách, ví dụ: [1, 2, 3]): ');
        let books: number | number[];
        try {
          books = JSON.parse(bookInput); // Parse input như mảng
        } catch {
          books = parseInt(bookInput); // Hoặc đơn số
        }
        await borrowBooks(userId, books);
        break;
      }

      case '4': {
        const { returnBook } = await import('./routes/returnBook');
        const userId = parseInt(await ask('Nhập ID người dùng: '));
        const bookId = parseInt(await ask('Nhập ID sách đã mượn: '));
        const returnDateStr = await ask('Ngày trả sách (bỏ trống nếu trả ngay): ');
        const returnDate = returnDateStr ? new Date(returnDateStr).toISOString() : new Date().toISOString();
        await returnBook(userId, bookId, returnDate);
        break;
      }

      case '5': {
        const { listUsers } = await import('./routes/listUser');
        await listUsers();
        break;
      }

      case '6': {
        const { listBooks } = await import('./routes/listBook');
        await listBooks();
        break;
      }

      case '7': {
        const { search } = await import('./routes/search');
        console.log(`
      🔍 Hệ thống tra cứu:
      1. Danh sách người đang nợ tiền
      2. Danh sách sách chưa trả
      3. Danh sách sách đã quá hạn
      4. Tất cả sách đang được mượn
      5. Lịch sử giao dịch (mượn + trả)
      0. Quay lại
        `);
        const input = await ask('👉 Nhập lựa chọn (0-5): ');
        const option = parseInt(input.trim());
        await search(option);
        break;
      }
      
      case '8': {
        const { searchBook } = await import('./routes/searchBook');
        await searchBook();
        break;
      }

      case '9': {
        const { searchUser } = await import('./routes/searchUser');
        await searchUser();
        break;
      }

      case '0': {
        console.log('👋 Thoát chương trình.');
        process.exit(0);
      }

      default: {
        console.log('❌ Lựa chọn không hợp lệ. Vui lòng chọn lại.');
        break;
      }
    }
  }
}

main();
