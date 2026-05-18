Feature: Booking API Smoke Tests
  As an API consumer
  I want to perform complete booking operations
  So that I can manage hotel reservations

  Background:
    Given the Restful-Booker API is accessible

  Scenario: Complete booking lifecycle - Create, Retrieve, Update, Delete
    Given authentication token is obtained with username "admin" and password "password123"
    When a new booking is created with firstname "John", lastname "Doe", totalprice 200, depositpaid true, checkin "2026-06-01", checkout "2026-06-05"
    Then the booking should be created with status code 200
    And the response should contain a valid booking ID
    And the booking should be retrievable by ID
    When the booking dates are updated to checkin "2026-07-01" and checkout "2026-07-10"
    Then the update should return status code 200
    And the booking should reflect checkin date "2026-07-01"
    And the booking should reflect checkout date "2026-07-10"
    And the booking firstname should still be "John"
    When the booking is deleted
    Then the deletion should return status code 201
    And the booking should no longer exist with status code 404
