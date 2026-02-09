beforeEach(() => {
  cy.intercept('POST', '/api/auth/login', {
    body: {
      id: 1,
      username: 'userName',
      firstName: 'firstName',
      lastName: 'lastName',
      admin: true
    },
  });

  cy.intercept('GET', '/api/teacher', {
    fixture: 'teachers.json'
  }).as('getTeachers');

  cy.visit('/login');
  cy.get('input[formControlName=email]').type("yoga@studio.com");
  cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`);
});

describe('User detail spec', () => {
  it('should display all user information', () => {
    cy.intercept('GET', '/api/user/1', {
      body:{
        "id": 1,
        "email": "yoga@studio.com",
        "lastName": "Admin",
        "firstName": "Admin",
        "admin": true,
        "createdAt": "2026-01-12T11:34:02",
        "updatedAt": "2026-01-12T11:34:02"
      }
    });


    cy.get('span[routerLink="me"]').click();
    cy.url().should('include', '/me');
    cy.get('.my2').should('be.visible');

  })
});
