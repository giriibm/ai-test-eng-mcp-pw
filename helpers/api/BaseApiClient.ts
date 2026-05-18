import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Base API Client for Restful-Booker API
 * Provides common HTTP methods and response handling
 */
export class BaseApiClient {
  protected request: APIRequestContext;
  protected baseURL: string;

  constructor(request: APIRequestContext, baseURL: string = 'https://restful-booker.herokuapp.com') {
    this.request = request;
    this.baseURL = baseURL;
  }

  /**
   * GET request
   */
  async get(endpoint: string, options?: any): Promise<APIResponse> {
    return await this.request.get(`${this.baseURL}${endpoint}`, options);
  }

  /**
   * POST request
   */
  async post(endpoint: string, data?: any, options?: any): Promise<APIResponse> {
    return await this.request.post(`${this.baseURL}${endpoint}`, {
      data,
      ...options,
    });
  }

  /**
   * PUT request
   */
  async put(endpoint: string, data?: any, options?: any): Promise<APIResponse> {
    return await this.request.put(`${this.baseURL}${endpoint}`, {
      data,
      ...options,
    });
  }

  /**
   * PATCH request
   */
  async patch(endpoint: string, data?: any, options?: any): Promise<APIResponse> {
    return await this.request.patch(`${this.baseURL}${endpoint}`, {
      data,
      ...options,
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint: string, options?: any): Promise<APIResponse> {
    return await this.request.delete(`${this.baseURL}${endpoint}`, options);
  }

  /**
   * Parse JSON response
   */
  async getJsonResponse(response: APIResponse): Promise<any> {
    return await response.json();
  }

  /**
   * Get response text
   */
  async getTextResponse(response: APIResponse): Promise<string> {
    return await response.text();
  }

  /**
   * Check if response is successful (2xx)
   */
  isSuccessful(response: APIResponse): boolean {
    return response.ok();
  }

  /**
   * Get response status
   */
  getStatus(response: APIResponse): number {
    return response.status();
  }

  /**
   * Get response headers
   */
  getHeaders(response: APIResponse): any {
    return response.headers();
  }
}
