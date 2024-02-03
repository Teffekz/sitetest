describe('Saucedemo Tests', () => {

  const validUsername = "standard_user";
  const validPassword = "secret_sauce";
  const invalidUsername = "invalid_user";
  const invalidPassword = "invalid_sauce";

  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/');
  });

  afterEach(() => {
    cy.logout();
  });

  it('Авторизация с правильными данными', () => {
    cy.login(validUsername, validPassword);
    cy.url().should('include', 'inventory.html');
  });

  it('Авторизация с ошибочными данными', () => {
    cy.login(invalidUsername, invalidPassword);
    cy.get('[data-test="error"]').should('be.visible');
  });

  it('Добавление и удаление товаров через карточки', () => {
    cy.login(validUsername, validPassword);
    cy.get('.inventory_item').each(($el, index) => {

      cy.get('.inventory_item').eq(index)
        .find('.btn_primary')
        .click();
  
      cy.get('.inventory_item').eq(index)
        .find('.btn_secondary')
        .should('exist');
  
      cy.get('.shopping_cart_badge').should('have.text', '1');
  
      cy.get('.inventory_item').eq(index)
        .find('.btn_secondary')
        .click();
  
      cy.get('.shopping_cart_badge').should('not.exist');
  
      cy.get('.inventory_item').eq(index)
        .find('.btn_primary')
        .should('exist');
    });
  });

  it('Добавление и удаление товара на странице товара', () => {
    cy.login(validUsername, validPassword);
    cy.get('.inventory_item').eq(0)
      .find('.inventory_item_name')
      .click();
    cy.get('.btn_primary').click();
    cy.get('.btn_secondary.btn_inventory').should('exist');
    cy.get('.shopping_cart_badge').should('have.text', '1');
    cy.get('.btn_secondary.btn_inventory').click();
    cy.get('.shopping_cart_badge').should('not.exist');
    cy.get('.btn_primary').should('exist');
  });

  it('Процесс покупки товара', () => {
    cy.login(validUsername, validPassword);
    cy.get('.inventory_item').eq(0)
      .find('.btn_primary')
      .click();
    cy.get('.shopping_cart_link').click();
    cy.get('.checkout_button').click();
    cy.get('#first-name').type('Михаил');
    cy.get('#last-name').type('Зубенко');
    cy.get('#postal-code').type('12345');
    cy.get('#continue').click();
    cy.get('.cart_button').click();
    cy.url().should('include', 'checkout-complete.html');
  });

  it('Сохранение товаров в корзине после логаута', () => {
    cy.login(validUsername, validPassword);
    cy.get('.inventory_item').each(($el, index) => {

      cy.get('.inventory_item').eq(index)
        .find('.btn_primary')
        .click();

    });
    cy.logout();
    cy.login(validUsername, validPassword);
    cy.get('.inventory_item').each(($el, index) => {

      cy.get('.inventory_item').eq(index)
        .find('.btn_secondary')
        .should('exist');

    });
  });
});

Cypress.Commands.add('login', (username, password) => {
  cy.get('#user-name').type(username);
  cy.get('#password').type(password);
  cy.get('#login-button').click();
});

Cypress.Commands.add('logout', () => {
  cy.get('#react-burger-menu-btn').click();
  cy.get('#logout_sidebar_link').click();
});