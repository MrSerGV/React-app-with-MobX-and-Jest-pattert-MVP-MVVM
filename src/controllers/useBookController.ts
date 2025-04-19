import useBookService from '../services/useBookService';
import handleRequest  from '../utils/requestHandler';
import validateBooksData from '../utils/validateBooksData';
import { BookEntity } from '../types/booksTypes';

interface BookController {
    fetchPublicBooks: (user: string) => Promise<BookEntity[]>;
    fetchPrivateBooks: (user: string) => Promise<BookEntity[]>;
    addBook: (user: string, book: BookEntity) => Promise<boolean>;
}

const useBookController = (): BookController => {
    const bookService = useBookService();

    return {
        fetchPublicBooks: async (user) => {
            const response = await handleRequest(bookService.getBooks(user));
            return validateBooksData(response);
        },
        fetchPrivateBooks: async (user) => handleRequest(bookService.getPrivateBooks(user)),
        addBook: async (user, book) => {
            await handleRequest(bookService.postBook(user, book));
            return true;
        }
    }
};

export default useBookController;


