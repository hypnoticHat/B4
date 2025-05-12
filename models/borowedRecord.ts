export interface BorrowedRecord {
    id: number;
    userId: number;
    bookId: number;
    borrowedDate: string;
    dueDate: string;
    returnDate?: string;
    status: 'borrowed' | 'returned';
    fine: number;
    }