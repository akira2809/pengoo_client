describe('Authentication Flows', () => {
  const testUser = {
    email: 'khadpkps39702@gmail.comcom',
    password: 'kha0946816478',
    name: 'Test User'
  };

  beforeEach(() => {
    // Clear cookies and local storage before each test
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/signin');
  });

  it('should display login form', () => {
    // Check if login form is visible
    cy.get('[data-cy="login-form"]').should('be.visible');
    cy.get('[data-cy="email-input"]').should('be.visible');
    cy.get('[data-cy="password-input"]').should('be.visible');
    cy.get('[data-cy="login-button"]').should('be.visible');
    
    // Check for signup link
    cy.get('[data-cy="signup-link"]')
      .should('be.visible')
      .and('have.attr', 'href', '/signup');
  });

  it('should show validation errors for empty fields', () => {
    cy.get('[data-cy="login-button"]').click();
    
    // Check for validation messages
    cy.get('[data-cy="email-error"]').should('be.visible');
    cy.get('[data-cy="password-error"]').should('be.visible');
  });

  it('should navigate to signup page', () => {
    cy.get('[data-cy="signup-link"]').click();
    cy.url().should('include', '/signup');
    cy.get('[data-cy="signup-form"]').should('be.visible');
  });

  it('should allow user to sign up', () => {
    // Mock successful registration
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 200,
      body: { success: true }
    });

    // Navigate to signup
    cy.visit('/signup');
    
    // Fill out the signup form
    cy.get('[data-cy="name-input"]').type(testUser.name);
    cy.get('[data-cy="email-input"]').type(testUser.email);
    cy.get('[data-cy="password-input"]').type(testUser.password);
    cy.get('[data-cy="confirm-password-input"]').type(testUser.password);
    
    // Submit the form
    cy.get('[data-cy="signup-button"]').click();
    
    // Check for success message or redirect
    cy.get('[data-cy="success-message"]').should('be.visible');
  });

  it('should allow user to log in', () => {
    // Mock successful login
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 'test-token', user: { email: testUser.email } }
    });

    // Fill out the login form
    cy.get('[data-cy="email-input"]').type(testUser.email);
    cy.get('[data-cy="password-input"]').type(testUser.password);
    
    // Submit the form
    cy.get('[data-cy="login-button"]').click();
    
    // Check for successful login (e.g., redirect to home page)
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should show error for invalid credentials', () => {
    // Mock failed login
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { error: 'Invalid credentials' }
    });

    // Fill out the login form with invalid credentials
    cy.get('[data-cy="email-input"]').type('wrong@example.com');
    cy.get('[data-cy="password-input"]').type('wrongpassword');
    
    // Submit the form
    cy.get('[data-cy="login-button"]').click();
    
    // Check for error message
    cy.get('[data-cy="auth-error"]')
      .should('be.visible')
      .and('contain', 'Invalid credentials');
  });
});
