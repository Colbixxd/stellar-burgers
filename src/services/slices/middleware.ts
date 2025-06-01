import { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { resetConstructor } from './burgerConstructor';
import { createOrder } from './orders';
import { AppDispatch, RootState } from '../store';

const middleware: Middleware =
  (store: MiddlewareAPI<AppDispatch, RootState>) => (next) => (action) => {
    if (createOrder.fulfilled.match(action)) {
      store.dispatch(resetConstructor());
    }

    next(action);
  };

export default middleware;
