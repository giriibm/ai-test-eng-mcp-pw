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
    console.log('🚀 Starting complete CRUD lifecycle test');

    // 1. Generate auth token
    const tokenResponse = await authService.createToken(VALID_AUTH);
    expect(tokenResponse.status()).toBe(200);
    const authToken = await authService.getToken(tokenResponse);
    const authHeaders = authService.createAuthCookie(authToken);
    console.log('✓ Step 1: Auth token generated');

    // 2. Create new booking
    const createResponse = await bookingService.createBooking(COMPLETE_BOOKING);
    expect(createResponse.status()).toBe(200);
    const bookingId = await bookingService.getBookingIdFromResponse(createResponse);
    expect(bookingId).toBeGreaterThan(0);
    console.log(`✓ Step 2: Booking created with ID ${bookingId}`);

    // 3. Get booking by ID - verify creation
    const getResponse = await bookingService.getBookingById(bookingId);
    expect(getResponse.status()).toBe(200);
    const booking = await getResponse.json();
    expect(booking.firstname).toBe(COMPLETE_BOOKING.firstname);
    expect(booking.lastname).toBe(COMPLETE_BOOKING.lastname);
    console.log('✓ Step 3: Booking retrieved and verified');

    // 4. Partial update - update firstname
    const updateData = { firstname: 'UpdatedFirstname' };
    const updateResponse = await bookingService.partialUpdateBooking(bookingId, updateData, authHeaders);
    expect(updateResponse.status()).toBe(200);
    const updatedBooking = await updateResponse.json();
    expect(updatedBooking.firstname).toBe('UpdatedFirstname');
    console.log('✓ Step 4: Booking updated (firstname changed)');

    // 5. Get booking by ID - verify update
    const getUpdatedResponse = await bookingService.getBookingById(bookingId);
    expect(getUpdatedResponse.status()).toBe(200);
    const verifyUpdate = await getUpdatedResponse.json();
    expect(verifyUpdate.firstname).toBe('UpdatedFirstname');
    console.log('✓ Step 5: Update verified via GET');

    // 6. Delete booking
    const deleteResponse = await bookingService.deleteBooking(bookingId, authHeaders);
    expect(deleteResponse.status()).toBe(201);
    console.log('✓ Step 6: Booking deleted');

    // 7. Get booking by ID - verify deletion (404)
    const getDeletedResponse = await bookingService.getBookingById(bookingId);
    expect(getDeletedResponse.status()).toBe(404);
    console.log('✓ Step 7: Deletion verified (404)');

    console.log('✅ Complete CRUD lifecycle successful!');
  });

  test('TC-E2E-002: Multiple bookings management', async () => {
    console.log('🚀 Starting multiple bookings management test');

    // 1. Generate auth token
    const tokenResponse = await authService.createToken(VALID_AUTH);
    const authToken = await authService.getToken(tokenResponse);
    const authHeaders = authService.createAuthCookie(authToken);
    console.log('✓ Step 1: Auth token generated');

    // 2. Get initial booking count
    const initialResponse = await bookingService.getAllBookingIds();
    const initialBookings = await initialResponse.json();
    const initialCount = initialBookings.length;
    console.log(`✓ Step 2: Initial booking count: ${initialCount}`);

    // 3. Create 3 different bookings
    const createdIds: number[] = [];
    for (let i = 0; i < MULTIPLE_BOOKINGS.length; i++) {
      const response = await bookingService.createBooking(MULTIPLE_BOOKINGS[i]);
      expect(response.status()).toBe(200);
      const bookingId = await bookingService.getBookingIdFromResponse(response);
      createdIds.push(bookingId);
      console.log(`   Created booking ${i + 1}: ID ${bookingId}`);
    }
    console.log(`✓ Step 3: Created ${createdIds.length} bookings`);

    // 4. Get all bookings - verify count increased
    const afterCreateResponse = await bookingService.getAllBookingIds();
    const afterCreateBookings = await afterCreateResponse.json();
    expect(afterCreateBookings.length).toBeGreaterThanOrEqual(initialCount + 3);
    console.log(`✓ Step 4: Booking count after creation: ${afterCreateBookings.length}`);

    // 5. Filter by firstname - verify results
    const filterResponse = await bookingService.getAllBookingIds({
      firstname: MULTIPLE_BOOKINGS[0].firstname,
    });
    const filteredBookings = await filterResponse.json();
    const filteredIds = filteredBookings.map((b: any) => b.bookingid);
    expect(filteredIds).toContain(createdIds[0]);
    console.log(`✓ Step 5: Filter by firstname returned ${filteredBookings.length} results`);

    // 6. Update one booking
    const updateData = { totalprice: 888 };
    const updateResponse = await bookingService.partialUpdateBooking(createdIds[0], updateData, authHeaders);
    expect(updateResponse.status()).toBe(200);
    console.log(`✓ Step 6: Updated booking ${createdIds[0]}`);

    // 7. Delete one booking
    const deleteResponse = await bookingService.deleteBooking(createdIds[1], authHeaders);
    expect(deleteResponse.status()).toBe(201);
    console.log(`✓ Step 7: Deleted booking ${createdIds[1]}`);

    // 8. Verify final state
    const verifyGet = await bookingService.getBookingById(createdIds[0]);
    expect(verifyGet.status()).toBe(200);
    const verifyData = await verifyGet.json();
    expect(verifyData.totalprice).toBe(888);

    const verifyDelete = await bookingService.getBookingById(createdIds[1]);
    expect(verifyDelete.status()).toBe(404);
    console.log('✓ Step 8: Final state verified');

    // Cleanup remaining bookings
    await bookingService.deleteBooking(createdIds[0], authHeaders);
    await bookingService.deleteBooking(createdIds[2], authHeaders);

    console.log('✅ Multiple bookings management successful!');
  });

  test('TC-E2E-003: Unauthorized operations flow', async () => {
    console.log('🚀 Starting unauthorized operations flow test');

    // 1. Create booking (no auth needed)
    const createResponse = await bookingService.createBooking(COMPLETE_BOOKING);
    expect(createResponse.status()).toBe(200);
    const bookingId = await bookingService.getBookingIdFromResponse(createResponse);
    console.log(`✓ Step 1: Booking created without auth (ID ${bookingId})`);

    // 2. Attempt PARTIAL UPDATE without auth - verify 403
    const unauthorizedUpdate = await bookingService.partialUpdateBooking(
      bookingId,
      { firstname: 'Unauthorized' },
      {}
    );
    expect(unauthorizedUpdate.status()).toBe(403);
    console.log('✓ Step 2: Partial update without auth rejected (403)');

    // 3. Attempt DELETE without auth - verify 403
    const unauthorizedDelete = await bookingService.deleteBooking(bookingId, {});
    expect(unauthorizedDelete.status()).toBe(403);
    console.log('✓ Step 3: Delete without auth rejected (403)');

    // 4. Generate auth token
    const tokenResponse = await authService.createToken(VALID_AUTH);
    const authToken = await authService.getToken(tokenResponse);
    const authHeaders = authService.createAuthCookie(authToken);
    console.log('✓ Step 4: Auth token generated');

    // 5. Successfully PARTIAL UPDATE booking with auth
    const authorizedUpdate = await bookingService.partialUpdateBooking(
      bookingId,
      { firstname: 'Authorized' },
      authHeaders
    );
    expect(authorizedUpdate.status()).toBe(200);
    const updated = await authorizedUpdate.json();
    expect(updated.firstname).toBe('Authorized');
    console.log('✓ Step 5: Partial update with auth successful');

    // 6. Successfully DELETE booking with auth
    const authorizedDelete = await bookingService.deleteBooking(bookingId, authHeaders);
    expect(authorizedDelete.status()).toBe(201);
    console.log('✓ Step 6: Delete with auth successful');

    // Verify deletion
    const verifyDelete = await bookingService.getBookingById(bookingId);
    expect(verifyDelete.status()).toBe(404);

    console.log('✅ Unauthorized operations flow successful!');
  });

  test('TC-E2E-004: Stress test - Create and delete multiple bookings', async () => {
    console.log('🚀 Starting stress test');

    // Generate auth token
    const tokenResponse = await authService.createToken(VALID_AUTH);
    const authToken = await authService.getToken(tokenResponse);
    const authHeaders = authService.createAuthCookie(authToken);

    const bookingIds: number[] = [];
    const count = 5;

    // Create multiple bookings
    for (let i = 0; i < count; i++) {
      const booking = generateRandomBooking();
      const response = await bookingService.createBooking(booking);
      expect(response.status()).toBe(200);
      const id = await bookingService.getBookingIdFromResponse(response);
      bookingIds.push(id);
    }
    console.log(`✓ Created ${count} bookings:`, bookingIds);

    // Verify all created
    for (const id of bookingIds) {
      const response = await bookingService.getBookingById(id);
      expect(response.status()).toBe(200);
    }
    console.log(`✓ Verified all ${count} bookings exist`);

    // Delete all bookings
    for (const id of bookingIds) {
      const response = await bookingService.deleteBooking(id, authHeaders);
      expect(response.status()).toBe(201);
    }
    console.log(`✓ Deleted all ${count} bookings`);

    // Verify all deleted
    for (const id of bookingIds) {
      const response = await bookingService.getBookingById(id);
      expect(response.status()).toBe(404);
    }
    console.log(`✓ Verified all ${count} bookings deleted`);

    console.log('✅ Stress test successful!');
  });
});
