/**
 * Playwright-BDD Configuration
 * Generates Playwright tests from Gherkin feature files
 */
import { defineConfig } from '@playwright/test';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';

const testDir = defineBddConfig({
  paths: ['tests/bdd/features/**/*.feature'],
  require: ['tests/bdd/steps/**/*.ts'],
  importTestFrom: 'fixtures/bdd-fixtures.ts',
});

export default defineConfig({
  testDir,
  reporter: [
    cucumberReporter('html', { outputFile: 'reports/bdd/cucumber-report.html' }),
    ['html', { outputFolder: 'reports/bdd/playwright-html' }],
    ['list'],
  ],
  use: {
    screenshot: 'on',
    video: 'on',
    trace: 'on',
  },
  timeout: 30000,
  fullyParallel: true,
});
