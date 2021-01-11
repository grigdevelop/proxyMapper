import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Counter from './features/counter/Counter';
import FetchData from './features/WeatherForecast/FetchData';

import { ProxySocketConnectionProvider } from './features/proxyServer/proxySocketConnectionProvider';

import './custom.css'

export default () => (
    <Layout>
        <Route exact path='/' >
            <ProxySocketConnectionProvider>
                <Home />
            </ProxySocketConnectionProvider>
        </Route>
        <Route path='/counter' component={Counter} />
        <Route path='/fetch-data/:startDateIndex?' component={FetchData} />
    </Layout>
);
