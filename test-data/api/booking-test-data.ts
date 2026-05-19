import { BookingData } from '../../helpers/api/BookingService';

/**
 * Valid authentication credentials
 */
export const VALID_AUTH = {
  username: process.env.API_USERNAME ?? 'admin',
  password: process.env.API_PASSWORD ?? 'password123',
};

/**
 * Invalid authentication credentials
 */
export const INVALID_AUTH = {
  username: 'invalid',
  password: 'wrong',
};

/**
 * Generate dynamic future dates relative to today.
 * @param daysFromNow - How many days from today checkin starts (default 30)
 * @param duration    - Length of stay in days (default 5)
 */
export const generateFutureDates = (daysFromNow: number = 30, duration: number = 5) => {
  const checkin = new Date();
  checkin.setDate(checkin.getDate() + daysFromNow);
  const checkout = new Date(checkin);
  checkout.setDate(checkout.getDate() + duration);
  return {
    checkin: checkin.toISOString().split('T')[0],
    checkout: checkout.toISOString().split('T')[0],
  };
};

// Computed once at module load — all constants use future dates
const d = {
  near:    generateFutureDates(30, 5),   // checkin 30 days out, 5 day stay
  medium:  generateFutureDates(45, 4),   // checkin 45 days out, 4 day stay
  far:     generateFutureDates(60, 9),   // checkin 60 days out, 9 day stay
  update:  generateFutureDates(90, 3),   // for update operations
  batch1:  generateFutureDates(35, 4),
  batch2:  generateFutureDates(50, 5),
  batch3:  generateFutureDates(65, 2),
  long:    generateFutureDates(70, 9),
  security: generateFutureDates(80, 1),
  // Invalid range: checkin is AFTER checkout (swapped on purpose)
  invalidRange: { checkin: generateFutureDates(40, 5).checkout, checkout: generateFutureDates(40, 5).checkin },
};

/**
 * Complete booking data with all fields
 */
export const COMPLETE_BOOKING: BookingData = {
  firstname: 'John',
  lastname: 'Doe',
  totalprice: 111,
  depositpaid: true,
  bookingdates: d.near,
  additionalneeds: 'Breakfast',
};

/**
 * Booking with minimum required fields
 */
export const MINIMUM_BOOKING: BookingData = {
  firstname: 'Jane',
  lastname: 'Smith',
  totalprice: 100,
  depositpaid: false,
  bookingdates: d.medium,
};

/**
 * Booking for update operations
 */
export const UPDATED_BOOKING: BookingData = {
  firstname: 'Updated',
  lastname: 'Name',
  totalprice: 999,
  depositpaid: false,
  bookingdates: d.update,
  additionalneeds: 'Updated needs',
};

/**
 * Booking with special characters
 */
export const SPECIAL_CHARS_BOOKING: BookingData = {
  firstname: "John-O'Neil",
  lastname: 'Smith & Jones',
  totalprice: 200,
  depositpaid: true,
  bookingdates: d.near,
  additionalneeds: 'WiFi, Parking, & Breakfast',
};

/**
 * Booking with numeric names
 */
export const NUMERIC_NAMES_BOOKING: BookingData = {
  firstname: '123',
  lastname: '456',
  totalprice: 150,
  depositpaid: true,
  bookingdates: d.medium,
};

/**
 * Booking with invalid date range (checkout before checkin — documents that restful-booker accepts it)
 */
export const INVALID_DATE_RANGE_BOOKING: BookingData = {
  firstname: 'Test',
  lastname: 'User',
  totalprice: 150,
  depositpaid: true,
  bookingdates: d.invalidRange,
};

/**
 * Booking with very long strings
 */
export const LONG_STRING_BOOKING: BookingData = {
  firstname: 'A'.repeat(255),
  lastname: 'B'.repeat(255),
  totalprice: 500,
  depositpaid: true,
  bookingdates: d.long,
  additionalneeds: 'C'.repeat(500),
};

/**
 * Booking with XSS payload — verifies API stores as plain text
 */
export const XSS_BOOKING: BookingData = {
  firstname: "<script>alert('XSS')</script>",
  lastname: '<img src=x onerror=alert(1)>',
  totalprice: 100,
  depositpaid: true,
  bookingdates: d.security,
};

/**
 * Booking with SQL injection attempt — verifies API treats as plain text
 */
export const SQL_INJECTION_BOOKING: BookingData = {
  firstname: "'; DROP TABLE bookings;--",
  lastname: "1' OR '1'='1",
  totalprice: 100,
  depositpaid: true,
  bookingdates: d.security,
};

/**
 * Array of test bookings for batch operations
 */
export const MULTIPLE_BOOKINGS: BookingData[] = [
  {
    firstname: 'Alice',
    lastname: 'Johnson',
    totalprice: 200,
    depositpaid: true,
    bookingdates: d.batch1,
    additionalneeds: 'Pool access',
  },
  {
    firstname: 'Bob',
    lastname: 'Williams',
    totalprice: 300,
    depositpaid: false,
    bookingdates: d.batch2,
    additionalneeds: 'Gym membership',
  },
  {
    firstname: 'Charlie',
    lastname: 'Brown',
    totalprice: 150,
    depositpaid: true,
    bookingdates: d.batch3,
  },
];

/**
 * Generate a random booking with future dates — use sparingly as it makes failures non-deterministic.
 * Prefer named constants above for reproducibility.
 */
export const generateRandomBooking = (): BookingData => {
  const firstnames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
  const lastnames = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'];
  const additionalneeds = ['Breakfast', 'WiFi', 'Parking', 'Pool', 'Gym', 'Spa', 'Late checkout'];
  const dates = generateFutureDates(Math.floor(Math.random() * 60) + 1, Math.floor(Math.random() * 10) + 1);
  return {
    firstname: firstnames[Math.floor(Math.random() * firstnames.length)],
    lastname: lastnames[Math.floor(Math.random() * lastnames.length)],
    totalprice: Math.floor(Math.random() * 500) + 50,
    depositpaid: Math.random() > 0.5,
    bookingdates: dates,
    additionalneeds: Math.random() > 0.5 ? additionalneeds[Math.floor(Math.random() * additionalneeds.length)] : undefined,
  };
};

