import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { History } from 'history';
import { ApplicationState, reducers } from './';



export default function configureMyStore(history: History, initialState?: ApplicationState) {


    const rootReducer = combineReducers({
        ...reducers,
        router: connectRouter(history)
    });

    const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(routerMiddleware(history)),
        preloadedState: initialState
    });

    return store;
    // return createStore(
    //     rootReducer,
    //     initialState,
    //     compose(applyMiddleware(...middleware), ...enhancers)
    // );
}
