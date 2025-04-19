import { makeObservable, observable, action } from 'mobx';

class ErrorStore {
    errorMessage = observable.box<string>('');

    constructor() {
        makeObservable(this, {
            errorMessage: observable,
            setError: action,
            clearError: action,
        });
    }

    setError(message: string) {
        this.errorMessage.set(message);
    }

    clearError() {
        this.errorMessage.set('');
    }
}

export default new ErrorStore();