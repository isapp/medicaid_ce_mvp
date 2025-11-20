
interface APIResponse<T> {
  data: T | null;
  error: {
    code: string;
    message: string;
  } | null;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

export class APIError extends Error {
  constructor(
    public code: string,
    message: string,
    public httpStatus?: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'APIError';
  }
}

class APIClient {
  private baseURL: string;
  private getAuthToken: () => string | null;
  private basicAuth: string | null = null;

  constructor(baseURL: string, getAuthToken: () => string | null) {
    try {
      const urlObj = new URL(baseURL);
      if (urlObj.username && urlObj.password) {
        this.basicAuth = btoa(`${urlObj.username}:${urlObj.password}`);
        this.baseURL = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
      } else {
        this.baseURL = baseURL;
      }
    } catch {
      this.baseURL = baseURL;
    }
    this.getAuthToken = getAuthToken;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    if (this.basicAuth) {
      headers['Authorization'] = `Basic ${this.basicAuth}`;
    }

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    headers['Content-Type'] = 'application/json';

    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data: APIResponse<T> = await response.json();

      if (data.error) {
        throw new APIError(
          data.error.code,
          data.error.message,
          response.status
        );
      }

      if (!response.ok) {
        throw new APIError(
          'HTTP_ERROR',
          `HTTP ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      return data.data as T;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new APIError('NETWORK_ERROR', error.message);
      }

      throw new APIError('UNKNOWN_ERROR', 'An unknown error occurred');
    }
  }

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  async patch<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

let apiClient: APIClient;

export const initializeAPIClient = (getAuthToken: () => string | null) => {
  apiClient = new APIClient(API_BASE_URL, getAuthToken);
  return apiClient;
};

export const getAPIClient = (): APIClient => {
  if (!apiClient) {
    throw new Error('API client not initialized. Call initializeAPIClient first.');
  }
  return apiClient;
};

export { APIClient };
