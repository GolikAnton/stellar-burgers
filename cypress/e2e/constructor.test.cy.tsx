// cypress/e2e/constructor.test.cy.ts

beforeEach(() => {
  // Перехваты API
  cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
  cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
  cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder');

  // Авторизация
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
    // Проверяем пустой конструктор
    cy.get('[data-cy="burger-constructor"]')
    .should('not.contain', 'Булка')
    .and('not.contain', 'Начинка')
    .and('not.contain', 'Соус')
    .and('contain', 'Выберите булки') 
    .and('contain', 'Выберите начинку');

    // Добавляем булку (ing1)
    cy.get('[data-cy="ingredient-ing1"]').within(() => {
      cy.get('[data-cy="add-button"]').children('button').click();
    });

    // Добавляем начинку (ing2)
    cy.get('[data-cy="ingredient-ing2"]').within(() => {
      cy.get('[data-cy="add-button"]').children('button').click();
    });

    // Проверяем добавленные элементы
    cy.get('[data-cy="burger-constructor"]')
    .should('contain', 'Булка')
    .and('contain', 'Начинка');
  });
});

describe ('Модалки', () => {
  it('Работа модального окна ингредиента', () => {
    // Открытие модалки
    cy.get('[data-cy="modal"]').should('not.exist');
    cy.get('[data-cy="ingredient-ing3"]').click(); // Кликаем на соус
    cy.get('[data-cy="modal"]').should('be.visible').contains('Соус');

    // Закрытие через крестик
    cy.get('[data-cy="modal-close-button"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    // Закрытие через оверлей
    cy.get('[data-cy="ingredient-ing2"]').click();
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });
});  

describe ('Заказ', () => {
  it('Оформляет заказ', () => {
    //Собираем бургер
    cy.get('[data-cy="ingredient-ing1"]').within(() => {
      cy.get('[data-cy="add-button"]').children('button').click();
    });
  
    cy.get('[data-cy="ingredient-ing2"]').within(() => {
      cy.get('[data-cy="add-button"]').children('button').click();
    });

    cy.get('[data-cy="ingredient-ing3"]').within(() => {
      cy.get('[data-cy="add-button"]').children('button').click();
    });

    // Отправляем заказ
    cy.get('[data-cy="order-button"]').click();
    cy.wait('@createOrder', { timeout: 20000 });

    // Проверяем номер заказа
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="order-number"]').should('contain', '12345');
    
    // Закрываем и проверяем очистку
    cy.get('[data-cy="modal-close-button"]').click();
    cy.get('[data-cy="burger-constructor"]')
    .should('not.contain', 'Булка')
    .and('not.contain', 'Начинка')
    .and('not.contain', 'Соус')
    .and('contain', 'Выберите булки') 
    .and('contain', 'Выберите начинку');
  });
});