import * as React from 'react'
import { RouteWithSubRoutes } from '@util/index'
import { Input, Button, Layout, message } from 'antd'
import './home.less'
import { getOtp } from '@api/home'

const { Header, Footer, Content } = Layout

interface Props {
  routes: object[]
}

interface State {
  telPhone: string
}

class Home extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      telPhone: '',
    }
  }
  public getOpt = async () => {
    const { telPhone } = this.state
    if (!telPhone) {
      return message.warn('手机号不能为空')
    }
    const { status } = await getOtp({ telPhone })
    if (status === 'success') {
      message.success('opt短信已经发送到你的手机上，请注意查收')
    }
  }
  public changeTelPhone = e => {
    this.setState({
      telPhone: e.target.value,
    })
  }
  public render() {
    const { routes } = this.props
    const { telPhone } = this.state
    return (
      <Layout>
        <Header>
          <div style={{ color: 'white' }}>获取opt信息</div>
        </Header>
        <Content className={`opt_content`}>
          <Input onInput={this.changeTelPhone} value={telPhone} size="small" placeholder="手机号" />

          <Button onClick={this.getOpt} type="primary">
            获取opt短信
          </Button>
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
        </Content>
        <Footer>1111</Footer>
      </Layout>
    )
  }
}

export default Home
