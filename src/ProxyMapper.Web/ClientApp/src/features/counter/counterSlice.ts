import { createSlice } from '@reduxjs/toolkit';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface CounterState {
    count: number;
}

const initialState: CounterState = {
    count: 0
};

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment(state: CounterState) {
            state.count++;
        },
        decrement(state: CounterState) {
            state.count--;
        }
    }
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;