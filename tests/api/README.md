# Restful-Booker API Test Suite

Automated API testing for the Restful-Booker API using Playwright Test.

## 🎯 Overview

This test suite provides comprehensive API testing coverage for the [Restful-Booker API](https://restful-booker.herokuapp.com), including:
- Authentication tests
- CRUD operations (Create, Read, Update, Delete)
- End-to-end workflows
- Negative testing scenarios

## 📁 Structure

```
tests/api/
├── auth/                    # Authentication tests
│   └── auth.spec.ts
├── booking/                 # Booking CRUD operations
│   ├── create-booking.spec.ts
│   ├── get-booking.spec.ts
│   ├── update-booking.spec.ts
│   └── delete-booking.spec.ts
└── e2e/                     # End-to-end scenarios
    └── complete-lifecycle.spec.ts

helpers/api/                 # API service classes
├── BaseApiClient.ts        # Base HTTP client
├── AuthService.ts          # Authentication service
└── BookingService.ts       # Booking service

test-data/api/              # Test data
└── booking-test-data.ts    # Booking test data & helpers

docs/api/                   # Documentation
└── manual-test-cases.md    # Manual test cases (32 test cases)
```

## 🚀 Running Tests

### All API Tests
```bash
npx playwright test tests/api
```

### Specific Test Categories
```bash
# Authentication tests
npx playwright test tests/api/auth

# Booking tests
npx playwright test tests/api/booking

# End-to-end tests
npx playwright test tests/api/e2e
```

### Specific Test File
```bash
npx playwright test tests/api/booking/create-booking.spec.ts
```

### Run with UI Mode
```bash
npx playwright test tests/api --ui
```

### Generate Report
```bash
npx playwright show-report
```

## 📊 Test Coverage

| Category | Test Count | Priority High | Priority Medium |
|----------|-----------|---------------|-----------------|
| Authentication | 4 | 2 | 2 |
| Create Booking | 8 | 2 | 6 |
| Get Booking | 8 | 3 | 5 |
| Update Booking | 7 | 4 | 3 |
| Delete Booking | 6 | 3 | 3 |
| End-to-End | 4 | 3 | 1 |
| **Total** | **37** | **17** | **20** |

## 🧪 Test Examples

### Authentication Test
```typescript
test('Generate auth token with valid credentials', async () => {
  const response = await authService.createToken(VALID_AUTH);
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('token');
});
```

### Create Booking Test
```typescript
test('Create booking with all fields', async () => {
  const response = await bookingService.createBooking(COMPLETE_BOOKING);
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('bookingid');
  expect(body.booking.firstname).toBe(COMPLETE_BOOKING.firstname);
});
```

### End-to-End Test
```typescript
test('Complete CRUD lifecycle', async () => {
  // Create → Read → Update → Delete
  const authToken = await authService.createToken(VALID_AUTH);
  const booking = await bookingService.createBooking(data);
  const bookingId = await bookingService.getBookingIdFromResponse(booking);
  await bookingService.updateBooking(bookingId, updatedData, authHeaders);
  await bookingService.deleteBooking(bookingId, authHeaders);
  const deleted = await bookingService.getBookingById(bookingId);
  expect(deleted.status()).toBe(404);
});
```

## 🔧 Configuration

API tests use a dedicated project configuration in `playwright.config.ts`:

```typescript
{
  name: 'API-Tests',
  testMatch: /tests\/api\/.*\.spec\.ts/,
  use: {
    baseURL: 'https://restful-booker.herokuapp.com',
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },
}
```

## 📝 API Endpoints Tested

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/auth` | POST | Create token | No |
| `/booking` | GET | Get all booking IDs | No |
| `/booking` | POST | Create booking | No |
| `/booking/{id}` | GET | Get booking by ID | No |
| `/booking/{id}` | PUT | Update booking | Yes |
| `/booking/{id}` | PATCH | Partial update | Yes |
| `/booking/{id}` | DELETE | Delete booking | Yes |

## 🔐 Authentication

Tests use token-based authentication:

```typescript
// Generate token
const tokenResponse = await authService.createToken({
  username: 'admin',
  password: 'password123'
});
const token = await authService.getToken(tokenResponse);

// Use token in requests
const authHeaders = authService.createAuthCookie(token);
await bookingService.deleteBooking(id, authHeaders);
```

## 🎨 Service Pattern

Tests use a service layer pattern for clean, maintainable code:

```typescript
// BaseApiClient - HTTP methods
class BaseApiClient {
  async get(endpoint: string): Promise<APIResponse>
  async post(endpoint: string, data: any): Promise<APIResponse>
  async put(endpoint: string, data: any): Promise<APIResponse>
  async patch(endpoint: string, data: any): Promise<APIResponse>
  async delete(endpoint: string): Promise<APIResponse>
}

// AuthService - Authentication operations
class AuthService extends BaseApiClient {
  async createToken(credentials: AuthCredentials)
  async getToken(response: APIResponse)
  createAuthCookie(token: string)
}

// BookingService - Booking operations
class BookingService extends BaseApiClient {
  async createBooking(bookingData: BookingData)
  async getAllBookingIds(filters?: BookingFilter)
  async getBookingById(bookingId: number)
  async updateBooking(bookingId, data, authHeaders)
  async deleteBooking(bookingId, authHeaders)
}
```

## 📚 Manual Test Cases

For complete manual test case documentation, see [docs/api/manual-test-cases.md](../../docs/api/manual-test-cases.md)

## 🐛 Debugging

### View Detailed Logs
```bash
npx playwright test tests/api --debug
```

### View Test Report
```bash
npx playwright show-report
```

### Run Single Test with Trace
```bash
npx playwright test tests/api/booking/create-booking.spec.ts --trace on
```

## 🔬 Advanced Features

### Dynamic Test Data
```typescript
import { generateRandomBooking } from '../../test-data/api/booking-test-data';

const booking = generateRandomBooking();
const response = await bookingService.createBooking(booking);
```

### Filtering Tests
```typescript
// By name
npx playwright test tests/api -g "authentication"

// By tag
npx playwright test tests/api --project="API-Tests"
```

## 📈 CI/CD Integration

Run in CI environments:
```bash
CI=true npx playwright test tests/api
```

This enables:
- Automatic retries (2x)
- Serial execution (workers=1)
- Strict mode (fails on test.only)

## 🤝 Contributing

When adding new tests:
1. Create manual test case in `docs/api/manual-test-cases.md`
2. Implement automated test in appropriate category folder
3. Use existing service classes for API calls
4. Follow naming convention: `TC-CATEGORY-###: Description`
5. Add console logs for test steps

## 📖 Resources

- [Playwright API Testing Docs](https://playwright.dev/docs/api-testing)
- [Restful-Booker API Docs](https://restful-booker.herokuapp.com/apidoc/index.html)
- [Project README](../../README.md)
