import validateBooksData from './validateBooksData';
import { v4 as uuidv4 } from 'uuid';
import { BookEntity } from '../types/booksTypes';


jest.mock('uuid', () => ({
    v4: jest.fn(),
}));

describe('validateBooksData', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (uuidv4 as jest.Mock).mockImplementation(() => 'mock-uuid');
    });

    it('should extract valid books with unique IDs', () => {
        const input = [
            { author: 'Author 1', name: 'Book 1' },
            { author: 'Author 2', name: 'Book 2' },
        ];

        const result: BookEntity[] = validateBooksData(input);

        expect(result).toEqual([
            { id: 'mock-uuid', author: 'Author 1', name: 'Book 1' },
            { id: 'mock-uuid', author: 'Author 2', name: 'Book 2' },
        ]);
        expect(uuidv4).toHaveBeenCalledTimes(2);
    });

    it('should handle nested objects and arrays', () => {
        const input = {
            books: [
                { author: 'Author 1', name: 'Book 1' },
                { nested: { author: 'Author 2', name: 'Book 2' } },
                [{ author: 'Author 3', name: 'Book 3' }, { author: 'Author 4', name: 'Book 4' } ],
            ],
        };

        const result: BookEntity[] = validateBooksData(input);

        expect(result).toEqual([
            { id: 'mock-uuid', author: 'Author 1', name: 'Book 1' },
            { id: 'mock-uuid', author: 'Author 2', name: 'Book 2' },
            { id: 'mock-uuid', author: 'Author 3', name: 'Book 3' },
            { id: 'mock-uuid', author: 'Author 4', name: 'Book 4' },
        ]);
        expect(uuidv4).toHaveBeenCalledTimes(4);
    });

    it('should ignore invalid items', () => {
        const input = [
            { author: 'Author 1', name: 'Book 1' },
            { author: 'Author 2' },
            { name: 'Book 3' },
            { category: 'novels' },
        ];

        const result: BookEntity[] = validateBooksData(input);

        expect(result).toEqual([
            { id: 'mock-uuid', author: 'Author 1', name: 'Book 1' },
        ]);
        expect(uuidv4).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array for empty input', () => {
        const input: Array<{}> = [];

        const result: BookEntity[] = validateBooksData(input);

        expect(result).toEqual([]);
        expect(uuidv4).not.toHaveBeenCalled();
    });

    it('should return an empty array for null or undefined input', () => {
        const resultNull = validateBooksData(null);
        const resultUndefined = validateBooksData(undefined);

        expect(resultNull).toEqual([]);
        expect(resultUndefined).toEqual([]);
        expect(uuidv4).not.toHaveBeenCalled();
    });

    it('should handle deeply nested invalid and valid items', () => {
        const input = {
            level1: {
                level2: [
                    { author: 'Author 1', name: 'Book 1' },
                    { invalid: 'data' },
                    { level3: { author: 'Author 2', name: 'Book 2' } },
                    { level3: [{ author: 'Author 3', name: 'Book 3' }, { author: 'Author 4', name: 'Book 4' } ] },
                ],
            },
        };

        const result: BookEntity[] = validateBooksData(input);

        expect(result).toEqual([
            { id: 'mock-uuid', author: 'Author 1', name: 'Book 1' },
            { id: 'mock-uuid', author: 'Author 2', name: 'Book 2' },
            { id: 'mock-uuid', author: 'Author 3', name: 'Book 3' },
            { id: 'mock-uuid', author: 'Author 4', name: 'Book 4' },
        ]);
        expect(uuidv4).toHaveBeenCalledTimes(4);
    });
});