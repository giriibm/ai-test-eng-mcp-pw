# API Test Automation Prompt - Restful-Booker API

## 🎯 Objective
Create a comprehensive, production-ready API test automation suite for the Restful-Booker API using Playwright Test framework with TypeScript.

---

## 📋 Requirements

### Application Under Test (AUT)
- **API**: Restful-Booker API
- **Base URL**: https://restful-booker.herokuapp.com
- **Documentation**: https://restful-booker.herokuapp.com/apidoc/index.html
- **Type**: Hotel booking REST API
- **Authentication**: Token-based and Basic Auth

### Test Framework
- **Framework**: Playwright Test (TypeScript)
- **Pattern**: Service Layer Architecture
- **Organization**: Separate test files by functionality
- **Data Management**: Centralized test data with type safety

---

## 🏗️ Architecture Requirements

### Folder Structure
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
├── BaseApiClient.ts        # Base HTTP client with common methods
├── AuthService.ts          # Authentication service
└── BookingService.ts       # Booking CRUD service

test-data/api/              # Test data management
└── booking-test-data.ts    # Test data constants & generators

util/manual-tests/          # Documentation
└── api-manual-test-cases.md # Manual test cases (32 test cases)
```

### Service Layer Pattern

**BaseApiClient.ts** - Base HTTP client:
```typescript
- Methods: GET, POST, PUT, PATCH, DELETE
- Request context management
- Common headers handling
- Response parsing utilities
```

**AuthService.ts** - Authentication:
```typescript
- createToken(credentials): Generate auth token
- getToken(response): Extract token from response
- createAuthCookie(token): Create Cookie header
- createBasicAuthHeader(credentials): Create Basic Auth header
```

**BookingService.ts** - Booking operations:
```typescript
- createBooking(data): Create new booking
- getAllBookingIds(filters?): Get all booking IDs with optional filters
- getBookingById(id): Get specific booking details
- updateBooking(id, data, authHeaders): Full update (PUT)
- partialUpdateBooking(id, data, authHeaders): Partial update (PATCH)
- deleteBooking(id, authHeaders): Delete booking
- getBookingIdFromResponse(response): Extract booking ID
- buildQueryString(filters): Build query parameters
```

---

## 📊 Test Coverage Requirements

### 1. Authentication Tests (4 tests)
- ✅ TC-AUTH-001: Generate auth token with valid credentials
- ✅ TC-AUTH-002: Generate auth token with invalid credentials
- ✅ TC-AUTH-003: Verify auth cookie format
- ✅ TC-AUTH-004: Verify basic auth header format

### 2. Booking Creation Tests (8 tests)
- ✅ TC-BOOKING-001: Create booking with all fields - Happy path
- ✅ TC-BOOKING-002: Create booking with minimum required fields
- ✅ TC-BOOKING-003: Create booking with invalid date range
- ✅ TC-BOOKING-004: Create booking with missing required field
- ✅ TC-BOOKING-005: Create booking with special characters in names
- ✅ TC-BOOKING-006: Create booking with numeric names
- ✅ TC-BOOKING-007: Create booking with zero price
- ✅ TC-BOOKING-008: Create booking with negative price

### 3. Get Booking Tests (8 tests)
- ✅ TC-GET-001: Get all booking IDs
- ✅ TC-GET-002: Get booking by ID - Valid ID
- ✅ TC-GET-003: Get booking by ID - Invalid ID
- ✅ TC-GET-004: Get bookings filtered by firstname
- ✅ TC-GET-005: Get bookings filtered by lastname
- ✅ TC-GET-006: Get bookings filtered by date range
- ✅ TC-GET-007: Get bookings with multiple filters
- ✅ TC-GET-008: Get bookings with non-matching filter

### 4. Update Booking Tests (7 tests)
- ✅ TC-UPDATE-001: Full update with valid token
- ✅ TC-UPDATE-002: Partial update with valid token
- ✅ TC-UPDATE-003: Update without authentication
- ✅ TC-UPDATE-004: Update non-existent booking
- ✅ TC-UPDATE-005: Update with invalid token
- ✅ TC-UPDATE-006: Partial update multiple fields
- ✅ TC-UPDATE-007: Update with Basic Auth header

### 5. Delete Booking Tests (6 tests)
- ✅ TC-DELETE-001: Delete booking with valid token
- ✅ TC-DELETE-002: Delete without authentication
- ✅ TC-DELETE-003: Delete non-existent booking
- ✅ TC-DELETE-004: Delete with invalid token
- ✅ TC-DELETE-005: Delete already deleted booking
- ✅ TC-DELETE-006: Verify delete is permanent

### 6. End-to-End Tests (4 tests)
- ✅ TC-E2E-001: Complete booking lifecycle - Create, Read, Update, Delete
- ✅ TC-E2E-002: Multiple bookings management
- ✅ TC-E2E-003: Unauthorized operations flow
- ✅ TC-E2E-004: Stress test - Create and delete multiple bookings

**Total: 37 Automated Tests**

---

## 🎨 Test Data Requirements

### Authentication Credentials
```typescript
export const VALID_AUTH = {
  username: 'admin',
  password: 'password123',
};

export const INVALID_AUTH = {
  username: 'invalid',
  password: 'wrong',
};
```

### Booking Test Data Templates
- `COMPLETE_BOOKING`: Full booking with all fields
- `MINIMUM_BOOKING`: Only required fields
- `UPDATED_BOOKING`: Data for update operations
- `SPECIAL_CHARS_BOOKING`: Names with special characters
- `NUMERIC_NAMES_BOOKING`: Numeric firstname/lastname
- `ZERO_PRICE_BOOKING`: Zero price scenario
- `NEGATIVE_PRICE_BOOKING`: Negative price scenario
- `INVALID_DATE_BOOKING`: Checkout before checkin

### Helper Functions
```typescript
generateRandomBooking(): BookingData
generateFutureDates(daysFromNow, duration): { checkin, checkout }
```

---

## 🔧 Configuration Requirements

### Playwright Config Updates
```typescript
// Add API-Tests project
projects: [
  {
    name: 'API-Tests',
    testMatch: /tests\/api\/.*\.spec\.ts/,
    use: {
      baseURL: 'https://restful-booker.herokuapp.com',
    },
  },
]
```

### Package.json Scripts
```json
{
  "test:api": "playwright test tests/api",
  "test:api:headed": "playwright test tests/api --headed",
  "test:api:debug": "playwright test tests/api --debug",
  "test:ui": "playwright test tests/ui",
  "test": "playwright test"
}
```

---

## ✅ Test Implementation Best Practices

### 1. Use beforeAll/beforeEach for Setup
```typescript
let authService: AuthService;
let bookingService: BookingService;

test.beforeAll(async ({ request }) => {
  authService = new AuthService(request);
  bookingService = new BookingService(request);
});
```

### 2. Console Logging for Debugging
```typescript
console.log('✓ Token generated successfully:', token);
console.log('✓ Booking created with ID:', bookingId);
console.log('System behavior: Status 500 for missing firstname');
```

### 3. Proper Assertions
```typescript
expect(response.status()).toBe(200);
expect(bookingData.firstname).toBe('John');
expect(Array.isArray(bookings)).toBeTruthy();
```

### 4. Status Code Verification
```typescript
// Success cases
expect(response.status()).toBe(200); // GET/PUT/PATCH success
expect(response.status()).toBe(201); // DELETE success

// Error cases
expect(response.status()).toBe(403); // Forbidden
expect(response.status()).toBe(404); // Not found
expect(response.status()).toBe(405); // Method not allowed
```

### 5. Response Data Validation
```typescript
const jsonData = await response.json();
expect(jsonData).toHaveProperty('bookingid');
expect(jsonData.booking.firstname).toBe(expectedFirstname);
```

---

## 🧪 Test Execution Examples

### Run All API Tests
```bash
npm run test:api
```

**Expected Output:**
```
Running 37 tests using 6 workers

  37 passed (23.3s)
```

### Run Specific Category
```bash
# Auth tests only
npx playwright test tests/api/auth

# Booking CRUD tests
npx playwright test tests/api/booking

# E2E tests
npx playwright test tests/api/e2e
```

### Run Single Test File
```bash
npx playwright test tests/api/booking/create-booking.spec.ts
```

### Debug Mode
```bash
npm run test:api:debug
```

### View HTML Report
```bash
npx playwright show-report
```

---

## 📝 Sample Test Implementation

### Example: Authentication Test
```typescript
test('TC-AUTH-001: Generate auth token with valid credentials', async () => {
  // Arrange
  const credentials = VALID_AUTH;

  // Act
  const response = await authService.createToken(credentials);
  const token = await authService.getToken(response);

  // Assert
  expect(response.status()).toBe(200);
  expect(token).toBeTruthy();
  expect(typeof token).toBe('string');
  expect(token.length).toBeGreaterThan(0);
  
  console.log('✓ Token generated successfully:', token);
});
```

### Example: CRUD Test
```typescript
test('TC-BOOKING-001: Create booking with all fields - Happy path', async () => {
  // Arrange
  const bookingData = COMPLETE_BOOKING;

  // Act
  const response = await bookingService.createBooking(bookingData);
  const bookingId = await bookingService.getBookingIdFromResponse(response);

  // Assert
  expect(response.status()).toBe(200);
  expect(bookingId).toBeGreaterThan(0);
  
  const responseBody = await response.json();
  expect(responseBody.booking.firstname).toBe(bookingData.firstname);
  
  console.log('✓ Booking created successfully with ID:', bookingId);
});
```

### Example: E2E Test
```typescript
test('TC-E2E-001: Complete booking lifecycle', async () => {
  console.log('🚀 Starting complete CRUD lifecycle test');

  // 1. Generate auth token
  const tokenResponse = await authService.createToken(VALID_AUTH);
  const authToken = await authService.getToken(tokenResponse);
  const authHeaders = authService.createAuthCookie(authToken);
  console.log('✓ Step 1: Auth token generated');

  // 2. Create booking
  const createResponse = await bookingService.createBooking(COMPLETE_BOOKING);
  const bookingId = await bookingService.getBookingIdFromResponse(createResponse);
  expect(createResponse.status()).toBe(200);
  console.log('✓ Step 2: Booking created with ID', bookingId);

  // 3. Read booking
  const getResponse = await bookingService.getBookingById(bookingId);
  expect(getResponse.status()).toBe(200);
  console.log('✓ Step 3: Booking retrieved and verified');

  // 4. Update booking
  const updateResponse = await bookingService.partialUpdateBooking(
    bookingId,
    { firstname: 'Updated' },
    authHeaders
  );
  expect(updateResponse.status()).toBe(200);
  console.log('✓ Step 4: Booking updated');

  // 5. Delete booking
  const deleteResponse = await bookingService.deleteBooking(bookingId, authHeaders);
  expect(deleteResponse.status()).toBe(201);
  console.log('✓ Step 5: Booking deleted');

  // 6. Verify deletion
  const verifyResponse = await bookingService.getBookingById(bookingId);
  expect(verifyResponse.status()).toBe(404);
  console.log('✓ Step 6: Deletion verified');

  console.log('✅ Complete CRUD lifecycle successful!');
});
```

---

## 🎯 Success Criteria

### Test Execution
- ✅ All 37 tests passing (100% success rate)
- ✅ Tests run in parallel (6 workers)
- ✅ Average execution time < 30 seconds
- ✅ No flaky tests

### Code Quality
- ✅ TypeScript type safety throughout
- ✅ Service layer pattern implemented
- ✅ DRY principles followed
- ✅ Reusable test data
- ✅ Clear test naming conventions

### Documentation
- ✅ Manual test cases documented (32 cases)
- ✅ README with usage examples
- ✅ Test IDs traceable
- ✅ Architecture documented

### Coverage
- ✅ All CRUD operations covered
- ✅ Authentication scenarios complete
- ✅ Authorization tests included
- ✅ Edge cases tested
- ✅ E2E workflows automated

---

## 🚀 Deliverables

1. **Test Suite** (37 automated tests)
   - 6 test spec files
   - ~941 lines of test code
   - 100% passing tests

2. **Service Layer** (3 service classes)
   - BaseApiClient.ts
   - AuthService.ts
   - BookingService.ts

3. **Test Data** (1 test data file)
   - booking-test-data.ts with 8+ data templates
   - Helper functions for dynamic data

4. **Documentation**
   - tests/api/README.md (comprehensive guide)
   - util/manual-tests/api-manual-test-cases.md (32 manual cases)

5. **Configuration**
   - playwright.config.ts updates
   - package.json scripts

6. **Test Reports**
   - HTML reports with traces
   - Screenshots on failure
   - Detailed execution logs

---

## 🎬 Demo Instructions

### 1. Run All Tests
```bash
npm run test:api
```

### 2. View Test Report
```bash
npx playwright show-report
```

### 3. Run Specific Category
```bash
# Show available tests
npx playwright test tests/api --list

# Run auth tests
npx playwright test tests/api/auth

# Run with UI mode
npx playwright test tests/api --ui
```

### 4. Debug a Test
```bash
# Debug mode
npx playwright test tests/api/booking/create-booking.spec.ts --debug

# Headed mode
npx playwright test tests/api/e2e --headed --workers=1
```

### 5. Check Test Coverage
```bash
# List all test names
npm run test:api -- --list

# Count tests
grep -r "test(" tests/api/ --include="*.spec.ts" | wc -l
```

---

## 📈 Metrics & Results

- **Total Tests**: 37
- **Test Files**: 6
- **Service Classes**: 3
- **Test Data Templates**: 8+
- **Lines of Code**: ~941 (tests only)
- **Execution Time**: ~20-25 seconds
- **Success Rate**: 100%
- **Code Coverage**: 116% of manual test cases
- **Parallel Workers**: 6

---

## 🎓 Key Learnings

1. **Service Layer Pattern** provides clean, maintainable API test code
2. **TypeScript interfaces** ensure type safety and better IDE support
3. **Centralized test data** makes tests easier to maintain
4. **Descriptive logging** helps with debugging and understanding test flow
5. **E2E tests** validate complete user workflows beyond individual operations
6. **Proper test organization** by functionality makes suite scalable

---

## 🔮 Future Enhancements (Optional)

1. **Security Tests**: SQL injection, XSS, authentication bypass
2. **Performance Tests**: Response time validation, load testing
3. **Contract Testing**: Schema validation with JSON Schema
4. **CI/CD Integration**: GitHub Actions, Jenkins pipeline
5. **Cross-Environment**: Dev, staging, production configurations
6. **Mocking**: API mocking for faster unit tests
7. **Data Factories**: Complex test data generation

---

## ✅ Conclusion

This prompt will generate a **production-ready, enterprise-grade API test automation suite** with:
- Comprehensive test coverage (37 tests)
- Professional architecture (service layer pattern)
- Type-safe implementation (TypeScript)
- Excellent documentation (README + manual cases)
- 100% test success rate

**Status**: Ready for production use and continuous integration.
