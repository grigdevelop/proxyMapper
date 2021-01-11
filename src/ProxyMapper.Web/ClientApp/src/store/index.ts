import { WeatherForecastsState, weatherForecastsSlice } from '../features/WeatherForecast/weatherForecastsSlice';
import { counterSlice, CounterState } from './../features/counter/counterSlice';
import { proxyServerSlice, ProxyServerState } from './../features/proxyServer/proxyServerSlice';
import { Action, ThunkAction } from '@reduxjs/toolkit';

// The top-level state object
export interface ApplicationState {
    counter: CounterState;
    weatherForecasts: WeatherForecastsState;
    proxyServer: ProxyServerState;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    counter: counterSlice.reducer,
    weatherForecasts: weatherForecastsSlice.reducer,
    proxyServer: proxyServerSlice.reducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}

export type AppThunk = ThunkAction<void, ApplicationState, unknown, Action<string>>;
