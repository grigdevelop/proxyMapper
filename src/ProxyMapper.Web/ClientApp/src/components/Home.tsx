import * as React from 'react';
import { connect } from 'react-redux';
import { ProxyServers } from './../features/proxyServer/ProxyServers';

const Home = () => (
  <>
    <ProxyServers />
  </>
);

export default connect()(Home);
