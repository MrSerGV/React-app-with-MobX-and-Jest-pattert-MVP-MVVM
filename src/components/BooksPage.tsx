import React, { useCallback, useState } from 'react';
import uuid from 'react-uuid';

import Header from './Header';
import ButtonsContainer from './ButtonsContainer';
import BooksList from './BooksList';
import BooksAddButton from './BooksAddButton';
import bookStore, { BookTypes } from '../stores/BookStore';
import { BookEntity } from '../types/booksTypes';



const BooksPage = () => {

    const [listType, setListType] = useState<string>(BookTypes.ALL_BOOKS);

    const onClickButton = useCallback((buttonType: string) => {
        setListType((prevType) => {
            if (prevType === buttonType) return prevType;
            if (buttonType === BookTypes.PRIVATE_BOOKS) return buttonType;
            bookStore.fetchBooksByType(buttonType);
            return buttonType;
        });

    }, []);

    const onClickAddBook = () => {

        const newBook: BookEntity = {
            id: uuid(),
            name: `Book title ${Math.floor(Math.random() * 10)}`,
            author: `Author ${Math.floor(Math.random() * 10)}`,
        };

        bookStore.addBook(newBook);

    };

    return (
        <div className='books-page'>
            <Header />
            <ButtonsContainer buttonsList={Object.values(BookTypes)} onClickButton={onClickButton} />
            <BooksList currentType={listType}/>
            <BooksAddButton onClickAddBook={onClickAddBook} />
        </div>
    );
}

export default BooksPage;