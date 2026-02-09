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

});

describe('Session spec', () => {



  it('create session successfull', () => {

    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`);
    cy.url().should('include', '/sessions')

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      [{
        name: 'Yoga Matinal',
        date: '2024-12-25T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'Session de yoga',
        users: [
          1
        ]
      }]).as('session');

    cy.url().should('include', '/sessions');
    cy.get('.ml1').should("be.visible");
    cy.contains('button', 'Create').click();

    cy.wait('@getTeachers');

    cy.get('input[formControlName="name"]').type('Yoga Matinal');
    cy.get('input[formControlName="date"]').type('2024-12-25');
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').contains('Margot DELAHAYE').click();
    cy.get('textarea[formControlName="description"]').type('Description de la session');

    cy.intercept('POST', '**/api/session', {
      statusCode: 200,
      body: [{
        id: 1,
        name: 'Yoga Matinal',
        date: '2024-12-25T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'Session de yoga',
        users: [1],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]
    }).as('createSession');

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      [{
        id: 1,
        name: 'Yoga Matinal',
        date: '2024-12-25T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'Session de yoga',
        users: [
          1
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]).as('newSessions');


    cy.get('button[type="submit"]').click();

    cy.wait('@createSession').then((interception) => {
      // Vérifier le status code
      expect(interception.response.statusCode).to.eq(200);

      // Vérifier le body de la requête envoyée
      expect(interception.request.body).to.have.property('name', 'Yoga Matinal');
    });

    cy.get('.item').should('have.length', 1);
    cy.get('.item mat-card-title').should('contain', 'Yoga Matinal');
    cy.get('.item button').contains('Edit').should('be.visible');
    cy.get('.item button').contains('Detail').should('be.visible');
  });

  it('should display all information on Details button', () => {

    cy.intercept('GET', '/api/session', [{
      id: 1,
      name: 'Yoga Matinal',
      date: '2024-12-25T00:00:00.000+00:00',
      teacher_id: 1,
      description: 'Session de yoga',
      users: [1],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-15T00:00:00.000Z'
    }]).as('getSessions');


    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`);

    // Mock GET session detail (pour l'id 1)
    cy.intercept('GET', '/api/session/1', {
      id: 1,
      name: 'Yoga Matinal',
      date: '2024-12-25T00:00:00.000+00:00',
      teacher_id: 1,
      description: 'Session de yoga',
      users: [1],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-15T00:00:00.000Z'
    }).as('getSessionDetail');

    // Mock GET teacher (pour afficher le nom du professeur)
    cy.intercept('GET', '/api/teacher/1', {
      id: 1,
      firstName: 'Margot',
      lastName: 'DELAHAYE'
    }).as('getTeacher');


    cy.wait('@getSessions');

    // Vérifier qu'une session est présente
    cy.get('.item').should('have.length', 1);

    // Cliquer sur le bouton Detail
    cy.get('.item button').contains('Detail').click();

    // Attendre le chargement des détails
    cy.wait('@getSessionDetail');
    cy.wait('@getTeacher');

    // Vérifier l'URL
    cy.url().should('include', '/sessions/detail/1');

    // ✅ VÉRIFICATIONS DE LA PAGE DÉTAIL

    // 1. Vérifier le titre (avec titlecase pipe)
    cy.get('mat-card-title h1')
      .should('be.visible')
      .and('contain', 'Yoga Matinal');

    // 2. Vérifier le bouton retour
    cy.get('button mat-icon')
      .contains('arrow_back')
      .should('be.visible');

    // 3. Vérifier le bouton Delete (visible seulement pour admin)
    cy.get('button[color="warn"]')
      .contains('Delete')
      .should('be.visible');

    // 4. Vérifier les informations du professeur
    cy.get('mat-card-subtitle')
      .should('contain', 'Margot')
      .and('contain', 'DELAHAYE');

    cy.get('mat-card-subtitle mat-icon')
      .contains('people')
      .should('be.visible');

    // 5. Vérifier l'image
    cy.get('img.picture')
      .should('be.visible')
      .and('have.attr', 'src', 'assets/sessions.png')
      .and('have.attr', 'alt', 'Yoga session');

    // 6. Vérifier le nombre de participants
    cy.get('mat-card-content')
      .should('contain', '1 attendees');

    cy.get('mat-icon').contains('group').should('be.visible');

    // 7. Vérifier la date de la session (formatée en longDate)
    cy.get('mat-card-content')
      .should('contain', 'December 25, 2024');

    cy.get('mat-icon').contains('calendar_month').should('be.visible');

    // 8. Vérifier la description
    cy.get('.description')
      .should('contain', 'Description:')
      .and('contain', 'Session de yoga');

    // 9. Vérifier la date de création
    cy.get('.created')
      .should('contain', 'Create at:')
      .and('contain', 'January 1, 2024');

    // 10. Vérifier la date de dernière mise à jour
    cy.get('.updated')
      .should('contain', 'Last update:')
      .and('contain', 'January 15, 2024');

    // 11. Vérifier que les boutons "Participate" ne sont PAS visibles (car admin)
    cy.contains('button', 'Participate').should('not.exist');
    cy.contains('button', 'Do not participate').should('not.exist');
  });
});
