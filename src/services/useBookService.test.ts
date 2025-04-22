import useBookService from './useBookService';
import ApiGateway from '../api/ApiGateway';
import { BookEntity } from '../types/booksTypes';

jest.mock('../api/ApiGateway');
jest.mock('../stores/ErrorStore', () => ({
    setError: jest.fn(),
}));

describe('useBookService', () => {
    const mockApiGateway = {
        get: jest.fn(),
        post: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (ApiGateway.getInstance as jest.Mock).mockReturnValue(mockApiGateway);
    });

    describe('getBooks', () => {
        it('should call apiGateway.get with the correct path and return data', async () => {
            const mockResponse: BookEntity[] = [{ id: 1, name: 'Book 1', author: 'Author 1' }];
            mockApiGateway.get.mockResolvedValue(mockResponse);

            const bookService = useBookService();
            const result = await bookService.getBooks('user1');

            expect(mockApiGateway.get).toHaveBeenCalledWith('/books/user1');
            expect(result).toEqual(mockResponse);
        });
    });

    describe('getPrivateBooks', () => {
        it('should call apiGateway.get with the correct private path and return data', async () => {
            const mockResponse: BookEntity[] = [{ id: 2, name: 'Private Book', author: 'Author 2' }];
            mockApiGateway.get.mockResolvedValue(mockResponse);

            const bookService = useBookService();
            const result = await bookService.getPrivateBooks('user1');

            expect(mockApiGateway.get).toHaveBeenCalledWith('/books/user1/private');
            expect(result).toEqual(mockResponse);
        });
    });

    describe('postBook', () => {
        it('should call apiGateway.post with the correct path and payload', async () => {
            const mockBook: BookEntity = { id: 3, name: 'New Book', author: 'Author 3' };
            const mockResponse = { success: true };
            mockApiGateway.post.mockResolvedValue(mockResponse);

            const bookService = useBookService();
            const result = await bookService.postBook('user1', mockBook);

            expect(mockApiGateway.post).toHaveBeenCalledWith('/books/user1', mockBook);
            expect(result).toEqual(mockResponse);
        });
    });
});