const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000',
    supportFile: './src/tests/cypress/support/e2e.js',
    downloadsFolder:'./src/tests/cypress/downloads',
    fixturesFolder:'./src/tests/cypress/fixtures',
    screenshotsFolder: './src/tests/cypress/screenshots',
    videosFolder: './src/tests/cypress/videos',
    specPattern: './src/tests/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    viewportHeight: 1080,
    viewportWidth: 1920
  },
});
