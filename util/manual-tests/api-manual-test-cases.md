# Restful-Booker API - Manual Test Cases

## Base URL
`https://restful-booker.herokuapp.com`

## API Documentation
https://restful-booker.herokuapp.com/apidoc/index.html

---

## 1. Authentication Test Cases

### TC-AUTH-001: Generate Auth Token - Valid Credentials
**Priority:** High
**Precondition:** None
**Steps:**
1. POST /auth
2. Body: `{"username": "admin", "password": "password123"}`
3. Verify response status: 200
4. Verify response contains "token" field
5. Verify token is not empty string

**Expected Result:** Token successfully generated
**Test Data:** Valid credentials (admin/password123)

---

### TC-AUTH-002: Generate Auth Token - Invalid Credentials
**Priority:** High
**Precondition:** None
**Steps:**
1. POST /auth
2. Body: `{"username": "invalid", "password": "wrong"}`
3. Verify response status: 200
4. Verify response contains "reason": "Bad credentials"

**Expected Result:** Authentication fails with appropriate message
**Test Data:** Invalid credentials

---

## 2. Booking Creation Test Cases

### TC-BOOKING-001: Create Booking - Happy Path
**Priority:** High
**Precondition:** None
**Steps:**
1. POST /booking
2. Body:
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "totalprice": 111,
  "depositpaid": true,
  "bookingdates": {
    "checkin": "2024-01-01",
    "checkout": "2024-01-02"
  },
  "additionalneeds": "Breakfast"
}
```
3. Verify response status: 200
4. Verify "bookingid" is returned and is a number
5. Verify booking details match input data

**Expected Result:** Booking created successfully with valid ID
**Test Data:** Complete booking with all fields

---

### TC-BOOKING-002: Create Booking - Minimum Required Fields
**Priority:** Medium
**Precondition:** None
**Steps:**
1. POST /booking
2. Body with only required fields:
```json
{
  "firstname": "Jane",
  "lastname": "Smith",
  "totalprice": 100,
  "depositpaid": false,
  "bookingdates": {
    "checkin": "2024-02-01",
    "checkout": "2024-02-05"
  }
}
```
3. Verify response status: 200
4. Verify booking created without optional "additionalneeds"

**Expected Result:** Booking created with minimum required fields
**Test Data:** Booking without additionalneeds

---

### TC-BOOKING-003: Create Booking - Invalid Date Range
**Priority:** Medium
**Precondition:** None
**Steps:**
1. POST /booking
2. Body with checkout date before checkin:
```json
{
  "firstname": "Test",
  "lastname": "User",
  "totalprice": 150,
  "depositpaid": true,
  "bookingdates": {
    "checkin": "2024-05-10",
    "checkout": "2024-05-05"
  }
}
```
3. Verify system behavior (may accept or reject)

**Expected Result:** System behavior documented
**Test Data:** Invalid date range

---

### TC-BOOKING-004: Create Booking - Missing Required Fields
**Priority:** High
**Precondition:** None
**Steps:**
1. POST /booking
2. Body with missing firstname:
```json
{
  "lastname": "Test",
  "totalprice": 100,
  "depositpaid": true,
  "bookingdates": {
    "checkin": "2024-01-01",
    "checkout": "2024-01-02"
  }
}
```
3. Verify response handles missing required field

**Expected Result:** Appropriate error response or default behavior
**Test Data:** Incomplete booking data

---

### TC-BOOKING-005: Create Booking - Special Characters in Names
**Priority:** Medium
**Precondition:** None
**Steps:**
1. POST /booking
2. Body with special characters:
```json
{
  "firstname": "John-O'Neil",
  "lastname": "Smith & Jones",
  "totalprice": 200,
  "depositpaid": true,
  "bookingdates": {
    "checkin": "2024-03-01",
    "checkout": "2024-03-05"
  }
}
```
3. Verify response status: 200
4. Verify special characters preserved

**Expected Result:** Special characters handled correctly
**Test Data:** Names with special characters

---

## 3. Get Booking Test Cases

### TC-GET-001: Get All Booking IDs
**Priority:** High
**Precondition:** At least one booking exists
**Steps:**
1. GET /booking
2. Verify response status: 200
3. Verify response is an array
4. Verify array contains objects with "bookingid" field

**Expected Result:** List of all booking IDs returned
**Test Data:** None

---

### TC-GET-002: Get Booking by ID - Valid ID
**Priority:** High
**Precondition:** Valid booking ID exists
**Steps:**
1. GET /booking/{id}
2. Verify response status: 200
3. Verify response contains all booking fields:
   - firstname
   - lastname
   - totalprice
   - depositpaid
   - bookingdates (checkin, checkout)
4. Verify data types are correct

**Expected Result:** Complete booking details returned
**Test Data:** Valid booking ID

---

### TC-GET-003: Get Booking by ID - Invalid ID
**Priority:** High
**Precondition:** None
**Steps:**
1. GET /booking/999999
2. Verify response status: 404

**Expected Result:** Not found error returned
**Test Data:** Non-existent booking ID

---

### TC-GET-004: Get Bookings by Firstname Filter
**Priority:** Medium
**Precondition:** Booking with firstname="Sally" exists
**Steps:**
1. GET /booking?firstname=Sally
2. Verify response status: 200
3. Verify returned bookings match filter criteria
4. Verify only matching bookings returned

**Expected Result:** Filtered booking IDs returned
**Test Data:** Firstname filter

---

### TC-GET-005: Get Bookings by Lastname Filter
**Priority:** Medium
**Precondition:** Booking with lastname="Brown" exists
**Steps:**
1. GET /booking?lastname=Brown
2. Verify response status: 200
3. Verify filtered results

**Expected Result:** Lastname-filtered booking IDs returned
**Test Data:** Lastname filter

---

### TC-GET-006: Get Bookings by Date Filter
**Priority:** Medium
**Precondition:** Bookings with specific dates exist
**Steps:**
1. GET /booking?checkin=2024-01-01&checkout=2024-01-02
2. Verify response status: 200
3. Verify results match date criteria

**Expected Result:** Date-filtered booking IDs returned
**Test Data:** Date range filter

---

## 4. Update Booking Test Cases

### TC-UPDATE-001: Full Update - Valid Token
**Priority:** High
**Precondition:** Valid booking ID and auth token exist
**Steps:**
1. PUT /booking/{id}
2. Headers: `Cookie: token={token}`
3. Body with all updated fields:
```json
{
  "firstname": "Updated",
  "lastname": "Name",
  "totalprice": 999,
  "depositpaid": false,
  "bookingdates": {
    "checkin": "2024-06-01",
    "checkout": "2024-06-10"
  },
  "additionalneeds": "Updated needs"
}
```
4. Verify response status: 200
5. Verify ALL fields updated correctly

**Expected Result:** Booking fully updated
**Test Data:** Complete updated booking data

---

### TC-UPDATE-002: Partial Update - Valid Token
**Priority:** High
**Precondition:** Valid booking ID and auth token exist
**Steps:**
1. PATCH /booking/{id}
2. Headers: `Cookie: token={token}`
3. Body: `{"firstname": "PartialUpdate"}`
4. Verify response status: 200
5. Verify only firstname changed
6. Verify other fields unchanged

**Expected Result:** Partial update successful
**Test Data:** Single field update

---

### TC-UPDATE-003: Update Without Authentication
**Priority:** High
**Precondition:** Valid booking ID exists
**Steps:**
1. PUT /booking/{id}
2. No authentication header/cookie
3. Body with valid data
4. Verify response status: 403

**Expected Result:** Forbidden - authentication required
**Test Data:** Valid booking data without auth

---

### TC-UPDATE-004: Update Non-existent Booking
**Priority:** Medium
**Precondition:** Valid auth token exists
**Steps:**
1. PUT /booking/999999
2. Headers: `Cookie: token={token}`
3. Body with valid data
4. Verify response status: 405

**Expected Result:** Method not allowed or not found
**Test Data:** Non-existent booking ID

---

### TC-UPDATE-005: Update with Invalid Token
**Priority:** High
**Precondition:** Valid booking ID exists
**Steps:**
1. PUT /booking/{id}
2. Headers: `Cookie: token=invalidtoken123`
3. Body with valid data
4. Verify response status: 403

**Expected Result:** Forbidden - invalid authentication
**Test Data:** Invalid token

---

## 5. Delete Booking Test Cases

### TC-DELETE-001: Delete Booking - Valid Token
**Priority:** High
**Precondition:** Valid booking ID and auth token exist
**Steps:**
1. DELETE /booking/{id}
2. Headers: `Cookie: token={token}`
3. Verify response status: 201
4. GET /booking/{id} to verify deletion
5. Verify GET returns status: 404

**Expected Result:** Booking deleted successfully
**Test Data:** Valid booking ID and token

---

### TC-DELETE-002: Delete Without Authentication
**Priority:** High
**Precondition:** Valid booking ID exists
**Steps:**
1. DELETE /booking/{id}
2. No authentication header/cookie
3. Verify response status: 403

**Expected Result:** Forbidden - authentication required
**Test Data:** No authentication

---

### TC-DELETE-003: Delete Non-existent Booking
**Priority:** Medium
**Precondition:** Valid auth token exists
**Steps:**
1. DELETE /booking/999999
2. Headers: `Cookie: token={token}`
3. Verify response status: 405

**Expected Result:** Method not allowed
**Test Data:** Non-existent booking ID

---

### TC-DELETE-004: Delete with Invalid Token
**Priority:** High
**Precondition:** Valid booking ID exists
**Steps:**
1. DELETE /booking/{id}
2. Headers: `Cookie: token=invalidtoken123`
3. Verify response status: 403

**Expected Result:** Forbidden - invalid authentication
**Test Data:** Invalid token

---

## 6. End-to-End Test Cases

### TC-E2E-001: Complete Booking Lifecycle
**Priority:** Critical
**Precondition:** Valid credentials available
**Steps:**
1. Generate auth token
2. Create new booking - capture booking ID
3. GET booking by ID - verify creation
4. PATCH booking - update firstname
5. GET booking by ID - verify update
6. DELETE booking
7. GET booking by ID - verify deletion (404)

**Expected Result:** Complete CRUD lifecycle successful
**Test Data:** Full booking lifecycle

---

### TC-E2E-002: Multiple Bookings Management
**Priority:** High
**Precondition:** Valid credentials available
**Steps:**
1. Generate auth token
2. Create 3 different bookings
3. GET all bookings - verify count increased by 3
4. Filter by firstname - verify results
5. Update one booking
6. Delete one booking
7. Verify final state

**Expected Result:** Multiple bookings managed correctly
**Test Data:** Multiple booking records

---

### TC-E2E-003: Unauthorized Operations Flow
**Priority:** High
**Precondition:** Valid booking exists
**Steps:**
1. Create booking (no auth needed)
2. Attempt UPDATE without auth - verify 403
3. Attempt DELETE without auth - verify 403
4. Generate auth token
5. Successfully UPDATE booking
6. Successfully DELETE booking

**Expected Result:** Auth flow works as expected
**Test Data:** Auth and non-auth operations

---

## 7. Negative Test Cases

### TC-NEG-001: Invalid Content Type
**Priority:** Medium
**Precondition:** None
**Steps:**
1. POST /booking
2. Headers: `Content-Type: text/plain`
3. Body: Plain text instead of JSON
4. Verify error response

**Expected Result:** Appropriate error for invalid content type
**Test Data:** Invalid content type

---

### TC-NEG-002: Malformed JSON
**Priority:** Medium
**Precondition:** None
**Steps:**
1. POST /booking
2. Body: Malformed JSON string
3. Verify error response

**Expected Result:** JSON parse error returned
**Test Data:** Invalid JSON

---

### TC-NEG-003: SQL Injection Attempt
**Priority:** High
**Precondition:** None
**Steps:**
1. POST /booking
2. Body with SQL injection in firstname:
```json
{
  "firstname": "'; DROP TABLE bookings;--",
  "lastname": "Test",
  "totalprice": 100,
  "depositpaid": true,
  "bookingdates": {
    "checkin": "2024-01-01",
    "checkout": "2024-01-02"
  }
}
```
3. Verify booking created safely or rejected
4. Verify system integrity

**Expected Result:** SQL injection prevented
**Test Data:** SQL injection payload

---

### TC-NEG-004: XSS Attempt
**Priority:** High
**Precondition:** None
**Steps:**
1. POST /booking
2. Body with XSS payload:
```json
{
  "firstname": "<script>alert('XSS')</script>",
  "lastname": "Test",
  "totalprice": 100,
  "depositpaid": true,
  "bookingdates": {
    "checkin": "2024-01-01",
    "checkout": "2024-01-02"
  }
}
```
3. GET booking to verify encoding
4. Verify script not executed

**Expected Result:** XSS prevented/escaped
**Test Data:** XSS payload

---

### TC-NEG-005: Extremely Large Data
**Priority:** Medium
**Precondition:** None
**Steps:**
1. POST /booking
2. Body with very long strings (10000+ chars)
3. Verify system behavior

**Expected Result:** System handles gracefully
**Test Data:** Large payload

---

## 8. Performance Test Cases

### TC-PERF-001: Response Time - Get All Bookings
**Priority:** Medium
**Precondition:** Database populated
**Steps:**
1. GET /booking
2. Measure response time
3. Verify < 2 seconds

**Expected Result:** Acceptable performance
**Test Data:** None

---

### TC-PERF-002: Concurrent Booking Creation
**Priority:** Medium
**Precondition:** None
**Steps:**
1. Send 10 concurrent POST /booking requests
2. Verify all requests succeed
3. Verify no data corruption
4. Measure average response time

**Expected Result:** System handles concurrent requests
**Test Data:** 10 simultaneous bookings

---

## Test Summary

| Category | Test Cases | Priority High | Priority Medium |
|----------|-----------|---------------|-----------------|
| Authentication | 2 | 2 | 0 |
| Booking Creation | 5 | 2 | 3 |
| Get Booking | 6 | 3 | 3 |
| Update Booking | 5 | 4 | 1 |
| Delete Booking | 4 | 3 | 1 |
| End-to-End | 3 | 3 | 0 |
| Negative | 5 | 2 | 3 |
| Performance | 2 | 0 | 2 |
| **Total** | **32** | **19** | **13** |

## Test Data Requirements

### Valid Credentials
- Username: `admin`
- Password: `password123`

### Sample Booking Templates
See individual test cases for specific test data

### Date Formats
- ISO 8601: YYYY-MM-DD
- Example: 2024-01-01

### Price Range
- Valid: 0 - 999999
- Test edge cases: 0, negative, very large numbers
