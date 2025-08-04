import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "e8u1ju",

  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: false,
    screenshotOnRunFailure: true,
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
