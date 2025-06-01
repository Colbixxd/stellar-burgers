import * as orderFixture from '../fixtures/order.json';
import * as ingredientsFixture from '../fixtures/ingredients.json';

const BUN_SELECTOR = '[data-ingredient="bun"]';
const MAIN_SELECTOR = '[data-ingredient="main"]';
const ORDER_BUTTON_SELECTOR = '[data-order-button]';
const MODAL_SELECTOR = '#modals';

describe('тест конструктора бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });
    cy.visit('/');
  });

  it('Список ингредиентов доступен для выбора', () => {
    cy.get(BUN_SELECTOR).should('have.length.at.least', 1);
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
      cy.get(ORDER_BUTTON_SELECTOR).should('be.disabled');
      
      // Добавляем булку и проверяем что она появилась в конструкторе
      const bunName = ingredientsFixture.data.find(ing => ing.type === 'bun')?.name;
      cy.get(`${BUN_SELECTOR}:first-of-type button`).click();
      cy.get('[data-constructor="bun-top"]').should('contain', bunName);
      cy.get(ORDER_BUTTON_SELECTOR).should('be.disabled');
      
      // Добавляем основной ингредиент и проверяем что он появился в конструкторе
      const mainName = ingredientsFixture.data.find(ing => ing.type === 'main')?.name;
      cy.get(`${MAIN_SELECTOR}:first-of-type button`).click();
      cy.get('[data-constructor="ingredients"]').should('contain', mainName);
      cy.get(ORDER_BUTTON_SELECTOR).should('be.enabled');
      
      cy.get(ORDER_BUTTON_SELECTOR).click();
      cy.get(MODAL_SELECTOR).children().should('have.length', 2);
      cy.get(`${MODAL_SELECTOR} h2:first-of-type`).should(
        'have.text',
        orderFixture.order.number.toString()
      );
      cy.get(ORDER_BUTTON_SELECTOR).should('be.disabled');
    });

    describe('Проверка модальных окон описания ингредиентов', () => {
      describe('Проверка открытия модальных окон', () => {
        it('Базовое открытие по карточке ингредиента с проверкой содержимого', () => {
          const bunName = ingredientsFixture.data.find(ing => ing.type === 'bun')?.name;
          cy.get(`${BUN_SELECTOR}:first-of-type`).click();
          cy.get(MODAL_SELECTOR).children().should('have.length', 2);
          cy.get(`${MODAL_SELECTOR} [data-ingredient-details="name"]`).should('have.text', bunName);
        });

        it('Модальное окно с ингредиентом будет открыто после перезагрузки страницы', () => {
          const bunName = ingredientsFixture.data.find(ing => ing.type === 'bun')?.name;
          cy.get(`${BUN_SELECTOR}:first-of-type`).click();
          cy.reload(true);
          cy.get(MODAL_SELECTOR).children().should('have.length', 2);
          cy.get(`${MODAL_SELECTOR} [data-ingredient-details="name"]`).should('have.text', bunName);
        });
      });

      describe('Проверка закрытия модальных окон', () => {
        beforeEach(() => {
          cy.get(`${BUN_SELECTOR}:first-of-type`).click();
        });

        it('С помощью нажатия на крест', () => {
          cy.get(`${MODAL_SELECTOR} button:first-of-type`).click();
          cy.wait(500);
          cy.get(MODAL_SELECTOR).children().should('have.length', 0);
        });

        it('Через нажатие на оверлей', () => {
          cy.get(`${MODAL_SELECTOR}>div:nth-of-type(2)`).click({ force: true });
          cy.wait(500);
          cy.get(MODAL_SELECTOR).children().should('have.length', 0);
        });

        it('Через нажатие на Esc', () => {
          cy.get('body').type('{esc}');
          cy.wait(500);
          cy.get(MODAL_SELECTOR).children().should('have.length', 0);
        });
      });
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  });
});