describe('React Application Tests', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000/'); // Adjust this if your URL is different
  });

  describe('Data Table Loading and Display', () => {
    

    it('Should load initial data in the table', () => {
      cy.get('table').should('exist');
      cy.get('table tbody tr').should('have.length', 10); // Ensure at least one row is loaded
    });
  });

  describe('Pagination Functionality', () => {

    it('Should have pagination controls visible', () => {
      cy.contains('button', 'Previous').should('be.visible');
      cy.contains('button', 'Next').should('be.visible');
    });

    it('Should navigate to the next page', () => {
      cy.contains('button', 'Next').click();
      cy.contains('span,div,h1,h2,h3,h4,h5,h6,p',2).should('be.visible');
    });

    it('Should navigate to the previous page after moving to the next page', () => {
      cy.contains('button', 'Next').click();
      cy.contains('button', 'Previous').click();
      cy.contains('span,div,h1,h2,h3,h4,h5,h6,p',1).should('be.visible');
    });
  });

  describe('API Data Fetching and Error Handling', () => {

    it('Should handle successful data fetch from the API', () => {
      cy.intercept('GET', 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json', { fixture: 'example.json' }).as('fetchData');
      cy.wait('@fetchData').its('response.statusCode').should('eq', 200);
      cy.get('table tbody tr').should('have.length.at.least', 10); // assuming your fixture has at least 10 items
    });

    it('Should display an alert message on failed data fetch', () => {
      // Intercept the API request and simulate a failure
      cy.intercept('GET', 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json', {
        statusCode: 500,
        body: 'Error'
      }).as('fetchDataFailed');
  
      // Stub the window.alert to verify it gets called with the correct message
      const stub = cy.stub();
      cy.on('window:alert', stub);
  
      // Visit the page that triggers the API request
      cy.visit('http://localhost:3000/')
        .wait('@fetchDataFailed')
        .then(() => {
          // Check if the alert was called with the correct message, ignoring case
          expect(stub.getCall(0)).to.be.calledWithMatch(/failed to fetch data/i);
        });
    });
  });

});
