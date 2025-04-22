import ErrorStore from './ErrorStore';

describe('ErrorStore', () => {
    beforeEach(() => {
        ErrorStore.clearError();
    });

    it('should initialize with an empty errorMessage', () => {
        expect(ErrorStore.errorMessage.get()).toBe('');
    });

    describe('setError', () => {
        it('should set the errorMessage to the provided message', () => {
            const errorMessage = 'An error occurred';
            ErrorStore.setError(errorMessage);

            expect(ErrorStore.errorMessage.get()).toBe(errorMessage);
        });
    });

    describe('clearError', () => {
        it('should clear the errorMessage and set it to an empty string', () => {
            ErrorStore.setError('An error occurred');
            expect(ErrorStore.errorMessage.get()).toBe('An error occurred');

            ErrorStore.clearError();
            expect(ErrorStore.errorMessage.get()).toBe('');
        });
    });
});