import  { initialState, fetchFeed } from '../src/services/slices/feed';
import reducer from '../src/services/slices/feed';

const feedsMockData = {
    orders: [],
    total: 1,
    totalToday: 1
  };

describe('Тестирование feedReducer', () => {
    describe('Асинхронная функция для получения ленты заказов: fetchFeed', () => {
        test('Начало запроса: fetchFeed.pending', () => {
        const state = reducer(initialState, fetchFeed.pending('pending'));
        expect(state.isLoading).toBeTruthy();
        expect(state.error).toBeNull();
});

test('Результат запроса fetchFeed.fulfilled', () => {
const state = reducer(initialState, fetchFeed.fulfilled(feedsMockData, 'fulfilled'));

expect(state.isLoading).toBeFalsy();
expect(state.error).toBeNull();
expect(state.data).toEqual(feedsMockData);
});

test('Ошибка запроса: fetchFeeds.rejected', () => {
    const error = 'fetchFeeds.rejected';

    const state = reducer(
      initialState,
      fetchFeed.rejected(new Error(error), 'rejected')
    );

    expect(state.isLoading).toBeFalsy();
    expect(state.error?.message).toEqual(error);
  });
});
});
