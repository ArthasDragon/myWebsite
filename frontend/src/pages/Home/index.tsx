import * as React from 'react';
import { RouteWithSubRoutes } from '@util/index';
import { message, Menu } from 'antd';
import './home.less';
import { getOtp } from '@api/home';

interface Props {
  routes: object[];
}

interface State {
  telPhone: string;
}

class Home extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      telPhone: '',
    };
  }
  public getOpt = async () => {
    const { telPhone } = this.state;
    if (!telPhone) {
      return message.warn('手机号不能为空');
    }
    const { status } = await getOtp({ telPhone });
    if (status === 'success') {
      message.success('opt短信已经发送到你的手机上，请注意查收');
    }
  };
  public changeTelPhone = e => {
    this.setState({
      telPhone: e.target.value,
    });
  };
  public render() {
    const { routes } = this.props;
    return (
      // 首页
      <div className="home_wrapper">
        <div className="menu_wrapper">
          {/* 导航 */}
          <Menu mode="horizontal">
            <Menu.Item>菜单项</Menu.Item>
            <Menu.Item>菜单项</Menu.Item>
          </Menu>
        </div>
        <div>
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
        </div>
      </div>
    );
  }
}

export default Home;
