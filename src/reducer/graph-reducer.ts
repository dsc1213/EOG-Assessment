import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Graph = {
  getMultipleMeasurements: object;
};

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  data: {},
};


const slice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    graphDataRecevied: (state, action: PayloadAction<Graph>) => {
      const { getMultipleMeasurements: data } = action.payload;
      state.data = data;
    },
    graphApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
