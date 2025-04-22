import useBookController from './useBookController';
import useBookService from '../services/useBookService';
import handleRequest from '../utils/requestHandler';
import validateBooksData from '../utils/validateBooksData';
import { BookEntity } from '../types/booksTypes';

jest.mock('../services/useBookService');
jest.mock('../utils/requestHandler');
jest.mock('../utils/validateBooksData');

describe('useBookController', () => {
    let bookController: ReturnType<typeof useBookController>;
    const mockBookService = {
        getBooks: jest.fn(),
        getPrivateBooks: jest.fn(),
        postBook: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useBookService as jest.Mock).mockReturnValue(mockBookService);
        bookController = useBookController();
    });

    describe('fetchPublicBooks', () => {
        it('should fetch public books and validate the data', async () => {
            const mockResponse: BookEntity[]  = [{ id: 1, name: 'Book 1', author: 'Author 1' }];
            mockBookService.getBooks.mockResolvedValue(mockResponse);
            (handleRequest as jest.Mock).mockResolvedValue(mockResponse);
            (validateBooksData as jest.Mock).mockReturnValue(mockResponse);

            const result = await bookController.fetchPublicBooks('user1');

            expect(mockBookService.getBooks).toHaveBeenCalledWith('user1');
            expect(handleRequest).toHaveBeenCalledWith(mockBookService.getBooks.mock.results[0].value);
            expect(validateBooksData).toHaveBeenCalledWith(mockResponse);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('fetchPrivateBooks', () => {
        it('should fetch private books and return the result', async () => {
            const mockResponse: BookEntity[] = [{ id: 2, name: 'Private Book', author: 'Author 2' }];
            mockBookService.getPrivateBooks.mockResolvedValue(mockResponse);
            (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

            const result = await bookController.fetchPrivateBooks('testUser');

            expect(mockBookService.getPrivateBooks).toHaveBeenCalledWith('testUser');
            expect(handleRequest).toHaveBeenCalledWith(mockBookService.getPrivateBooks.mock.results[0].value);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('addBook', () => {
        it('should add a book and return true', async () => {
            const mockBook: BookEntity = { id: 3, name: 'New Book', author: 'Author 3' };
            mockBookService.postBook.mockResolvedValue(mockBook);
            (handleRequest as jest.Mock).mockResolvedValue(mockBook);

            const result = await bookController.addBook('user1', mockBook);

            expect(mockBookService.postBook).toHaveBeenCalledWith('user1', mockBook);
            expect(handleRequest).toHaveBeenCalledWith(Promise.resolve({}));
            expect(result).toBe(true);
        });
    });
});