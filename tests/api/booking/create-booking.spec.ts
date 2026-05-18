// Manual Test Cases: docs/api/manual-test-cases.md (TC-BOOKING-001 to TC-BOOKING-005)

import { test, expect } from '@playwright/test';
import { BookingService, BookingData } from '../../../helpers/api/BookingService';
import {
  COMPLETE_BOOKING,
  MINIMUM_BOOKING,
  SPECIAL_CHARS_BOOKING,
  NUMERIC_NAMES_BOOKING,
  INVALID_DATE_RANGE_BOOKING,
} from '../../../test-data/api/booking-test-data';

test.describe('Booking Creation Tests', () => {
  let bookingService: BookingService;

  test.beforeEach(async ({ request }) => {
    bookingService = new BookingService(request);
  });

  test('TC-BOOKING-001: Create booking with all fields - Happy path', async () => {
    // Create booking with complete data
    const response = await bookingService.createBooking(COMPLETE_BOOKING);

    // Verify response status
    expect(response.status()).toBe(200);

    // Verify response structure
    const body = await response.json();
    expect(body).toHaveProperty('bookingid');
    expect(body).toHaveProperty('booking');
    expect(typeof body.bookingid).toBe('number');
    expect(body.bookingid).toBeGreaterThan(0);

    // Verify booking data matches input
    expect(body.booking.firstname).toBe(COMPLETE_BOOKING.firstname);
    expect(body.booking.lastname).toBe(COMPLETE_BOOKING.lastname);
    expect(body.booking.totalprice).toBe(COMPLETE_BOOKING.totalprice);
    expect(body.booking.depositpaid).toBe(COMPLETE_BOOKING.depositpaid);
    expect(body.booking.bookingdates.checkin).toBe(COMPLETE_BOOKING.bookingdates.checkin);
    expect(body.booking.bookingdates.checkout).toBe(COMPLETE_BOOKING.bookingdates.checkout);
    expect(body.booking.additionalneeds).toBe(COMPLETE_BOOKING.additionalneeds);

    console.log(`✓ Booking created successfully with ID: ${body.bookingid}`);
  });

  test('TC-BOOKING-002: Create booking with minimum required fields', async () => {
    // Create booking without optional fields
    const response = await bookingService.createBooking(MINIMUM_BOOKING);

    // Verify response status
    expect(response.status()).toBe(200);

    // Verify response structure
    const body = await response.json();
    expect(body).toHaveProperty('bookingid');
    expect(typeof body.bookingid).toBe('number');

    // Verify required fields
    expect(body.booking.firstname).toBe(MINIMUM_BOOKING.firstname);
    expect(body.booking.lastname).toBe(MINIMUM_BOOKING.lastname);
    expect(body.booking.totalprice).toBe(MINIMUM_BOOKING.totalprice);
    expect(body.booking.depositpaid).toBe(MINIMUM_BOOKING.depositpaid);
    expect(body.booking.bookingdates.checkin).toBe(MINIMUM_BOOKING.bookingdates.checkin);
    expect(body.booking.bookingdates.checkout).toBe(MINIMUM_BOOKING.bookingdates.checkout);

    console.log(`✓ Booking created with minimum fields, ID: ${body.bookingid}`);
  });

  test('TC-BOOKING-003: Create booking with invalid date range', async () => {
    // Create booking with checkout before checkin
    const response = await bookingService.createBooking(INVALID_DATE_RANGE_BOOKING);

    // Document system behavior
    // Note: Restful-Booker allows this, but it's documented as edge case
    const status = response.status();
    console.log(`System behavior: Status ${status} for invalid date range`);

    // If accepted, verify booking created
    if (status === 200) {
      const body = await response.json();
      expect(body.booking.bookingdates.checkin).toBe(INVALID_DATE_RANGE_BOOKING.bookingdates.checkin);
      expect(body.booking.bookingdates.checkout).toBe(INVALID_DATE_RANGE_BOOKING.bookingdates.checkout);
      console.log('✓ System accepts invalid date range (documented behavior)');
    }
  });

  test('TC-BOOKING-004: Create booking with missing required field', async () => {
    // Create booking missing firstname
    const incompleteBooking = {
      lastname: 'Test',
      totalprice: 100,
      depositpaid: true,
      bookingdates: {
        checkin: '2024-01-01',
        checkout: '2024-01-02',
      },
    } as BookingData;

    const response = await bookingService.createBooking(incompleteBooking);

    // Document system behavior
    const status = response.status();
    console.log(`System behavior: Status ${status} for missing firstname`);

    // Check if system accepts or rejects
    if (status === 200) {
      const body = await response.json();
      console.log('✓ System accepts missing firstname (uses default):', body.booking.firstname);
    } else {
      console.log('✓ System rejects missing required field');
    }
  });

  test('TC-BOOKING-005: Create booking with special characters in names', async () => {
    // Create booking with special characters
    const response = await bookingService.createBooking(SPECIAL_CHARS_BOOKING);

    // Verify response status
    expect(response.status()).toBe(200);

    // Verify special characters preserved
    const body = await response.json();
    expect(body.booking.firstname).toBe(SPECIAL_CHARS_BOOKING.firstname);
    expect(body.booking.lastname).toBe(SPECIAL_CHARS_BOOKING.lastname);

    console.log('✓ Special characters preserved correctly');
  });

  test('TC-BOOKING-006: Create booking with numeric names', async () => {
    // Create booking with numeric values as names
    const response = await bookingService.createBooking(NUMERIC_NAMES_BOOKING);

    // Verify response status
    expect(response.status()).toBe(200);

    // Verify numeric names accepted
    const body = await response.json();
    expect(body.booking.firstname).toBe(NUMERIC_NAMES_BOOKING.firstname);
    expect(body.booking.lastname).toBe(NUMERIC_NAMES_BOOKING.lastname);

    console.log('✓ Numeric names accepted');
  });

  test('TC-BOOKING-007: Create booking with zero price', async () => {
    // Create booking with zero price
    const zeroPrice: BookingData = {
      ...COMPLETE_BOOKING,
      totalprice: 0,
    };

    const response = await bookingService.createBooking(zeroPrice);

    // Verify response
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.booking.totalprice).toBe(0);

    console.log('✓ Zero price accepted');
  });

  test('TC-BOOKING-008: Create booking with negative price', async () => {
    // Create booking with negative price
    const negativePrice: BookingData = {
      ...COMPLETE_BOOKING,
      totalprice: -100,
    };

    const response = await bookingService.createBooking(negativePrice);

    // Document system behavior
    const status = response.status();
    console.log(`System behavior: Status ${status} for negative price`);

    if (status === 200) {
      const body = await response.json();
      console.log('✓ System accepts negative price (documented):', body.booking.totalprice);
    }
  });
});
