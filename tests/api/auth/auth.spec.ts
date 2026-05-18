// Manual Test Cases: docs/api/manual-test-cases.md (TC-AUTH-001, TC-AUTH-002)

import { test, expect } from '@playwright/test';
import { AuthService } from '../../../helpers/api/AuthService';
import { VALID_AUTH, INVALID_AUTH } from '../../../test-data/api/booking-test-data';

test.describe('Authentication Tests', () => {
  let authService: AuthService;

  test.beforeEach(async ({ request }) => {
    authService = new AuthService(request);
  });

  test('TC-AUTH-001: Generate auth token with valid credentials', async () => {
    // Create token with valid credentials
    const response = await authService.createToken(VALID_AUTH);

    // Verify response status
    expect(response.status()).toBe(200);

    // Verify response contains token
    const body = await response.json();
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
    expect(body.token).not.toBe('');
    expect(body.token.length).toBeGreaterThan(0);

    console.log('✓ Token generated successfully:', body.token);
  });

  test('TC-AUTH-002: Generate auth token with invalid credentials', async () => {
    // Attempt to create token with invalid credentials
    const response = await authService.createToken(INVALID_AUTH);

    // Verify response status
    expect(response.status()).toBe(200);

    // Verify response contains error reason
    const body = await response.json();
    expect(body).toHaveProperty('reason');
    expect(body.reason).toBe('Bad credentials');

    console.log('✓ Invalid credentials rejected correctly');
  });

  test('TC-AUTH-003: Verify auth cookie format', async () => {
    // Generate token
    const response = await authService.createToken(VALID_AUTH);
    const token = await authService.getToken(response);

    // Create auth cookie
    const authCookie = authService.createAuthCookie(token);

    // Verify cookie format
    expect(authCookie).toHaveProperty('Cookie');
    expect(authCookie.Cookie).toContain('token=');
    expect(authCookie.Cookie).toBe(`token=${token}`);

    console.log('✓ Auth cookie format correct:', authCookie.Cookie);
  });

  test('TC-AUTH-004: Verify basic auth header format', async () => {
    // Create basic auth header
    const authHeader = authService.createBasicAuthHeader(VALID_AUTH);

    // Verify header format
    expect(authHeader).toHaveProperty('Authorization');
    expect(authHeader.Authorization).toContain('Basic ');
    expect(typeof authHeader.Authorization).toBe('string');

    console.log('✓ Basic auth header format correct');
  });
});
