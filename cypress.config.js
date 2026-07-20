const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: 'https://front.serverest.dev/',
    expose: {
      apiUrl: 'https://serverest.dev',
    },
    specPattern: 'cypress/**/*.cy.{js,jsx,ts,tsx}',
    testIsolation: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
