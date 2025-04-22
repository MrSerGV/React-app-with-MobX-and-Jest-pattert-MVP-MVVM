import BookStore, { BookTypes } from './BookStore';
import { BookEntity } from '../types/booksTypes';

jest.mock('../controllers/useBookController');


describe('BookStore', () => {
    const mockBookController = {
        fetchPublicBooks: jest.fn(),
        fetchPrivateBooks: jest.fn(),
        addBook: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        BookStore.publicBooks.replace([]);
        BookStore.privateBooks.replace([]);
        BookStore.owner.set('rootAdmin');
        BookStore.bookController = mockBookController;
    });

    describe('fetchAllBooks', () => {
        it('should fetch both public and private books and update isLoading', async () => {
            const mockPublicBooks: BookEntity[] = [{ id: 1, name: 'Public Book', author: 'Author 1' }, { id: 2, name: 'Private Book', author: 'Author 2' }];
            const mockPrivateBooks: BookEntity[] = [{ id: 2, name: 'Private Book', author: 'Author 2' }];
            mockBookController.fetchPublicBooks.mockResolvedValue(mockPublicBooks);
            mockBookController.fetchPrivateBooks.mockResolvedValue(mockPrivateBooks);

            const setLoadingSpy = jest.spyOn(BookStore.isLoading, 'set');
            const fetchBooksByTypeSpy = jest.spyOn(BookStore, 'fetchBooksByType');

            await BookStore.fetchAllBooks();
            expect(setLoadingSpy).toHaveBeenCalledWith(true);
            expect(fetchBooksByTypeSpy).toHaveBeenCalledWith(BookTypes.ALL_BOOKS);
            expect(fetchBooksByTypeSpy).toHaveBeenCalledWith(BookTypes.PRIVATE_BOOKS);
            expect(BookStore.publicBooks.slice()).toEqual(mockPublicBooks);
            expect(BookStore.privateBooks.slice()).toEqual(mockPrivateBooks);
            expect(setLoadingSpy).toHaveBeenCalledWith(false);
        });

        it('should handle errors and set isLoading to false', async () => {
            mockBookController.fetchPublicBooks.mockRejectedValue(new Error('Error fetching books'));

            const setLoadingSpy = jest.spyOn(BookStore.isLoading, 'set');

            await BookStore.fetchAllBooks();

            expect(setLoadingSpy).toHaveBeenCalledWith(true);
            expect(setLoadingSpy).toHaveBeenCalledWith(false);
        });
    });

    describe('fetchBooksByType', () => {

        it('should fetch public books', async () => {
            const mockPublicBooks: BookEntity[] = [{ id: 1, name: 'Public Book', author: 'Author 1' }];
            mockBookController.fetchPublicBooks.mockResolvedValue(mockPublicBooks);

            await BookStore.fetchBooksByType(BookTypes.ALL_BOOKS);

            expect(mockBookController.fetchPublicBooks).toHaveBeenCalledWith('rootAdmin');
            expect(BookStore.publicBooks).toEqual(mockPublicBooks);
        });

        it('should fetch private books', async () => {
            const mockPrivateBooks: BookEntity[] = [{ id: 2, name: 'Private Book', author: 'Author 2' }];
            mockBookController.fetchPrivateBooks.mockResolvedValue(mockPrivateBooks);

            await BookStore.fetchBooksByType(BookTypes.PRIVATE_BOOKS);
            expect(mockBookController.fetchPrivateBooks).toHaveBeenCalledWith('rootAdmin');
            expect(BookStore.privateBooks).toEqual(mockPrivateBooks);
        });

        it('should handle errors and set isLoading to false', async () => {
            mockBookController.fetchPublicBooks.mockRejectedValue(new Error('Error fetching books'));

            await BookStore.fetchBooksByType(BookTypes.ALL_BOOKS);

            expect(BookStore.isLoading.get()).toBe(false);
        });
    });

    describe('addBook', () => {

        it('should add a book to both publicBooks and privateBooks if successful', async () => {
            const mockPublicBooks: BookEntity[] = [{ id: 1, name: 'Public Book', author: 'Author 1' }];
            const mockBook: BookEntity = { id: 2, name: 'Private Book', author: 'Author 2' };
            mockBookController.addBook.mockResolvedValue(true);
            BookStore.publicBooks.replace(mockPublicBooks);

            await BookStore.addBook(mockBook);
            expect(mockBookController.addBook).toHaveBeenCalledWith(BookStore.owner.get(), mockBook);
            expect(BookStore.publicBooks.slice()).toEqual([...mockPublicBooks, mockBook]);
            expect(BookStore.privateBooks.slice()).toEqual([ mockBook ]);
        });

        it('should not add a book if addBook fails', async () => {
            const mockBook: BookEntity = { id: 3, name: 'New Book', author: 'Author 3' };
            mockBookController.addBook.mockResolvedValue(false);

            await BookStore.addBook(mockBook);

            expect(mockBookController.addBook).toHaveBeenCalledWith(BookStore.owner.get(), mockBook);
            expect(BookStore.publicBooks.slice()).toEqual([]);
            expect(BookStore.privateBooks.slice()).toEqual([]);
        });
    });
});