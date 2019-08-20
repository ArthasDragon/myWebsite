import * as React from 'react';
import { RouteWithSubRoutes } from '@util/index';

interface Props {
  routes: any;
}

class Home extends React.Component<Props> {
  constructor(props) {
    super(props);
  }
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
