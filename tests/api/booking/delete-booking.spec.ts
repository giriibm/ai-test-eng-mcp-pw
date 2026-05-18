// Manual Test Cases: docs/api/manual-test-cases.md (TC-DELETE-001 to TC-DELETE-004)

import { test, expect } from '@playwright/test';
import { BookingService } from '../../../helpers/api/BookingService';
import { AuthService } from '../../../helpers/api/AuthService';
import { COMPLETE_BOOKING, VALID_AUTH } from '../../../test-data/api/booking-test-data';

test.describe('Delete Booking Tests', () => {
  let bookingService: BookingService;
  let authService: AuthService;
  let authToken: string;
  let authHeaders: Record<string, string>;
  let testBookingId: number;

  // Setup: Create auth token before tests
  test.beforeAll(async ({ request }) => {
    authService = new AuthService(request);
    bookingService = new BookingService(request);

    // Generate auth token
    const tokenResponse = await authService.createToken(VALID_AUTH);
    authToken = await authService.getToken(tokenResponse);
    authHeaders = authService.createAuthCookie(authToken);

    console.log('Setup: Auth token generated');
  });

  test.beforeEach(async ({ request }) => {
    bookingService = new BookingService(request);

    // Create a new booking for each test
    const response = await bookingService.createBooking(COMPLETE_BOOKING);
    testBookingId = await bookingService.getBookingIdFromResponse(response);
    console.log(`Setup: Created test booking ${testBookingId}`);
  });

  test('TC-DELETE-001: Delete booking with valid token', async () => {
    // Delete booking
    const deleteResponse = await bookingService.deleteBooking(testBookingId, authHeaders);

    // Verify delete response status
    expect(deleteResponse.status()).toBe(201);

    // Verify booking deleted by attempting to get it
    const getResponse = await bookingService.getBookingById(testBookingId);
    expect(getResponse.status()).toBe(404);

    console.log(`✓ Booking ${testBookingId} deleted successfully`);
  });

  test('TC-DELETE-002: Delete without authentication', async () => {
    // Attempt delete without auth headers
    const response = await bookingService.deleteBooking(testBookingId, {});

    // Verify forbidden response
    expect(response.status()).toBe(403);

    // Verify booking still exists
    const getResponse = await bookingService.getBookingById(testBookingId);
    expect(getResponse.status()).toBe(200);

    console.log('✓ Delete without auth correctly rejected (403)');
  });

  test('TC-DELETE-003: Delete non-existent booking', async () => {
    // Attempt to delete non-existent booking
    const response = await bookingService.deleteBooking(999999, authHeaders);

    // Verify method not allowed
    expect(response.status()).toBe(405);

    console.log('✓ Delete non-existent booking returns 405');
  });

  test('TC-DELETE-004: Delete with invalid token', async () => {
    // Create invalid auth headers
    const invalidAuthHeaders = { Cookie: 'token=invalidtoken123' };

    // Attempt delete with invalid token
    const response = await bookingService.deleteBooking(testBookingId, invalidAuthHeaders);

    // Verify forbidden response
    expect(response.status()).toBe(403);

    // Verify booking still exists
    const getResponse = await bookingService.getBookingById(testBookingId);
    expect(getResponse.status()).toBe(200);

    console.log('✓ Delete with invalid token rejected (403)');
  });

  test('TC-DELETE-005: Delete already deleted booking', async () => {
    // Delete booking first time
    const firstDelete = await bookingService.deleteBooking(testBookingId, authHeaders);
    expect(firstDelete.status()).toBe(201);

    // Attempt to delete again
    const secondDelete = await bookingService.deleteBooking(testBookingId, authHeaders);

    // Verify method not allowed (booking no longer exists)
    expect(secondDelete.status()).toBe(405);

    console.log('✓ Double delete prevented (405)');
  });

  test('TC-DELETE-006: Verify delete is permanent', async () => {
    // Get initial booking
    const initialGet = await bookingService.getBookingById(testBookingId);
    expect(initialGet.status()).toBe(200);

    // Delete booking
    await bookingService.deleteBooking(testBookingId, authHeaders);

    // Try to get deleted booking multiple times
    for (let i = 0; i < 3; i++) {
      const getResponse = await bookingService.getBookingById(testBookingId);
      expect(getResponse.status()).toBe(404);
    }

    console.log('✓ Delete is permanent - booking cannot be retrieved');
  });
});
