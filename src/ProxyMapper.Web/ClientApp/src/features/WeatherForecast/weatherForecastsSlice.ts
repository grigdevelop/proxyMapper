import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../store';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface WeatherForecastsState {
    isLoading: boolean;
    startDateIndex?: number;
    forecasts: WeatherForecast[];
}

export interface WeatherForecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}


interface RequestWeatherForecastsAction {
    startDateIndex: number;
}

interface ReceiveWeatherForecastsAction {
    startDateIndex: number;
    forecasts: WeatherForecast[];
}

const unloadedState: WeatherForecastsState = { forecasts: [], isLoading: false };

export const weatherForecastsSlice = createSlice({
    name: 'weatherForecasts',
    initialState: unloadedState,
    reducers: {
        requestWeatherForecasts(state: WeatherForecastsState, action: PayloadAction<RequestWeatherForecastsAction>) {
            state.startDateIndex = action.payload.startDateIndex;
            state.isLoading = true;
        },
        receiveWeatherForecasts(state: WeatherForecastsState, action: PayloadAction<ReceiveWeatherForecastsAction>) {
            if (action.payload.startDateIndex === state.startDateIndex) {
                state.forecasts = action.payload.forecasts;
                state.isLoading = false;
            }
        },
    }
});

export const { receiveWeatherForecasts, requestWeatherForecasts } = weatherForecastsSlice.actions;

export const fetchForecasts = (startDateIndex: number): AppThunk => async (dispatch, getState) => {
    const appState = getState();
    if (appState && appState.weatherForecasts && startDateIndex !== appState.weatherForecasts.startDateIndex) {
        fetch(`weatherforecast`)
            .then(response => response.json() as Promise<WeatherForecast[]>)
            .then(data => {
                dispatch(receiveWeatherForecasts({ forecasts: data, startDateIndex }));
            });
        dispatch(requestWeatherForecasts({ startDateIndex }));
    }
};
