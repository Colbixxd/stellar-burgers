
const SELECTORS = {
    ORDER_BUTTON: '[data-order-button]',
    INGREDIENT_BUN: '[data-ingredient="bun"]',
    CONSTRUCTOR: '[data-constructor]',
    MODAL_DESCRIPTION: '[data-modal-description]',
    CLOSE_MODAL: '[data-close-modal]',
    MODAL: '[data-modal]',
};

import * as orderFixture from '../fixtures/order.json';

describe('тест конструктора бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });
    cy.visit('/');
  });

  it('Список ингредиентов доступен для выбора', () => {
    cy.get('SELECTORS.INGREDIENT_BUN').should('have.length.at.least', 1);
    cy.get('[data-ingredient="main"],[data-ingredient="sauce"]').should(
      'have.length.at.least',
      1
    );
  });

  describe('Процесс оформления заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
      localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');

      cy.intercept('GET', 'api/auth/user', { fixture: 'user' });
      cy.intercept('POST', 'api/orders', { fixture: 'order' });
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });

      cy.visit('/');
    });

    it('Оформление после авторизации', () => {
      cy.get('SELECTORS.ORDER_BUTTON').should('be.disabled');
      cy.get('SELECTORS.INGREDIENT_BUN:first-of-type button').click();
      cy.get('SELECTORS.ORDER_BUTTON').should('be.disabled');
      cy.get('[data-ingredient="main"]:first-of-type button').click();
      cy.get('SELECTORS.ORDER_BUTTON').should('be.enabled');
      cy.get('SELECTORS.ORDER_BUTTON').click();

      cy.get('#modals').children().should('have.length', 2);

      cy.get('#modals h2:first-of-type').should(
        'have.text',
        orderFixture.order.number
      );

      cy.get('SELECTORS.ORDER_BUTTON').should('be.disabled');
    });

    describe('Проверка модальных окон описания ингредиентов', () => {
      describe('Проверка открытия модальных окон', () => {
        it('Базовое открытие по карточке ингредиента', () => {
          cy.get('SELECTORS.INGREDIENT_BUN:first-of-type').click();
          cy.get('#modals').children().should('have.length', 2);
        });

        it('Модальное окно с ингредиентом будет открыто после перезагрузки страницы', () => {
          cy.get('SELECTORS.INGREDIENT_BUN:first-of-type').click();
          cy.reload(true);
          cy.get('#modals').children().should('have.length', 2);
        });
      });

      describe('Проверка закрытия модальных окон', () => {
        it('С помощью нажатия на крест', () => {
          cy.get('SELECTORS.INGREDIENT_BUN:first-of-type').click();
          cy.get('#modals button:first-of-type').click();
          cy.wait(500);
          cy.get('#modals').children().should('have.length', 0);
        });

        it('Через нажатие на оверлей', () => {
          cy.get('SELECTORS.INGREDIENT_BUN:first-of-type').click();
          cy.get('#modals>div:nth-of-type(2)').click({ force: true });
          cy.wait(500);
          cy.get('#modals').children().should('have.length', 0);
        });

        it('Через нажатие на Esc', () => {
          cy.get('SELECTORS.INGREDIENT_BUN:first-of-type').click();
          cy.get('body').type('{esc}');
          cy.wait(500);
          cy.get('#modals').children().should('have.length', 0);
        });
      });
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  });
});
