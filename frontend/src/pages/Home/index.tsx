import * as React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'dva/router';
import { connect } from 'dva';
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
    const { children } = this.props;
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
                <Link to="/gallery">bodybuilding</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/games">games</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        {children}
      </div>
    );
  }
}

export default connect(({ home }) => ({
  home,
}))(Home);
