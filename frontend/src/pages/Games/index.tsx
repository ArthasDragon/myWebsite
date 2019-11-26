import * as React from 'react';

interface Props {
  routes: object[];
}

class Home extends React.Component<Props> {
  public render() {
    return (
      <div className="App">
        <header>games</header>
      </div>
    );
  }
}

export default Home;
