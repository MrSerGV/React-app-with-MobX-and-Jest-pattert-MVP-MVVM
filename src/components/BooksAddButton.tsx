import React from 'react';

interface BooksAddFormProps {
    onClickAddBook: () => void;
}

const BooksAddButton = ({ onClickAddBook }: BooksAddFormProps) => {

    return (
        <button onClick={onClickAddBook}>{'Add book'}</button>
    )
};

export default BooksAddButton;