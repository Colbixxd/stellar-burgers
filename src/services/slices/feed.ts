import {
  SerializedError,
  createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';
import { getFeedsApi } from '../../utils/burger-api';

type TFeedsState = {
  isLoading: boolean;
  error: null | SerializedError;
  data: TOrdersData;
};

export const initialState: TFeedsState = {
  isLoading: true,
  error: null,
  data: {
    orders: [],
    total: 0,
    totalToday: 0
  }
};

export const fetchFeed = createAsyncThunk<TOrdersData>(
  'feeds/fetch',
  async () => await getFeedsApi()
);

const slice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  }
});

export default slice.reducer;
