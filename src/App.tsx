import React, { useState, useEffect } from 'react';
import { reaction } from 'mobx';

import ErrorStore from './stores/ErrorStore';
import BooksPage from './components/BooksPage';

import './styles.css';

const App: React.FC = () => {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const dispose = reaction(
            () => ErrorStore.errorMessage,
            (newError) => setError(newError.get())
        );

        return () => dispose();
    }, []);

    return (
        <div className='main'>
            { error ? <div className='error'>{error}</div> : <BooksPage /> }
        </div>
    );
};

export default App;
