import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import routerConfig from './routerConfig';
import { RouteWithSubRoutes } from '@util/index';
import './styles/App.less';

export default () => (
  <Router>
    {routerConfig.map((route, i) => (
      <RouteWithSubRoutes key={i} {...route} />
    ))}
  </Router>
);
