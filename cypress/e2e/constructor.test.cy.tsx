// cypress/e2e/constructor.test.cy.ts

const SELECTORS = {
  BURGER_CONSTRUCTOR: '[data-cy="burger-constructor"]',
  INGREDIENT: (id: string) => `[data-cy="ingredient-${id}"]`,
  ADD_BUTTON: '[data-cy="add-button"] button',
  MODAL: '[data-cy="modal"]',
  MODAL_CLOSE_BUTTON: '[data-cy="modal-close-button"]',
  MODAL_OVERLAY: '[data-cy="modal-overlay"]',
  ORDER_BUTTON: '[data-cy="order-button"]',
  ORDER_NUMBER: '[data-cy="order-number"]'
};

beforeEach(() => {
  cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
  cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
  cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder');

  cy.window().then((win) => {
    win.localStorage.setItem('refreshToken', 'test-token');
  });
  cy.setCookie('accessToken', 'test-cookie');

  cy.visit('/');
  cy.wait('@getIngredients');
});

afterEach(() => {
  cy.window().then((win) => {
    win.localStorage.clear();
  });
  cy.clearCookies();
});

describe('Конструктор бургеров', () => {
  it('Добавляет ингредиенты в конструктор', () => {
    cy.get(SELECTORS.BURGER_CONSTRUCTOR)
      .should('not.contain', 'Булка')
      .and('not.contain', 'Начинка')
      .and('not.contain', 'Соус')
      .and('contain', 'Выберите булки') 
      .and('contain', 'Выберите начинку');

    cy.get(SELECTORS.INGREDIENT('ing1')).within(() => {
      cy.get(SELECTORS.ADD_BUTTON).click();
    });

    cy.get(SELECTORS.INGREDIENT('ing2')).within(() => {
      cy.get(SELECTORS.ADD_BUTTON).click();
    });

    cy.get(SELECTORS.BURGER_CONSTRUCTOR)
      .should('contain', 'Булка')
      .and('contain', 'Начинка');
  });
});

describe('Модалки', () => {
  it('Работа модального окна ингредиента', () => {
    cy.get(SELECTORS.MODAL).should('not.exist');
    cy.get(SELECTORS.INGREDIENT('ing3')).click();
    cy.get(SELECTORS.MODAL).should('be.visible').contains('Соус');

    cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
    cy.get(SELECTORS.MODAL).should('not.exist');

    cy.get(SELECTORS.INGREDIENT('ing2')).click();
    cy.get(SELECTORS.MODAL_OVERLAY).click({ force: true });
    cy.get(SELECTORS.MODAL).should('not.exist');
  });
});  

describe('Заказ', () => {
  it('Оформляет заказ', () => {
    cy.get(SELECTORS.INGREDIENT('ing1')).within(() => {
      cy.get(SELECTORS.ADD_BUTTON).click();
    });
  
    cy.get(SELECTORS.INGREDIENT('ing2')).within(() => {
      cy.get(SELECTORS.ADD_BUTTON).click();
    });

    cy.get(SELECTORS.INGREDIENT('ing3')).within(() => {
      cy.get(SELECTORS.ADD_BUTTON).click();
    });

    cy.get(SELECTORS.ORDER_BUTTON).click();
    cy.wait('@createOrder', { timeout: 20000 });

    cy.get(SELECTORS.MODAL).should('be.visible');
    cy.get(SELECTORS.ORDER_NUMBER).should('contain', '12345');
    
    cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
    cy.get(SELECTORS.BURGER_CONSTRUCTOR)
      .should('not.contain', 'Булка')
      .and('not.contain', 'Начинка')
      .and('not.contain', 'Соус')
      .and('contain', 'Выберите булки') 
      .and('contain', 'Выберите начинку');
  });
});