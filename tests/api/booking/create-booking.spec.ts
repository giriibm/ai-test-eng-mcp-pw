// Manual Test Cases: docs/api/manual-test-cases.md (TC-BOOKING-001 to TC-BOOKING-005)

import { test, expect } from '@playwright/test';
import { AuthService } from '../../../helpers/api/AuthService';
import { BookingService, BookingData } from '../../../helpers/api/BookingService';
import {
  COMPLETE_BOOKING,
  MINIMUM_BOOKING,
  SPECIAL_CHARS_BOOKING,
  NUMERIC_NAMES_BOOKING,
  INVALID_DATE_RANGE_BOOKING,
  VALID_AUTH,
} from '../../../test-data/api/booking-test-data';

test.describe('Booking Creation Tests', () => {
  let bookingService: BookingService;
  let authService: AuthService;
  let createdBookingId: number | undefined;

  test.beforeEach(async ({ request }) => {
    bookingService = new BookingService(request);
    authService = new AuthService(request);
    createdBookingId = undefined;
  });

  test.afterEach(async ({ request }) => {
    if (createdBookingId) {
      const svc = new BookingService(request);
      const auth = new AuthService(request);
      try {
        const tokenResp = await auth.createToken(VALID_AUTH);
        const headers = auth.createAuthCookie(await auth.getToken(tokenResp));
        await svc.deleteBooking(createdBookingId, headers);
      } finally {
        createdBookingId = undefined;
      }
    }
  });

  test('TC-BOOKING-001: Create booking with all fields - Happy path', async () => {
    await test.step('Create booking with complete data', async () => {
      const response = await bookingService.createBooking(COMPLETE_BOOKING);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('bookingid');
      expect(body).toHaveProperty('booking');
      expect(typeof body.bookingid).toBe('number');
      expect(body.bookingid).toBeGreaterThan(0);
      expect(body.booking.firstname).toBe(COMPLETE_BOOKING.firstname);
      expect(body.booking.lastname).toBe(COMPLETE_BOOKING.lastname);
      expect(body.booking.totalprice).toBe(COMPLETE_BOOKING.totalprice);
      expect(body.booking.depositpaid).toBe(COMPLETE_BOOKING.depositpaid);
      expect(body.booking.bookingdates.checkin).toBe(COMPLETE_BOOKING.bookingdates.checkin);
      expect(body.booking.bookingdates.checkout).toBe(COMPLETE_BOOKING.bookingdates.checkout);
      expect(body.booking.additionalneeds).toBe(COMPLETE_BOOKING.additionalneeds);
      createdBookingId = body.bookingid;
    });
  });

  test('TC-BOOKING-002: Create booking with minimum required fields', async () => {
    await test.step('Create booking without optional fields', async () => {
      const response = await bookingService.createBooking(MINIMUM_BOOKING);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('bookingid');
      expect(typeof body.bookingid).toBe('number');
      expect(body.booking.firstname).toBe(MINIMUM_BOOKING.firstname);
      expect(body.booking.lastname).toBe(MINIMUM_BOOKING.lastname);
      expect(body.booking.totalprice).toBe(MINIMUM_BOOKING.totalprice);
      expect(body.booking.depositpaid).toBe(MINIMUM_BOOKING.depositpaid);
      expect(body.booking.bookingdates.checkin).toBe(MINIMUM_BOOKING.bookingdates.checkin);
      expect(body.booking.bookingdates.checkout).toBe(MINIMUM_BOOKING.bookingdates.checkout);
      createdBookingId = body.bookingid;
    });
  });

  test('TC-BOOKING-003: Create booking with invalid date range', async () => {
    await test.step('Create booking with checkout before checkin (documented behavior: API accepts it)', async () => {
      // Restful-Booker does not validate date ordering — documents system behavior
      const response = await bookingService.createBooking(INVALID_DATE_RANGE_BOOKING);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.booking.bookingdates.checkin).toBe(INVALID_DATE_RANGE_BOOKING.bookingdates.checkin);
      expect(body.booking.bookingdates.checkout).toBe(INVALID_DATE_RANGE_BOOKING.bookingdates.checkout);
      createdBookingId = body.bookingid;
    });
  });

  test('TC-BOOKING-004: Create booking with missing required field', async () => {
    await test.step('Create booking missing firstname (documented behavior: API accepts it with null)', async () => {
      const incompleteBooking = {
        lastname: 'Test',
        totalprice: 100,
        depositpaid: true,
        bookingdates: {
          checkin: '2024-01-01',
          checkout: '2024-01-02',
        },
      } as BookingData;
      // Restful-Booker accepts incomplete payloads — document actual status
      const response = await bookingService.createBooking(incompleteBooking);
      expect([200, 500]).toContain(response.status());
      if (response.status() === 200) {
        const body = await response.json();
        expect(body).toHaveProperty('bookingid');
        createdBookingId = body.bookingid;
      }
    });
  });

  test('TC-BOOKING-005: Create booking with special characters in names', async () => {
    await test.step('Create booking with special characters', async () => {
      const response = await bookingService.createBooking(SPECIAL_CHARS_BOOKING);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.booking.firstname).toBe(SPECIAL_CHARS_BOOKING.firstname);
      expect(body.booking.lastname).toBe(SPECIAL_CHARS_BOOKING.lastname);
      createdBookingId = body.bookingid;
    });
  });

  test('TC-BOOKING-006: Create booking with numeric names', async () => {
    await test.step('Create booking with numeric values as names', async () => {
      const response = await bookingService.createBooking(NUMERIC_NAMES_BOOKING);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.booking.firstname).toBe(NUMERIC_NAMES_BOOKING.firstname);
      expect(body.booking.lastname).toBe(NUMERIC_NAMES_BOOKING.lastname);
      createdBookingId = body.bookingid;
    });
  });

  test('TC-BOOKING-007: Create booking with zero price', async () => {
    await test.step('Create booking with zero price', async () => {
      const zeroPrice: BookingData = { ...COMPLETE_BOOKING, totalprice: 0 };
      const response = await bookingService.createBooking(zeroPrice);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.booking.totalprice).toBe(0);
      createdBookingId = body.bookingid;
    });
  });

  test('TC-BOOKING-008: Create booking with negative price', async () => {
    await test.step('Create booking with negative price (documented behavior: API accepts it)', async () => {
      const negativePrice: BookingData = { ...COMPLETE_BOOKING, totalprice: -100 };
      const response = await bookingService.createBooking(negativePrice);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.booking.totalprice).toBe(-100);
      createdBookingId = body.bookingid;
    });
  });
});

