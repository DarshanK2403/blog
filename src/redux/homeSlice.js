// src/redux/slices/homeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchHomeData = createAsyncThunk('home/fetchHomeData', async () => {
  const res = await fetch('/api/home');
  if (!res.ok) {
    throw new Error('Failed to fetch home data');
  }
  const data = await res.json();
  return data.data;
});

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    latestJobs: [],
    latestResults: [],
    jobUpdates: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.loading = false;
        state.latestJobs = action.payload.latestJobs;
        state.latestResults = action.payload.latestResults;
        state.jobUpdates = action.payload.jobUpdates;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default homeSlice.reducer;
