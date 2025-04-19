import ApiGateway from '../api/ApiGateway';
import ErrorStore from '../stores/ErrorStore';
import { BookEntity } from '../types/booksTypes';

const BOOKS_ROUTE = 'books';

interface BookService {
  getBooks: (user: string) => Promise<BookEntity[]>;
  getPrivateBooks: (user: string) => Promise<BookEntity[]>;
  postBook: (user: string, book: BookEntity) => Promise<any>;
}

const useBookService = (): BookService => {
  const apiGateway = ApiGateway.getInstance(ErrorStore);

  return {
    getBooks: (user) => apiGateway.get(`/${BOOKS_ROUTE}/${user}`),
    getPrivateBooks: (user) => apiGateway.get(`/${BOOKS_ROUTE}/${user}/private`),
    postBook: (user, book) => apiGateway.post(`/${BOOKS_ROUTE}/${user}`, book),
  };
};

export default useBookService;
