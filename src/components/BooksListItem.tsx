import React from 'react';

import { BookEntity } from '../types/booksTypes';

interface BooksListProps {
    book: BookEntity;
}
const BooksListItem = ({ book }: BooksListProps) => {

    return (
        <li>{book.author}: {book.name}</li>
    )
}

export default BooksListItem;