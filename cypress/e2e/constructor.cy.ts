const SELECTORS = {
  ORDER_BUTTON: '[data-order-button]',
  INGREDIENT_BUN: '[data-ingredient="bun"]',
  INGREDIENT_MAIN: '[data-ingredient="main"]',
  INGREDIENT_SAUCE: '[data-ingredient="sauce"]',
  MODAL_ROOT: '#modals'
};

import ingredientsFixture from '../fixtures/ingredients.json';
import orderFixture from '../fixtures/order.json';

describe('Тест конструктора бургеров (финальная версия)', () => {
  // Получаем тестовые данные один раз и проверяем их наличие
  const bun = ingredientsFixture.data.find(item => item.type === 'bun');
  const main = ingredientsFixture.data.find(item => item.type === 'main');
  const sauce = ingredientsFixture.data.find(item => item.type === 'sauce');

  if (!bun || !main || !sauce) {
    throw new Error('Не найдены необходимые ингредиенты в фикстурах');
  }

  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });
    cy.visit('/');
  });

  it('Список ингредиентов доступен для выбора', () => {
    cy.get(SELECTORS.INGREDIENT_BUN).should('have.length.at.least', 1);
    cy.get(SELECTORS.INGREDIENT_MAIN).should('have.length.at.least', 1);
    cy.get(SELECTORS.INGREDIENT_SAUCE).should('have.length.at.least', 1);
  });

  describe('Процесс оформления заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
      localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');
      cy.intercept('GET', 'api/auth/user', { fixture: 'user' });
      cy.intercept('POST', 'api/orders', { fixture: 'order' });
    });

    it('Полный цикл заказа', () => {
      // 1. Проверяем начальное состояние
      cy.get(SELECTORS.ORDER_BUTTON).should('be.disabled');

      // 2. Добавляем ингредиенты
      cy.get(`${SELECTORS.INGREDIENT_BUN}:first`).click();
      cy.get(`${SELECTORS.INGREDIENT_MAIN}:first`).click();

      // 3. Проверяем, что кнопка стала активной
      cy.get(SELECTORS.ORDER_BUTTON).should('be.enabled');

      // 4. Оформляем заказ
      cy.get(SELECTORS.ORDER_BUTTON).click();

      // 5. Проверяем модальное окно заказа
      cy.get(SELECTORS.MODAL_ROOT)
        .should('contain', orderFixture.order.number)
        .and('contain', 'идентификатор заказа');

      // 6. Закрываем модальное окно
      cy.get('body').type('{esc}');

      // 7. Проверяем очистку конструктора
      cy.get(SELECTORS.ORDER_BUTTON).should('be.disabled');
    });

    describe('Работа с модальными окнами', () => {
      it('Просмотр и закрытие описания ингредиента', () => {
        // 1. Открываем модальное окно
        cy.get(`${SELECTORS.INGREDIENT_BUN}:first`).click();
        
        // 2. Проверяем содержимое
        cy.get(SELECTORS.MODAL_ROOT)
          .should('contain', bun.name)
          .and('contain', bun.calories);

        // 3. Закрываем тремя способами
        // Способ 1: Клик по крестику
        cy.get(`${SELECTORS.MODAL_ROOT} button`).first().click({ force: true });
        cy.get(SELECTORS.MODAL_ROOT).should('not.contain', bun.name);

        // Способ 2: Клик по оверлею
        cy.get(`${SELECTORS.INGREDIENT_BUN}:first`).click();
        cy.get(`${SELECTORS.MODAL_ROOT} > div`).first().click({ force: true });
        cy.get(SELECTORS.MODAL_ROOT).should('not.contain', bun.name);

        // Способ 3: Нажатие Esc
        cy.get(`${SELECTORS.INGREDIENT_BUN}:first`).click();
        cy.get('body').type('{esc}');
        cy.get(SELECTORS.MODAL_ROOT).should('not.contain', bun.name);
      });
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  });
});