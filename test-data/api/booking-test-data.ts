import { BookingData } from '../../helpers/api/BookingService';

/**
 * Valid authentication credentials
 */
export const VALID_AUTH = {
  username: 'admin',
  password: 'password123',
};

/**
 * Invalid authentication credentials
 */
export const INVALID_AUTH = {
  username: 'invalid',
  password: 'wrong',
};

/**
 * Generate dynamic dates
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

/**
 * Complete booking data with all fields
 */
export const COMPLETE_BOOKING: BookingData = {
  firstname: 'John',
  lastname: 'Doe',
  totalprice: 111,
  depositpaid: true,
  bookingdates: {
    checkin: '2024-01-01',
    checkout: '2024-01-02',
  },
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
  bookingdates: {
    checkin: '2024-02-01',
    checkout: '2024-02-05',
  },
};

/**
 * Booking for update operations
 */
export const UPDATED_BOOKING: BookingData = {
  firstname: 'Updated',
  lastname: 'Name',
  totalprice: 999,
  depositpaid: false,
  bookingdates: {
    checkin: '2024-06-01',
    checkout: '2024-06-10',
  },
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
  bookingdates: {
    checkin: '2024-03-01',
    checkout: '2024-03-05',
  },
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
  bookingdates: {
    checkin: '2024-04-01',
    checkout: '2024-04-03',
  },
};

/**
 * Booking with invalid date range (checkout before checkin)
 */
export const INVALID_DATE_RANGE_BOOKING: BookingData = {
  firstname: 'Test',
  lastname: 'User',
  totalprice: 150,
  depositpaid: true,
  bookingdates: {
    checkin: '2024-05-10',
    checkout: '2024-05-05',
  },
};

/**
 * Booking with very long strings
 */
export const LONG_STRING_BOOKING: BookingData = {
  firstname: 'A'.repeat(255),
  lastname: 'B'.repeat(255),
  totalprice: 500,
  depositpaid: true,
  bookingdates: {
    checkin: '2024-07-01',
    checkout: '2024-07-10',
  },
  additionalneeds: 'C'.repeat(500),
};

/**
 * Booking with XSS payload
 */
export const XSS_BOOKING: BookingData = {
  firstname: "<script>alert('XSS')</script>",
  lastname: '<img src=x onerror=alert(1)>',
  totalprice: 100,
  depositpaid: true,
  bookingdates: {
    checkin: '2024-08-01',
    checkout: '2024-08-02',
  },
};

/**
 * Booking with SQL injection attempt
 */
export const SQL_INJECTION_BOOKING: BookingData = {
  firstname: "'; DROP TABLE bookings;--",
  lastname: "1' OR '1'='1",
  totalprice: 100,
  depositpaid: true,
  bookingdates: {
    checkin: '2024-09-01',
    checkout: '2024-09-02',
  },
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
    bookingdates: {
      checkin: '2024-10-01',
      checkout: '2024-10-05',
    },
    additionalneeds: 'Pool access',
  },
  {
    firstname: 'Bob',
    lastname: 'Williams',
    totalprice: 300,
    depositpaid: false,
    bookingdates: {
      checkin: '2024-10-10',
      checkout: '2024-10-15',
    },
    additionalneeds: 'Gym membership',
  },
  {
    firstname: 'Charlie',
    lastname: 'Brown',
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: '2024-10-20',
      checkout: '2024-10-22',
    },
  },
];

/**
 * Generate random booking data
 */
export const generateRandomBooking = (): BookingData => {
  const firstnames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
  const lastnames = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'];
  const additionalneeds = ['Breakfast', 'WiFi', 'Parking', 'Pool', 'Gym', 'Spa', 'Late checkout'];
  
  const dates = generateFutureDates(Math.floor(Math.random() * 60), Math.floor(Math.random() * 10) + 1);
  
  return {
    firstname: firstnames[Math.floor(Math.random() * firstnames.length)],
    lastname: lastnames[Math.floor(Math.random() * lastnames.length)],
    totalprice: Math.floor(Math.random() * 500) + 50,
    depositpaid: Math.random() > 0.5,
    bookingdates: dates,
    additionalneeds: Math.random() > 0.5 ? additionalneeds[Math.floor(Math.random() * additionalneeds.length)] : undefined,
  };
};
