import handleRequest from './requestHandler';
import ErrorStore from '../stores/ErrorStore';

jest.mock('../stores/ErrorStore', () => ({
    setError: jest.fn(),
}));

describe('handleRequest', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should resolve successfully when the request succeeds', async () => {
        const mockRequest = Promise.resolve('Success');
        const result = await handleRequest(mockRequest);

        expect(result).toBe('Success');
        expect(ErrorStore.setError).not.toHaveBeenCalled();
    });

    it('should call ErrorStore.setError and rethrow the error when the request fails', async () => {
        const mockError = new Error('Request failed');
        const mockRequest = Promise.reject(mockError);

        await expect(handleRequest(mockRequest)).rejects.toThrow('Request failed');
        expect(ErrorStore.setError).toHaveBeenCalledWith('Request failed');
    });

    it('should call ErrorStore.setError with a default message if the error has no message', async () => {
        const mockError = {};
        const mockRequest = Promise.reject(mockError);

        await expect(handleRequest(mockRequest)).rejects.toEqual(mockError);
        expect(ErrorStore.setError).toHaveBeenCalledWith('An error occurred');
    });
});