import { TIngredient } from '@utils-types';
import {
  SerializedError,
  createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';

import { getIngredientsApi } from '../../utils/burger-api';

type TIngredientsState = {
  isLoading: boolean;
  error: null | SerializedError;
  data: TIngredient[];
};

export const initialState: TIngredientsState = {
  isLoading: true,
  error: null,
  data: []
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetch',
  async () => await getIngredientsApi()
);

const slice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  }
});

export default slice.reducer;
