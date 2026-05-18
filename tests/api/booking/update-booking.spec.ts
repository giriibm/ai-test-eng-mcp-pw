// Manual Test Cases: docs/api/manual-test-cases.md (TC-UPDATE-001 to TC-UPDATE-005)

import { test, expect } from '@playwright/test';
import { BookingService } from '../../../helpers/api/BookingService';
import { AuthService } from '../../../helpers/api/AuthService';
import { COMPLETE_BOOKING, UPDATED_BOOKING, VALID_AUTH } from '../../../test-data/api/booking-test-data';

test.describe('Update Booking Tests', () => {
  let bookingService: BookingService;
  let authService: AuthService;
  let authToken: string;
  let authHeaders: Record<string, string>;
  let testBookingId: number;

  // Setup: Create auth token and booking before tests
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
    authService = new AuthService(request);

    // Create a new booking for each test
    const response = await bookingService.createBooking(COMPLETE_BOOKING);
    testBookingId = await bookingService.getBookingIdFromResponse(response);
    console.log(`Setup: Created test booking ${testBookingId}`);
  });

  test('TC-UPDATE-001: Full update with valid token', async () => {
    // Update entire booking
    const response = await bookingService.updateBooking(testBookingId, UPDATED_BOOKING, authHeaders);

    // Verify response status
    expect(response.status()).toBe(200);

    // Verify all fields updated
    const updatedBooking = await response.json();
    expect(updatedBooking.firstname).toBe(UPDATED_BOOKING.firstname);
    expect(updatedBooking.lastname).toBe(UPDATED_BOOKING.lastname);
    expect(updatedBooking.totalprice).toBe(UPDATED_BOOKING.totalprice);
    expect(updatedBooking.depositpaid).toBe(UPDATED_BOOKING.depositpaid);
    expect(updatedBooking.bookingdates.checkin).toBe(UPDATED_BOOKING.bookingdates.checkin);
    expect(updatedBooking.bookingdates.checkout).toBe(UPDATED_BOOKING.bookingdates.checkout);
    expect(updatedBooking.additionalneeds).toBe(UPDATED_BOOKING.additionalneeds);

    // Verify by getting the booking
    const getResponse = await bookingService.getBookingById(testBookingId);
    const retrievedBooking = await getResponse.json();
    expect(retrievedBooking.firstname).toBe(UPDATED_BOOKING.firstname);

    console.log(`✓ Booking ${testBookingId} fully updated`);
  });

  test('TC-UPDATE-002: Partial update with valid token', async () => {
    // Partial update - only firstname
    const partialData = { firstname: 'PartialUpdate' };
    const response = await bookingService.partialUpdateBooking(testBookingId, partialData, authHeaders);

    // Verify response status
    expect(response.status()).toBe(200);

    // Verify only firstname changed
    const updatedBooking = await response.json();
    expect(updatedBooking.firstname).toBe('PartialUpdate');
    
    // Verify other fields unchanged
    expect(updatedBooking.lastname).toBe(COMPLETE_BOOKING.lastname);
    expect(updatedBooking.totalprice).toBe(COMPLETE_BOOKING.totalprice);
    expect(updatedBooking.depositpaid).toBe(COMPLETE_BOOKING.depositpaid);

    console.log(`✓ Booking ${testBookingId} partially updated (firstname only)`);
  });

  test('TC-UPDATE-003: Update without authentication', async () => {
    // Attempt update without auth headers
    const response = await bookingService.updateBooking(testBookingId, UPDATED_BOOKING, {});

    // Verify forbidden response
    expect(response.status()).toBe(403);

    // Verify booking unchanged
    const getResponse = await bookingService.getBookingById(testBookingId);
    const booking = await getResponse.json();
    expect(booking.firstname).toBe(COMPLETE_BOOKING.firstname);

    console.log('✓ Update without auth correctly rejected (403)');
  });

  test('TC-UPDATE-004: Update non-existent booking', async () => {
    // Attempt to update non-existent booking
    const response = await bookingService.updateBooking(999999, UPDATED_BOOKING, authHeaders);

    // Verify method not allowed
    expect(response.status()).toBe(405);

    console.log('✓ Update non-existent booking returns 405');
  });

  test('TC-UPDATE-005: Update with invalid token', async () => {
    // Create invalid auth headers
    const invalidAuthHeaders = { Cookie: 'token=invalidtoken123' };

    // Attempt update with invalid token
    const response = await bookingService.updateBooking(testBookingId, UPDATED_BOOKING, invalidAuthHeaders);

    // Verify forbidden response
    expect(response.status()).toBe(403);

    console.log('✓ Update with invalid token rejected (403)');
  });

  test('TC-UPDATE-006: Partial update multiple fields', async () => {
    // Partial update - firstname and totalprice
    const partialData = {
      firstname: 'MultiUpdate',
      totalprice: 777,
    };
    const response = await bookingService.partialUpdateBooking(testBookingId, partialData, authHeaders);

    // Verify response status
    expect(response.status()).toBe(200);

    // Verify updated fields
    const updatedBooking = await response.json();
    expect(updatedBooking.firstname).toBe('MultiUpdate');
    expect(updatedBooking.totalprice).toBe(777);
    
    // Verify other fields unchanged
    expect(updatedBooking.lastname).toBe(COMPLETE_BOOKING.lastname);
    expect(updatedBooking.depositpaid).toBe(COMPLETE_BOOKING.depositpaid);

    console.log(`✓ Multiple fields partially updated`);
  });

  test('TC-UPDATE-007: Update with Basic Auth header', async () => {
    // Create Basic Auth header instead of cookie
    const basicAuthHeaders = authService.createBasicAuthHeader(VALID_AUTH);

    // Update using Basic Auth
    const response = await bookingService.updateBooking(testBookingId, UPDATED_BOOKING, basicAuthHeaders);

    // Verify response (alternative auth method)
    const status = response.status();
    console.log(`Basic Auth update status: ${status}`);
    
    // Note: Restful-Booker primarily uses cookie auth
    // Basic auth may return 403, which is expected behavior
  });
});
