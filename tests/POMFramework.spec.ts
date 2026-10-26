// Framework - It is a design principle. Set of guidelines.

// POM - Page Object Model

// Page Object Model is a design pattern used in software testing to represent a
// web page as an object. It is a way to organise and manage the interaction with a
// web page by creating the properties (variables) and methods (actions) of that
// particular page.

// This approach helps in reducing the code duplication, improve test
// maintainability and enhancing the readability by encapsulating the page-specific
// login within a dedicated class or modules.

// POM framework from scratch:

// There are different layers that we have to create:

// 1. PAGE LAYER - will create a package or folder (pages).
// Locators and methods related to specific page.
// LoginPage.ts, DashboardPage.ts, ...

// 2. TEST LAYER - will create a package or folder (tests).
// Pure test cases and the assertion. We will call the locators and methods
// inside the test layer from the page layer.
// LoginPageTest.spec.ts, DashboardPageTest.spec.ts, ... - Hooks

// 3. DATA LAYER - JSON/EXCEL/.env - Testdata.json, TestData.xlsx, testdata.env.qa, testdata.env.prod

// 4. CONFIGURATION LAYER - playwright.config.ts - Global configuration

// 5. UTILS LAYER - We will create a utils folder.
// Custom function, screenshot(), scrollDown() (Not required in PW),
// get the data from Excel, API methods - To get the token and bypass the login.

// 6. REPORT LAYER - HTML/Allure - We do not create it separately in Playwright.