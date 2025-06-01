import {
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

import ingredientsReducer from '../services/slices/ingredients';
import feedReducer from '../services/slices/feed';
import userReducer from '../services/slices/user';
import burgerConstructorReducer from '../services/slices/burgerConstructor';
import ordersReducer from '../services/slices/orders';

import ordersMiddleware from '../services/slices/middleware';

export const rootReducer = combineReducers({
  user: userReducer,
  burgerConstructor: burgerConstructorReducer,
  ingredients: ingredientsReducer,
  feed: feedReducer,
  orders: ordersReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ordersMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();
