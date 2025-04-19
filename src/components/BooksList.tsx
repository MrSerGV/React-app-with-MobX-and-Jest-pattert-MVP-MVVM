import React, { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react';

import BooksListItem from './BooksListItem';
import bookStore, { BookTypes } from '../stores/BookStore';
import { BookEntity } from '../types/booksTypes';

interface BooksListProps {
    currentType: string;
}

const BooksList = observer(({ currentType }: BooksListProps) => {

    const books = useMemo(() =>
            currentType === BookTypes.ALL_BOOKS ? bookStore.publicBooks : bookStore.privateBooks,
        [currentType]
    );

    useEffect(() => {
        bookStore.fetchAllBooks();
    }, []);

    return bookStore.isLoading.get() ? (
        <div>Loading...</div>
    ) : books.length === 0 ? (
        <div>No books available</div>
    ) : (
        <ul>
            {books.map((book: BookEntity) => (
                <BooksListItem key={book.id} book={book} />
            ))}
        </ul>
    );
})

export default BooksList;