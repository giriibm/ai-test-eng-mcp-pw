/**
 * API Step Definitions for Booking API Smoke Tests
 * Reuses existing API Service Layer from helpers/api/
 */
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { AuthService } from '../../../../helpers/api/AuthService';
import { BookingService, type BookingData } from '../../../../helpers/api/BookingService';

const { Given, When, Then } = createBdd();

// Shared test context for storing data across steps
interface TestContext {
  authToken?: string;
  bookingId?: number;
  bookingData?: BookingData;
  createResponse?: any;
  updateResponse?: any;
  deleteResponse?: any;
  getResponse?: any;
}

// Initialize context
const context: TestContext = {};

// ====================
// Given Steps
// ====================

Given('the Restful-Booker API is accessible', async ({ request }) => {
  // Verify API is accessible by hitting health check
  const response = await request.get('https://restful-booker.herokuapp.com/ping');
  expect(response.status()).toBe(201);
});

Given('authentication token is obtained with username {string} and password {string}', 
  async ({ request }, username: string, password: string) => {
  const authService = new AuthService(request);
  
  const response = await authService.createToken({
    username,
    password
  });
  
  expect(response.status()).toBe(200);
  
  // Store token for later use
  context.authToken = await authService.getToken(response);
  
  // Verify token is not empty
  expect(context.authToken).toBeTruthy();
  expect(context.authToken?.length).toBeGreaterThan(0);
});

// ====================
// When Steps
// ====================

When('a new booking is created with firstname {string}, lastname {string}, totalprice {int}, depositpaid true, checkin {string}, checkout {string}',
  async ({ request }, firstname: string, lastname: string, totalprice: number, checkin: string, checkout: string) => {
  const bookingService = new BookingService(request);
  
  // Create booking data with depositpaid as true
  context.bookingData = {
    firstname,
    lastname,
    totalprice,
    depositpaid: true,  // Fixed value as true
    bookingdates: {
      checkin,
      checkout
    },
    additionalneeds: 'Breakfast'
  };
  
  // Create booking
  context.createResponse = await bookingService.createBooking(context.bookingData);
  
  // Extract and store booking ID
  if (context.createResponse.status() === 200) {
    context.bookingId = await bookingService.getBookingIdFromResponse(context.createResponse);
  }
});

When('the booking dates are updated to checkin {string} and checkout {string}',
  async ({ request }, checkin: string, checkout: string) => {
  const bookingService = new BookingService(request);
  const authService = new AuthService(request);
  
  // Verify we have a booking ID and token
  expect(context.bookingId).toBeDefined();
  expect(context.authToken).toBeDefined();
  
  // Update only the dates, keep other fields the same
  const updatedBookingData: BookingData = {
    ...context.bookingData!,
    bookingdates: {
      checkin,
      checkout
    }
  };
  
  // Create auth cookie
  const authHeaders = authService.createAuthCookie(context.authToken!);
  
  // Update booking
  context.updateResponse = await bookingService.updateBooking(
    context.bookingId!,
    updatedBookingData,
    authHeaders
  );
  
  // Store updated data
  context.bookingData = updatedBookingData;
});

When('the booking is deleted', async ({ request }) => {
  const bookingService = new BookingService(request);
  const authService = new AuthService(request);
  
  // Verify we have a booking ID and token
  expect(context.bookingId).toBeDefined();
  expect(context.authToken).toBeDefined();
  
  // Create auth cookie
  const authHeaders = authService.createAuthCookie(context.authToken!);
  
  // Delete booking
  context.deleteResponse = await bookingService.deleteBooking(
    context.bookingId!,
    authHeaders
  );
});

// ====================
// Then Steps
// ====================

Then('the booking should be created with status code {int}', async ({}, statusCode: number) => {
  expect(context.createResponse).toBeDefined();
  expect(context.createResponse.status()).toBe(statusCode);
});

Then('the response should contain a valid booking ID', async ({}) => {
  expect(context.bookingId).toBeDefined();
  expect(context.bookingId).toBeGreaterThan(0);
  expect(typeof context.bookingId).toBe('number');
});

Then('the booking should be retrievable by ID', async ({ request }) => {
  const bookingService = new BookingService(request);
  
  // Verify we have a booking ID
  expect(context.bookingId).toBeDefined();
  
  // Get booking by ID
  context.getResponse = await bookingService.getBookingById(context.bookingId!);
  
  // Verify successful retrieval
  expect(context.getResponse.status()).toBe(200);
  
  // Verify booking data matches
  const retrievedBooking = await bookingService.getBookingDataFromResponse(context.getResponse);
  
  expect(retrievedBooking.firstname).toBe(context.bookingData!.firstname);
  expect(retrievedBooking.lastname).toBe(context.bookingData!.lastname);
  expect(retrievedBooking.totalprice).toBe(context.bookingData!.totalprice);
  expect(retrievedBooking.depositpaid).toBe(context.bookingData!.depositpaid);
});

Then('the update should return status code {int}', async ({}, statusCode: number) => {
  expect(context.updateResponse).toBeDefined();
  expect(context.updateResponse.status()).toBe(statusCode);
});

Then('the booking should reflect checkin date {string}', async ({ request }, expectedCheckin: string) => {
  const bookingService = new BookingService(request);
  
  // Get updated booking
  const response = await bookingService.getBookingById(context.bookingId!);
  const booking = await bookingService.getBookingDataFromResponse(response);
  
  expect(booking.bookingdates.checkin).toBe(expectedCheckin);
});

Then('the booking should reflect checkout date {string}', async ({ request }, expectedCheckout: string) => {
  const bookingService = new BookingService(request);
  
  // Get updated booking
  const response = await bookingService.getBookingById(context.bookingId!);
  const booking = await bookingService.getBookingDataFromResponse(response);
  
  expect(booking.bookingdates.checkout).toBe(expectedCheckout);
});

Then('the booking firstname should still be {string}', async ({ request }, expectedFirstname: string) => {
  const bookingService = new BookingService(request);
  
  // Get updated booking
  const response = await bookingService.getBookingById(context.bookingId!);
  const booking = await bookingService.getBookingDataFromResponse(response);
  
  expect(booking.firstname).toBe(expectedFirstname);
});

Then('the deletion should return status code {int}', async ({}, statusCode: number) => {
  expect(context.deleteResponse).toBeDefined();
  expect(context.deleteResponse.status()).toBe(statusCode);
});

Then('the booking should no longer exist with status code {int}', async ({ request }, statusCode: number) => {
  const bookingService = new BookingService(request);
  
  // Try to get the deleted booking
  const response = await bookingService.getBookingById(context.bookingId!);
  
  // Should return 404
  expect(response.status()).toBe(statusCode);
});
