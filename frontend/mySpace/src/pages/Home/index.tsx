import * as React from 'react';
import { RouteWithSubRoutes } from '@util/index';

interface DefaultProps {
  routes: any;
}

class Home extends React.Component {
  private props: DefaultProps;
  public render() {
    const { routes } = this.props;
    return (
      <div className="App">
        <header>45dfddfdf2222d45</header>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </div>
    );
  }
}

export default Home;
