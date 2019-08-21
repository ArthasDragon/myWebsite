import * as React from 'react';
import { RouteWithSubRoutes } from '@util/index';
import { Input, Button, Layout } from 'antd';

const { Header, Footer, Content } = Layout;

interface Props {
  routes: object[];
}

class Home extends React.Component<Props> {
  constructor(props) {
    super(props);
  }
  public render() {
    const { routes } = this.props;
    return (
      <Layout>
        <Header>
          <div style={{ color: 'white' }}>获取opt信息</div>
        </Header>
        <Content>
          <Input size="small" placeholder="手机号" />

          <Button type="primary">获取opt短信</Button>
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
        </Content>
        <Footer>1111</Footer>
      </Layout>
    );
  }
}

export default Home;
