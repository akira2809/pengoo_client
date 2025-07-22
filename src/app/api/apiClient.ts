import { API_CONFIG, ApiResponse, buildQueryString } from './apiConfig';

class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  private constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = {
        status: response.status,
        message: data.message || API_CONFIG.ERROR_MESSAGES.SERVER_ERROR,
        errors: data.errors
      };
      throw error;
    }
    return {
      success: true,
      data: data.data || data,
      message: data.message,
      statusCode: response.status
    };
  }
private getAuthHeader(): Record<string, string> {
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        token = parsed?.state?.token ?? null;
      } catch {
        token = null;
      }
    }
  }
  console.log('JWT token used for API:', token); // Add this line
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

  public async get<T>(
    endpoint: string, 
    params: Record<string, string | number | boolean | (string | number | boolean)[] | undefined> = {},
    customHeaders: Record<string, string> = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}${buildQueryString(params)}`;
    const headers = {
      ...this.defaultHeaders,
      ...this.getAuthHeader(),
      ...customHeaders
    };

    try {
      console.log('Making GET request to:', url); // Debug log
      const response = await fetch(url, {
        method: 'GET',
        headers,
        mode: 'cors',
        // Không cần credentials cho JWT header
      });

      if (!response.ok) {
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });
      }

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('GET request failed:', error);
      throw {
        success: false,
        error: error instanceof Error ? error.message : API_CONFIG.ERROR_MESSAGES.NETWORK_ERROR,
        statusCode: 0
      };
    }
  }

  public async post<T, U = Record<string, unknown>>(
    endpoint: string, 
    data: U = {} as U,
    customHeaders: Record<string, string> = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      ...this.defaultHeaders,
      ...this.getAuthHeader(),
      ...customHeaders
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        mode: 'cors',
        // Không cần credentials cho JWT header
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('POST request failed:', error);
      throw {
        success: false,
        error: API_CONFIG.ERROR_MESSAGES.NETWORK_ERROR,
        statusCode: 0
      };
    }
  }

  public async put<T, U = Record<string, unknown>>(
    endpoint: string, 
    data: U = {} as U,
    customHeaders: Record<string, string> = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      ...this.defaultHeaders,
      ...this.getAuthHeader(),
      ...customHeaders
    };

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
        mode: 'cors',
        // Không cần credentials cho JWT header
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('PUT request failed:', error);
      throw {
        success: false,
        error: API_CONFIG.ERROR_MESSAGES.NETWORK_ERROR,
        statusCode: 0
      };
    }
  }

  public async delete<T, U = Record<string, unknown>>(
    endpoint: string,
    data: U = {} as U,
    customHeaders: Record<string, string> = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      ...this.defaultHeaders,
      ...this.getAuthHeader(),
      ...customHeaders
    };

    try {
      const fetchOptions: RequestInit = {
        method: 'DELETE',
        headers,
        mode: 'cors',
      };

      // Only add body if data is not empty
      if (data && Object.keys(data as object).length > 0) {
        fetchOptions.body = JSON.stringify(data);
      }

      const response = await fetch(url, fetchOptions);
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw {
        success: false,
        error: API_CONFIG.ERROR_MESSAGES.NETWORK_ERROR,
        statusCode: 0
      };
    }
  }


  public async patch<T, U = Record<string, unknown>>(
  endpoint: string,
  data: U = {} as U,
  customHeaders: Record<string, string> = {}
): Promise<ApiResponse<T>> {
  const url = `${this.baseUrl}${endpoint}`;
  const headers = {
    ...this.defaultHeaders,
    ...this.getAuthHeader(),
    ...customHeaders
  };

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
      mode: 'cors',
    });
    return this.handleResponse<T>(response);
  } catch (error) {
    console.error('PATCH request failed:', error);
    throw {
      success: false,
      error: API_CONFIG.ERROR_MESSAGES.NETWORK_ERROR,
      statusCode: 0
    };
  }
}


  // Add other HTTP methods as needed (PATCH, etc.)
}

export const apiClient = ApiClient.getInstance();
