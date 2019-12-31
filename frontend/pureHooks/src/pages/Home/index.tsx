import * as React from 'react';
import { Breadcrumb } from 'antd';
// import { RouteWithSubRoutes } from '@util/index';
import { Link } from 'react-router-dom';
import './home.less';

const SIGN = require('@/assets/imgs/sign.png');

interface Props {
  routes: object[];
}

class Home extends React.Component<Props> {
  constructor(props) {
    super(props);
  }
  public render() {
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
                <Link to="/gallery">gallery2</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/gallery">bodybuilding</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/games">games</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
