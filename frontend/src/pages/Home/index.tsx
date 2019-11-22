import * as React from 'react';
import { RouteWithSubRoutes } from '@util/index';
import { message, Breadcrumb } from 'antd';
import './home.less';
import { getOtp } from '@api/home';
import { Link } from 'react-router-dom';

const SIGN = require('@/assets/imgs/sign.png');

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
          {/* 我的大大大签名 */}
          <img src={SIGN} className="signature" alt="" />
          {/* <div className="signature">Arthas Dragon</div> */}
          {/* 导航 */}
          <div className="menu">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/gallery">gallery</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/gallery">news</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/gallery">games</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/gallery">cartoon</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
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
