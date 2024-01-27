import { FC } from 'react'
import { Button, Layout } from 'antd'
import logo from '../../assets/images/tw-logo.png'
import { UserOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const { Header } = Layout

const HeaderComponent: FC = () => (
  <Header
    style={{
      background: '#595959',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 'auto',
      minHeight: 64,
      padding: '0 7vw'
    }}
  >
    <div>
      <img src={logo} alt="logo" height={40} style={{ marginRight: 30 }} />
      <Link to="/">
        <Button>Календарь и результаты</Button>
      </Link>
    </div>
    <Link to={'/login'}>
      <Button type="primary">
        <UserOutlined />
      </Button>
    </Link>
  </Header>
)

export default HeaderComponent
