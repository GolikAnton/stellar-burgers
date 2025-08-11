// cypress.config.js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4000', // Добавьте эту строку
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  }
})