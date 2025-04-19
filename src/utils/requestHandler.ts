import ErrorStore from '../stores/ErrorStore';

/**
 * Centralized error-handling wrapper for API requests
 */
const handleRequest = async <T>(request: Promise<T>): Promise<T> => {
    try {
        return await request;
    } catch (error: any) {
        ErrorStore.setError(error.message || 'An error occurred');
        throw error;
    }
};

export default handleRequest;
