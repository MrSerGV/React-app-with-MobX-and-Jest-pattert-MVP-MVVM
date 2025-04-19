import ErrorStore from '../stores/ErrorStore';

const API_BASE = process.env.REACT_APP_API_BASE;

class ApiGateway {
  private static instance: ApiGateway;
  private errorStore: typeof ErrorStore;

  private constructor(errorStore: typeof ErrorStore) {
    this.errorStore = errorStore;
  }

  static getInstance(errorStore: typeof ErrorStore): ApiGateway {
    if (!ApiGateway.instance) {
      ApiGateway.instance = new ApiGateway(errorStore);
    }
    return ApiGateway.instance;
  }

  async _request(path: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${API_BASE}${path}`, options);

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      this.errorStore.setError(`API Request Failed: ${error.message}`);
      return null;
    }
  }

  async get(path: string) {
    return this._request(path);
  }

  async post(path: string, payload: any) {
    return this._request(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }
}

export default ApiGateway;
