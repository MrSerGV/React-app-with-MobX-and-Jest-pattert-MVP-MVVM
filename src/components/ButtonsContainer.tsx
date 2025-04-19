import React from 'react';

interface BooksListProps {
    buttonsList: Array<string>;
    onClickButton: (book: string) => void;
}

const ButtonsContainer = React.memo(({ buttonsList, onClickButton }: BooksListProps) => {

    return (
        <div>
            {
                buttonsList.map((button: string) =>
                    (<button
                        key={button}
                        onClick={() => onClickButton(button)}
                    >
                        {button}
                    </button>))
            }
        </div>
    )
});

export default ButtonsContainer;
