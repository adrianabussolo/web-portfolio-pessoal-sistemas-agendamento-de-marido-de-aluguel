const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    video: true,
    baseUrl: 'http://localhost:4000',
    reporter: 'cypress-mochawesome-reporter',
    setupNodeEvents(on, config) {
      // implement node event listeners here if needed
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'


  },


});


