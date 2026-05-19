/**
 * API Step Definitions for Booking API Smoke Tests
 * Reuses existing API Service Layer from helpers/api/
 */
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../../../../fixtures/bdd-fixtures';
import { AuthService } from '../../../../helpers/api/AuthService';
import { BookingService, type BookingData } from '../../../../helpers/api/BookingService';

const { Given, When, Then, After } = createBdd(test);

// Per-scenario context stored per test instance to avoid cross-scenario leakage
interface ScenarioContext {
  authToken?: string;
  bookingId?: number;
  bookingData?: BookingData;
  createResponse?: any;
  updateResponse?: any;
  deleteResponse?: any;
  getResponse?: any;
}
const scenarioCtx = new WeakMap<object, ScenarioContext>();

function getCtx(world: object): ScenarioContext {
  if (!scenarioCtx.has(world)) scenarioCtx.set(world, {});
  return scenarioCtx.get(world)!;
}

// Clean up any booking created during the scenario
After(async ({ request, $test }) => {
  const c = scenarioCtx.get($test);
  if (c?.bookingId) {
    const auth = new AuthService(request);
    const svc = new BookingService(request);
    try {
      const tokenResp = await auth.createToken({ username: 'admin', password: 'password123' });
      const headers = auth.createAuthCookie(await auth.getToken(tokenResp));
      await svc.deleteBooking(c.bookingId, headers);
    } finally {
      c.bookingId = undefined;
    }
  }
});

// ====================
// Given Steps
// ====================

Given('the Restful-Booker API is accessible', async ({ request }) => {
  const response = await request.get('https://restful-booker.herokuapp.com/ping');
  expect(response.status()).toBe(201);
});

Given('authentication token is obtained with username {string} and password {string}',
  async ({ request, $test }, username: string, password: string) => {
  const c = getCtx($test);
  const authService = new AuthService(request);
  const response = await authService.createToken({ username, password });
  expect(response.status()).toBe(200);
  c.authToken = await authService.getToken(response);
  expect(c.authToken).toBeTruthy();
  expect(c.authToken?.length).toBeGreaterThan(0);
});

// ====================
// When Steps
// ====================

When('a new booking is created with firstname {string}, lastname {string}, totalprice {int}, depositpaid true, checkin {string}, checkout {string}',
  async ({ request, $test }, firstname: string, lastname: string, totalprice: number, checkin: string, checkout: string) => {
  const c = getCtx($test);
  const bookingService = new BookingService(request);
  c.bookingData = {
    firstname,
    lastname,
    totalprice,
    depositpaid: true,
    bookingdates: { checkin, checkout },
    additionalneeds: 'Breakfast',
  };
  c.createResponse = await bookingService.createBooking(c.bookingData);
  expect(c.createResponse.status()).toBe(200);
  c.bookingId = await bookingService.getBookingIdFromResponse(c.createResponse);
});

When('the booking dates are updated to checkin {string} and checkout {string}',
  async ({ request, $test }, checkin: string, checkout: string) => {
  const c = getCtx($test);
  const bookingService = new BookingService(request);
  const authService = new AuthService(request);
  expect(c.bookingId).toBeDefined();
  expect(c.authToken).toBeDefined();
  const updatedBookingData: BookingData = {
    ...c.bookingData!,
    bookingdates: { checkin, checkout },
  };
  const authHeaders = authService.createAuthCookie(c.authToken!);
  c.updateResponse = await bookingService.updateBooking(c.bookingId!, updatedBookingData, authHeaders);
  c.bookingData = updatedBookingData;
});

When('the booking is deleted', async ({ request, $test }) => {
  const c = getCtx($test);
  const bookingService = new BookingService(request);
  const authService = new AuthService(request);
  expect(c.bookingId).toBeDefined();
  expect(c.authToken).toBeDefined();
  const authHeaders = authService.createAuthCookie(c.authToken!);
  c.deleteResponse = await bookingService.deleteBooking(c.bookingId!, authHeaders);
  // Mark as cleaned up so the After hook skips it
  c.bookingId = undefined;
});

// ====================
// Then Steps
// ====================

Then('the booking should be created with status code {int}', async ({ $test }, statusCode: number) => {
  const c = getCtx($test);
  expect(c.createResponse).toBeDefined();
  expect(c.createResponse.status()).toBe(statusCode);
});

Then('the response should contain a valid booking ID', async ({ $test }) => {
  const c = getCtx($test);
  expect(c.bookingId).toBeDefined();
  expect(c.bookingId).toBeGreaterThan(0);
  expect(typeof c.bookingId).toBe('number');
});

Then('the booking should be retrievable by ID', async ({ request, $test }) => {
  const c = getCtx($test);
  const bookingService = new BookingService(request);
  expect(c.bookingId).toBeDefined();
  c.getResponse = await bookingService.getBookingById(c.bookingId!);
  expect(c.getResponse.status()).toBe(200);
  const retrievedBooking = await bookingService.getBookingDataFromResponse(c.getResponse);
  expect(retrievedBooking.firstname).toBe(c.bookingData!.firstname);
  expect(retrievedBooking.lastname).toBe(c.bookingData!.lastname);
  expect(retrievedBooking.totalprice).toBe(c.bookingData!.totalprice);
  expect(retrievedBooking.depositpaid).toBe(c.bookingData!.depositpaid);
});

Then('the update should return status code {int}', async ({ $test }, statusCode: number) => {
  const c = getCtx($test);
  expect(c.updateResponse).toBeDefined();
  expect(c.updateResponse.status()).toBe(statusCode);
});

Then('the booking should reflect checkin date {string}', async ({ request, $test }, expectedCheckin: string) => {
  const c = getCtx($test);
  const bookingService = new BookingService(request);
  const response = await bookingService.getBookingById(c.bookingId!);
  const booking = await bookingService.getBookingDataFromResponse(response);
  expect(booking.bookingdates.checkin).toBe(expectedCheckin);
});

Then('the booking should reflect checkout date {string}', async ({ request, $test }, expectedCheckout: string) => {
  const c = getCtx($test);
  const bookingService = new BookingService(request);
  const response = await bookingService.getBookingById(c.bookingId!);
  const booking = await bookingService.getBookingDataFromResponse(response);
  expect(booking.bookingdates.checkout).toBe(expectedCheckout);
});

Then('the booking firstname should still be {string}', async ({ request, $test }, expectedFirstname: string) => {
  const c = getCtx($test);
  const bookingService = new BookingService(request);
  const response = await bookingService.getBookingById(c.bookingId!);
  const booking = await bookingService.getBookingDataFromResponse(response);
  expect(booking.firstname).toBe(expectedFirstname);
});

Then('the deletion should return status code {int}', async ({ $test }, statusCode: number) => {
  const c = getCtx($test);
  expect(c.deleteResponse).toBeDefined();
  expect(c.deleteResponse.status()).toBe(statusCode);
});

Then('the booking should no longer exist with status code {int}', async ({ request, $test }, statusCode: number) => {
  const c = getCtx($test);
  const bookingService = new BookingService(request);
  const response = await bookingService.getBookingById(c.bookingId ?? 0);
  expect(response.status()).toBe(statusCode);
});
