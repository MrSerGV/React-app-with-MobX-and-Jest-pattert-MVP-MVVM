import { v4 as uuidv4 } from 'uuid';
import { BookEntity } from '../types/booksTypes';

/**
 * Recursively extracts valid books and ensures they have uniques ID
 */
const validateBooksData = (data: any): BookEntity[] => {
    const results: BookEntity[] = [];

    const processItem = (item: any) => {
        if (Array.isArray(item)) {
            item.forEach(processItem);
        } else if (typeof item === 'object' && item !== null) {
            if ('author' in item && 'name' in item && typeof item.author === 'string' && typeof item.name === 'string') {
                results.push({ id: uuidv4(), author: item.author, name: item.name });
            } else {
                Object.values(item).forEach(processItem);
            }
        }
    };

    processItem(data);
    return results;
};

export default validateBooksData;