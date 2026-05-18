import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthToken {
  token: string;
}

/**
 * Authentication Service for Restful-Booker API
 * Handles authentication operations
 */
export class AuthService extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Generate authentication token
   * @param credentials - Username and password
   * @returns API response with token
   */
  async createToken(credentials: AuthCredentials): Promise<APIResponse> {
    return await this.post('/auth', credentials);
  }

  /**
   * Get token from response
   */
  async getToken(response: APIResponse): Promise<string> {
    const body = await this.getJsonResponse(response);
    return body.token;
  }

  /**
   * Create auth cookie header
   * @param token - Authentication token
   * @returns Headers object with cookie
   */
  createAuthCookie(token: string): { Cookie: string } {
    return { Cookie: `token=${token}` };
  }

  /**
   * Create Basic Auth header (alternative authentication method)
   * @param credentials - Username and password
   * @returns Headers object with authorization
   */
  createBasicAuthHeader(credentials: AuthCredentials): { Authorization: string } {
    const encoded = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');
    return { Authorization: `Basic ${encoded}` };
  }
}
