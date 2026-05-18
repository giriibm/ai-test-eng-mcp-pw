/**
 * BDD Test Fixtures
 * Provides test context for Cucumber step definitions
 */
import { test as base, createBdd } from 'playwright-bdd';

// Create BDD test object with fixtures
export const test = base.extend({
  // Add custom fixtures here if needed
  testData: async ({}, use) => {
    const data = {
      // UI test data
      ui: {
        baseUrl: 'https://www.saucedemo.com',
        credentials: {
          username: 'standard_user',
          password: 'secret_sauce'
        }
      },
      // API test data
      api: {
        baseUrl: 'https://restful-booker.herokuapp.com',
        credentials: {
          username: 'admin',
          password: 'password123'
        }
      }
    };
    await use(data);
  }
});

export const { Given, When, Then } = createBdd(test);
