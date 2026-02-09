describe('Register spec', () => {
  it('Register successfull', () => {
    cy.visit('/register')

    cy.intercept('POST', '/api/auth/register', {
      body: {
        lastName: "toto",
        firstName: "toto",
        email: "toto3@toto.com",
        password: "test!1234"
      },
    })

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 2,
        username: 'toto',
        firstName: 'toto',
        lastName: 'toto3@toto.com',
        admin: false
      },
    })

    cy.get('input[formControlName=firstName]').type("toto")
    cy.get('input[formControlName=lastName]').type("toto")
    cy.get('input[formControlName=email]').type("toto3@toto.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('include', '/login')

    cy.get('input[formControlName=email]').type("toto3@toto.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('include', '/sessions')
  })
});
