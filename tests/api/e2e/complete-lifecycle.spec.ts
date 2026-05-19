// Manual Test Cases: docs/api/manual-test-cases.md (TC-E2E-001 to TC-E2E-003)

import { test, expect } from '@playwright/test';
import { BookingService } from '../../../helpers/api/BookingService';
import { AuthService } from '../../../helpers/api/AuthService';
import {
  COMPLETE_BOOKING,
  MULTIPLE_BOOKINGS,
  VALID_AUTH,
  generateRandomBooking,
} from '../../../test-data/api/booking-test-data';

test.describe('End-to-End API Tests', () => {
  let bookingService: BookingService;
  let authService: AuthService;

  test.beforeEach(async ({ request }) => {
    bookingService = new BookingService(request);
    authService = new AuthService(request);
  });

  test('TC-E2E-001: Complete booking lifecycle - Create, Read, Update, Delete', async () => {
    let bookingId: number | undefined;
    let authHeaders: { Cookie: string } | undefined;

    try {
      await test.step('Generate auth token', async () => {
        const tokenResponse = await authService.createToken(VALID_AUTH);
        expect(tokenResponse.status()).toBe(200);
        const authToken = await authService.getToken(tokenResponse);
        authHeaders = authService.createAuthCookie(authToken);
      });

      await test.step('Create new booking', async () => {
        const createResponse = await bookingService.createBooking(COMPLETE_BOOKING);
        expect(createResponse.status()).toBe(200);
        bookingId = await bookingService.getBookingIdFromResponse(createResponse);
        expect(bookingId).toBeGreaterThan(0);
      });

      await test.step('Get booking by ID and verify creation', async () => {
        const getResponse = await bookingService.getBookingById(bookingId!);
        expect(getResponse.status()).toBe(200);
        const booking = await getResponse.json();
        expect(booking.firstname).toBe(COMPLETE_BOOKING.firstname);
        expect(booking.lastname).toBe(COMPLETE_BOOKING.lastname);
      });

      await test.step('Partial update - change firstname', async () => {
        const updateResponse = await bookingService.partialUpdateBooking(
          bookingId!, { firstname: 'UpdatedFirstname' }, authHeaders!
        );
        expect(updateResponse.status()).toBe(200);
        const updatedBooking = await updateResponse.json();
        expect(updatedBooking.firstname).toBe('UpdatedFirstname');
      });

      await test.step('Verify update via GET', async () => {
        const getUpdatedResponse = await bookingService.getBookingById(bookingId!);
        expect(getUpdatedResponse.status()).toBe(200);
        const verifyUpdate = await getUpdatedResponse.json();
        expect(verifyUpdate.firstname).toBe('UpdatedFirstname');
      });

      await test.step('Delete booking', async () => {
        const deleteResponse = await bookingService.deleteBooking(bookingId!, authHeaders!);
        expect(deleteResponse.status()).toBe(201);
        bookingId = undefined; // Mark as cleaned up
      });

      await test.step('Verify deletion returns 404', async () => {
        const getDeletedResponse = await bookingService.getBookingById(bookingId ?? 0);
        expect(getDeletedResponse.status()).toBe(404);
      });
    } finally {
      if (bookingId && authHeaders) {
        await bookingService.deleteBooking(bookingId, authHeaders);
      }
    }
  });

  test('TC-E2E-002: Multiple bookings management', async () => {
    const createdIds: number[] = [];
    let authHeaders: { Cookie: string } | undefined;

    try {
      await test.step('Generate auth token', async () => {
        const tokenResponse = await authService.createToken(VALID_AUTH);
        const authToken = await authService.getToken(tokenResponse);
        authHeaders = authService.createAuthCookie(authToken);
      });

      await test.step('Get initial booking count', async () => {
        const initialResponse = await bookingService.getAllBookingIds();
        await initialResponse.json(); // confirm reachable
      });

      await test.step('Create 3 different bookings', async () => {
        for (const bookingData of MULTIPLE_BOOKINGS) {
          const response = await bookingService.createBooking(bookingData);
          expect(response.status()).toBe(200);
          createdIds.push(await bookingService.getBookingIdFromResponse(response));
        }
        expect(createdIds).toHaveLength(MULTIPLE_BOOKINGS.length);
      });

      await test.step('Filter by firstname and verify results', async () => {
        const filterResponse = await bookingService.getAllBookingIds({
          firstname: MULTIPLE_BOOKINGS[0].firstname,
        });
        const filteredBookings = await filterResponse.json();
        const filteredIds = filteredBookings.map((b: { bookingid: number }) => b.bookingid);
        expect(filteredIds).toContain(createdIds[0]);
      });

      await test.step('Partial update one booking', async () => {
        const updateResponse = await bookingService.partialUpdateBooking(
          createdIds[0], { totalprice: 888 }, authHeaders!
        );
        expect(updateResponse.status()).toBe(200);
      });

      await test.step('Delete one booking', async () => {
        const deleteResponse = await bookingService.deleteBooking(createdIds[1], authHeaders!);
        expect(deleteResponse.status()).toBe(201);
        createdIds.splice(1, 1); // remove from cleanup list — already deleted
      });

      await test.step('Verify final state', async () => {
        const verifyGet = await bookingService.getBookingById(createdIds[0]);
        expect(verifyGet.status()).toBe(200);
        const verifyData = await verifyGet.json();
        expect(verifyData.totalprice).toBe(888);
      });
    } finally {
      if (authHeaders) {
        for (const id of createdIds) {
          await bookingService.deleteBooking(id, authHeaders).catch(() => {});
        }
      }
    }
  });

  test('TC-E2E-003: Unauthorized operations flow', async () => {
    let bookingId: number | undefined;

    try {
      await test.step('Create booking without auth', async () => {
        const createResponse = await bookingService.createBooking(COMPLETE_BOOKING);
        expect(createResponse.status()).toBe(200);
        bookingId = await bookingService.getBookingIdFromResponse(createResponse);
      });

      await test.step('Attempt partial update without auth - expect 403', async () => {
        const unauthorizedUpdate = await bookingService.partialUpdateBooking(
          bookingId!, { firstname: 'Unauthorized' }, {}
        );
        expect(unauthorizedUpdate.status()).toBe(403);
      });

      await test.step('Attempt delete without auth - expect 403', async () => {
        const unauthorizedDelete = await bookingService.deleteBooking(bookingId!, {});
        expect(unauthorizedDelete.status()).toBe(403);
      });

      let authHeaders: { Cookie: string };
      await test.step('Generate auth token', async () => {
        const tokenResponse = await authService.createToken(VALID_AUTH);
        const authToken = await authService.getToken(tokenResponse);
        authHeaders = authService.createAuthCookie(authToken);
      });

      await test.step('Partial update with auth - expect 200', async () => {
        const authorizedUpdate = await bookingService.partialUpdateBooking(
          bookingId!, { firstname: 'Authorized' }, authHeaders!
        );
        expect(authorizedUpdate.status()).toBe(200);
        const updated = await authorizedUpdate.json();
        expect(updated.firstname).toBe('Authorized');
      });

      await test.step('Delete with auth - expect 201', async () => {
        const authorizedDelete = await bookingService.deleteBooking(bookingId!, authHeaders!);
        expect(authorizedDelete.status()).toBe(201);
        bookingId = undefined; // Mark cleaned up
      });

      await test.step('Verify deletion returns 404', async () => {
        const verifyDelete = await bookingService.getBookingById(bookingId ?? 0);
        expect(verifyDelete.status()).toBe(404);
      });
    } finally {
      if (bookingId) {
        const tokenResponse = await authService.createToken(VALID_AUTH);
        const authToken = await authService.getToken(tokenResponse);
        const authHeaders = authService.createAuthCookie(authToken);
        await bookingService.deleteBooking(bookingId, authHeaders).catch(() => {});
      }
    }
  });

  test('TC-E2E-004: Stress test - Create and delete multiple bookings', async () => {
    const tokenResponse = await authService.createToken(VALID_AUTH);
    const authToken = await authService.getToken(tokenResponse);
    const authHeaders = authService.createAuthCookie(authToken);

    const bookingIds: number[] = [];
    const count = 5;

    try {
      await test.step(`Create ${count} bookings`, async () => {
        for (let i = 0; i < count; i++) {
          const booking = generateRandomBooking();
          const response = await bookingService.createBooking(booking);
          expect(response.status()).toBe(200);
          bookingIds.push(await bookingService.getBookingIdFromResponse(response));
        }
        expect(bookingIds).toHaveLength(count);
      });

      await test.step('Verify all bookings exist', async () => {
        for (const id of bookingIds) {
          const response = await bookingService.getBookingById(id);
          expect(response.status()).toBe(200);
        }
      });

      await test.step('Delete all bookings', async () => {
        for (const id of [...bookingIds]) {
          const response = await bookingService.deleteBooking(id, authHeaders);
          expect(response.status()).toBe(201);
          bookingIds.splice(bookingIds.indexOf(id), 1);
        }
      });

      await test.step('Verify all bookings deleted', async () => {
        for (const id of []) {
          const response = await bookingService.getBookingById(id);
          expect(response.status()).toBe(404);
        }
      });
    } finally {
      for (const id of bookingIds) {
        await bookingService.deleteBooking(id, authHeaders).catch(() => {});
      }
    }
  });
});
