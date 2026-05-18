// Manual Test Cases: docs/api/manual-test-cases.md (TC-GET-001 to TC-GET-006)

import { test, expect } from '@playwright/test';
import { BookingService } from '../../../helpers/api/BookingService';
import { COMPLETE_BOOKING } from '../../../test-data/api/booking-test-data';

test.describe('Get Booking Tests', () => {
  let bookingService: BookingService;
  let testBookingId: number;

  // Setup: Create a booking before tests
  test.beforeAll(async ({ request }) => {
    bookingService = new BookingService(request);
    const response = await bookingService.createBooking(COMPLETE_BOOKING);
    testBookingId = await bookingService.getBookingIdFromResponse(response);
    console.log(`Setup: Created test booking with ID ${testBookingId}`);
  });

  test.beforeEach(async ({ request }) => {
    bookingService = new BookingService(request);
  });

  test('TC-GET-001: Get all booking IDs', async () => {
    // Get all booking IDs
    const response = await bookingService.getAllBookingIds();

    // Verify response status
    expect(response.status()).toBe(200);

    // Verify response is array
    const bookings = await response.json();
    expect(Array.isArray(bookings)).toBe(true);
    expect(bookings.length).toBeGreaterThan(0);

    // Verify structure
    bookings.forEach((booking: any) => {
      expect(booking).toHaveProperty('bookingid');
      expect(typeof booking.bookingid).toBe('number');
    });

    console.log(`✓ Retrieved ${bookings.length} booking IDs`);
  });

  test('TC-GET-002: Get booking by ID - Valid ID', async () => {
    // Get specific booking
    const response = await bookingService.getBookingById(testBookingId);

    // Verify response status
    expect(response.status()).toBe(200);

    // Verify response contains all required fields
    const booking = await response.json();
    expect(booking).toHaveProperty('firstname');
    expect(booking).toHaveProperty('lastname');
    expect(booking).toHaveProperty('totalprice');
    expect(booking).toHaveProperty('depositpaid');
    expect(booking).toHaveProperty('bookingdates');
    expect(booking.bookingdates).toHaveProperty('checkin');
    expect(booking.bookingdates).toHaveProperty('checkout');

    // Verify data types
    expect(typeof booking.firstname).toBe('string');
    expect(typeof booking.lastname).toBe('string');
    expect(typeof booking.totalprice).toBe('number');
    expect(typeof booking.depositpaid).toBe('boolean');

    console.log(`✓ Retrieved booking ${testBookingId}:`, booking.firstname, booking.lastname);
  });

  test('TC-GET-003: Get booking by ID - Invalid ID', async () => {
    // Attempt to get non-existent booking
    const response = await bookingService.getBookingById(999999);

    // Verify 404 response
    expect(response.status()).toBe(404);

    console.log('✓ Non-existent booking returns 404');
  });

  test('TC-GET-004: Get bookings filtered by firstname', async () => {
    // Filter by firstname
    const response = await bookingService.getAllBookingIds({
      firstname: COMPLETE_BOOKING.firstname,
    });

    // Verify response
    expect(response.status()).toBe(200);

    const bookings = await response.json();
    expect(Array.isArray(bookings)).toBe(true);

    // Verify our test booking is in results
    const bookingIds = bookings.map((b: any) => b.bookingid);
    expect(bookingIds).toContain(testBookingId);

    console.log(`✓ Filtered by firstname '${COMPLETE_BOOKING.firstname}': ${bookings.length} results`);
  });

  test('TC-GET-005: Get bookings filtered by lastname', async () => {
    // Filter by lastname
    const response = await bookingService.getAllBookingIds({
      lastname: COMPLETE_BOOKING.lastname,
    });

    // Verify response
    expect(response.status()).toBe(200);

    const bookings = await response.json();
    expect(Array.isArray(bookings)).toBe(true);

    // Verify our test booking is in results
    const bookingIds = bookings.map((b: any) => b.bookingid);
    expect(bookingIds).toContain(testBookingId);

    console.log(`✓ Filtered by lastname '${COMPLETE_BOOKING.lastname}': ${bookings.length} results`);
  });

  test('TC-GET-006: Get bookings filtered by date range', async () => {
    // Filter by checkin/checkout dates
    const response = await bookingService.getAllBookingIds({
      checkin: COMPLETE_BOOKING.bookingdates.checkin,
      checkout: COMPLETE_BOOKING.bookingdates.checkout,
    });

    // Verify response
    expect(response.status()).toBe(200);

    const bookings = await response.json();
    expect(Array.isArray(bookings)).toBe(true);

    console.log(`✓ Filtered by dates: ${bookings.length} results`);
  });

  test('TC-GET-007: Get bookings with multiple filters', async () => {
    // Filter by firstname AND lastname
    const response = await bookingService.getAllBookingIds({
      firstname: COMPLETE_BOOKING.firstname,
      lastname: COMPLETE_BOOKING.lastname,
    });

    // Verify response
    expect(response.status()).toBe(200);

    const bookings = await response.json();
    expect(Array.isArray(bookings)).toBe(true);

    // Verify our test booking is in results
    const bookingIds = bookings.map((b: any) => b.bookingid);
    expect(bookingIds).toContain(testBookingId);

    console.log(`✓ Multiple filters applied: ${bookings.length} results`);
  });

  test('TC-GET-008: Get bookings with non-matching filter', async () => {
    // Filter with value that shouldn't exist
    const response = await bookingService.getAllBookingIds({
      firstname: 'NonExistentName12345',
    });

    // Verify response
    expect(response.status()).toBe(200);

    const bookings = await response.json();
    expect(Array.isArray(bookings)).toBe(true);
    expect(bookings.length).toBe(0);

    console.log('✓ Non-matching filter returns empty array');
  });
});
