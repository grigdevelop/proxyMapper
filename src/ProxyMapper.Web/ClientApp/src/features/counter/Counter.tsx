import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../../store';
import { increment, CounterState } from './counterSlice';

export default () => {
    const { count } = useSelector<ApplicationState, CounterState>(state => state.counter);
    const dispatch = useDispatch();
    return (
        <>
            <h1>Counter</h1>

            <p>This is a simple example of a React component.</p>

            <p aria-live="polite">Current count: <strong>{count}</strong></p>

            <button type="button"
                className="btn btn-primary btn-lg"
                onClick={() => { dispatch((increment as any)()) }}>
                Increment
            </button>
        </>
    )
}