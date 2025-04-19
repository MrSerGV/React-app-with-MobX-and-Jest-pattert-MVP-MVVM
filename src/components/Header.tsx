import React from 'react';
import { observer } from 'mobx-react-lite';

import bookStore from '../stores/BookStore';

const Header = observer(() => {

    return <h1>{`Your books: ${bookStore.totalPrivateBooks}`}</h1>;
});

export default Header;
