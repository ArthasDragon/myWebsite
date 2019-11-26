import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import Home from '../pages/Home';
import Gallery from '../pages/Gallery';
import Games from '../pages/Games';

const { ConnectedRouter } = routerRedux;

function RouterConfig({ history, app }) {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/home" component={Home} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/games" component={Games} />
      </Switch>
    </ConnectedRouter>
  );
}

export default RouterConfig;
