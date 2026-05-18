import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';

export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface BookingData {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export interface BookingResponse {
  bookingid: number;
  booking: BookingData;
}

export interface BookingFilter {
  firstname?: string;
  lastname?: string;
  checkin?: string;
  checkout?: string;
}

/**
 * Booking Service for Restful-Booker API
 * Handles all booking-related operations
 */
export class BookingService extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Create a new booking
   * @param bookingData - Booking details
   * @returns API response with booking ID and details
   */
  async createBooking(bookingData: BookingData): Promise<APIResponse> {
    return await this.post('/booking', bookingData);
  }

  /**
   * Get all booking IDs
   * @param filters - Optional filters (firstname, lastname, checkin, checkout)
   * @returns API response with array of booking IDs
   */
  async getAllBookingIds(filters?: BookingFilter): Promise<APIResponse> {
    const queryParams = filters ? this.buildQueryString(filters) : '';
    return await this.get(`/booking${queryParams}`);
  }

  /**
   * Get booking by ID
   * @param bookingId - Booking ID
   * @returns API response with booking details
   */
  async getBookingById(bookingId: number): Promise<APIResponse> {
    return await this.get(`/booking/${bookingId}`);
  }

  /**
   * Update booking (full update)
   * @param bookingId - Booking ID
   * @param bookingData - Complete updated booking data
   * @param authHeaders - Authentication headers (Cookie or Authorization)
   * @returns API response with updated booking
   */
  async updateBooking(
    bookingId: number,
    bookingData: BookingData,
    authHeaders: Record<string, string>
  ): Promise<APIResponse> {
    return await this.put(`/booking/${bookingId}`, bookingData, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...authHeaders,
      },
    });
  }

  /**
   * Partial update booking
   * @param bookingId - Booking ID
   * @param partialData - Partial booking data to update
   * @param authHeaders - Authentication headers
   * @returns API response with updated booking
   */
  async partialUpdateBooking(
    bookingId: number,
    partialData: Partial<BookingData>,
    authHeaders: Record<string, string>
  ): Promise<APIResponse> {
    return await this.patch(`/booking/${bookingId}`, partialData, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...authHeaders,
      },
    });
  }

  /**
   * Delete booking
   * @param bookingId - Booking ID
   * @param authHeaders - Authentication headers
   * @returns API response
   */
  async deleteBooking(bookingId: number, authHeaders: Record<string, string>): Promise<APIResponse> {
    return await this.delete(`/booking/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
    });
  }

  /**
   * Extract booking ID from create booking response
   */
  async getBookingIdFromResponse(response: APIResponse): Promise<number> {
    const body: BookingResponse = await this.getJsonResponse(response);
    return body.bookingid;
  }

  /**
   * Extract booking data from response
   */
  async getBookingDataFromResponse(response: APIResponse): Promise<BookingData> {
    return await this.getJsonResponse(response);
  }

  /**
   * Build query string from filters
   */
  private buildQueryString(filters: BookingFilter): string {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return params.toString() ? `?${params.toString()}` : '';
  }
}
