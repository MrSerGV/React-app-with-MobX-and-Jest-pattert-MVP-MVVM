import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import useBookController from '../controllers/useBookController';
import { BookEntity } from '../types/booksTypes';

export enum BookTypes {
    ALL_BOOKS = 'All books',
    PRIVATE_BOOKS = 'Private books',
}

class BookStore {
    publicBooks = observable.array<BookEntity>([]);
    privateBooks= observable.array<BookEntity>([]);
    owner= observable.box<string>('rootAdmin');
    isLoading = observable.box<boolean>(false);
    bookController = useBookController();

    constructor() {
        makeObservable(this, {
            publicBooks: observable,
            privateBooks: observable,
            owner: observable,
            isLoading: observable,
            totalPrivateBooks: computed,
            fetchAllBooks: action,
            fetchBooksByType: action,
            addBook: action,
        });
    }

    get totalPrivateBooks(): number {
        return this.privateBooks.length;
    }

    async fetchAllBooks(): Promise<void> {
        this.isLoading.set(true);
        try {
            await Promise.all([
                this.fetchBooksByType(BookTypes.ALL_BOOKS),
                this.fetchBooksByType(BookTypes.PRIVATE_BOOKS)
            ]);
        } finally {
            runInAction(() => this.isLoading.set(false));
        }
    };

    async fetchBooksByType(bookType: string): Promise<void> {
        this.isLoading.set(true);

        try {
            const books = bookType === BookTypes.ALL_BOOKS
                ? await this.bookController.fetchPublicBooks(this.owner.get())
                    : await this.bookController.fetchPrivateBooks(this.owner.get());

            runInAction(() => {
                bookType === BookTypes.ALL_BOOKS
                    ? this.publicBooks.replace(books)
                        : this.privateBooks.replace(books.slice());

                this.isLoading.set(false);
            })
        } catch (error) {
            runInAction(() => this.isLoading.set(false));
        }
    }

    async addBook(book: BookEntity): Promise<void> {
        const success = await this.bookController.addBook(this.owner.get(), book);

        if (!success) return;

        runInAction(() => {
            this.publicBooks.push(book);
            this.privateBooks.push(book);
        });
    }
}

export default new BookStore();
