import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
  goals: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Create new goals
export const createGoals = createAsyncThunk('goals/create', async (goalData, thunkAPI) => {
  try {
    const response = await api.post('/goals', { 
      goals: goalData,
      quarter: 'Q2-2024',
      year: 2024
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get user goals
export const getGoals = createAsyncThunk('goals/getAll', async (_, thunkAPI) => {
  try {
    const response = await api.get('/goals');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGoals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createGoals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.goals = action.payload;
      })
      .addCase(createGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getGoals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGoals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.goals = action.payload;
      })
      .addCase(getGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = goalSlice.actions;
export default goalSlice.reducer;
