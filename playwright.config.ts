/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

// Playwright-BDD Configuration
const testDir = defineBddConfig({
  paths: ['tests/bdd/features/**/*.feature'],
  require: ['tests/bdd/steps/**/*.ts'],
});

/* Timestamp shared across all paths in this run — format: YYYY-MM-DD_HH-MM-SS */
const ts = new Date()
  .toISOString()
  .replace('T', '_')
  .replace(/:/g, '-')
  .slice(0, 19);

/**
 * Playwright Test Configuration
 * Supports both UI and API testing
 * 
 * Run commands:
 * - All tests: npx playwright test
 * - UI tests only: npx playwright test tests/ui
 * - API tests only: npx playwright test tests/api
 * - Specific project: npx playwright test --project="UI-Chrome"
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Test timeout */
  timeout: 30000,
  /* All test output lives under reports/<timestamp>/ so each run is preserved */
  outputDir: `reports/runs/${ts}/artifacts`,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: `reports/runs/${ts}/html-report` }],
    ['json', { outputFile: `reports/runs/${ts}/test-results.json` }],
    ['list'],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL for API tests */
    baseURL: 'https://restful-booker.herokuapp.com',
    
    /* Capture screenshot of every test — pass and fail — for report evidence */
    screenshot: 'on',
    /* Record HD video for every test so the report contains full visual playback */
    video: {
      mode: 'on',
      size: { width: 1280, height: 720 },
    },
    /* Collect trace for every test for the trace viewer */
    trace: 'on',
    
    /* Extra HTTP headers for API requests */
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },

  /* Configure projects for UI and API tests */
  projects: [
    // ========== BDD Smoke Tests ==========
    {
      name: 'BDD-Smoke',
      testDir: '.features-gen',
      testMatch: /.*\.feature\.spec\.js/,  // BDD generates .feature.spec.js files
      use: {
        ...devices['Desktop Chrome'],
        // BDD tests include both UI and API
        screenshot: 'on',
        video: 'on',
        trace: 'on',
      },
    },

    // ========== UI Tests ==========
    {
      name: 'UI-Chrome',
      testMatch: /tests\/ui\/.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        // UI tests don't use baseURL, so override it
        baseURL: undefined,
      },
    },

    // Uncomment for full cross-browser UI testing
    // {
    //   name: 'UI-Firefox',
    //   testMatch: /tests\/ui\/.*\.spec\.ts/,
    //   use: { 
    //     ...devices['Desktop Firefox'],
    //     baseURL: undefined,
    //   },
    // },

    // {
    //   name: 'UI-WebKit',
    //   testMatch: /tests\/ui\/.*\.spec\.ts/,
    //   use: { 
    //     ...devices['Desktop Safari'],
    //     baseURL: undefined,
    //   },
    // },

    // ========== API Tests ==========
    {
      name: 'API-Tests',
      testMatch: /tests\/api\/.*\.spec\.ts/,
      use: {
        // API tests don't need browser context
        baseURL: 'https://restful-booker.herokuapp.com',
        extraHTTPHeaders: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   testMatch: /tests\/ui\/.*\.spec\.ts/,
    //   use: { 
    //     ...devices['Pixel 5'],
    //     baseURL: undefined,
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   testMatch: /tests\/ui\/.*\.spec\.ts/,
    //   use: { 
    //     ...devices['iPhone 12'],
    //     baseURL: undefined,
    //   },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   testMatch: /tests\/ui\/.*\.spec\.ts/,
    //   use: { 
    //     ...devices['Desktop Edge'], 
    //     channel: 'msedge',
    //     baseURL: undefined,
    //   },
    // },
    // {
    //   name: 'Google Chrome',
    //   testMatch: /tests\/ui\/.*\.spec\.ts/,
    //   use: { 
    //     ...devices['Desktop Chrome'], 
    //     channel: 'chrome',
    //     baseURL: undefined,
    //   },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
