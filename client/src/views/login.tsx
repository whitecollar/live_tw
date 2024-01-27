import { Form, Input, Button, message } from 'antd'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

export const PASSWORD = 'HsFt4fS8MZ'

export const checkIsAuth = (): boolean =>
  localStorage.getItem('auth') === PASSWORD

interface IFormValues {
  login: string
  password: string
}

const LoginPage: FC = () => {
  const navigate = useNavigate()

  const onFinish = (values: IFormValues) => {
    if (values.login === 'admin' && values.password === PASSWORD) {
      localStorage.setItem('auth', PASSWORD)
      message.info('Вы успешно вошли')
      navigate('/')
    } else {
      message.error('Введены неверные данные')
    }
  }

  const onFinishFailed = () => {
    message.error('Произошла ошибка при аутентификации')
  }

  return !checkIsAuth() ? (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 500,
      }}
    >
      <Form
        name="auth"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{ width: '600px', padding: '50px', background: '#fff' }}
      >
        <Form.Item
          label="Логин"
          name={'login'}
          rules={[{ required: true, message: 'Введите логин' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Пароль"
          name={'password'}
          rules={[{ required: true, message: 'Введите пароль' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Войти
          </Button>
        </Form.Item>
      </Form>
    </div>
  ) : (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 500,
      }}
    >
      <Button
        type="primary"
        onClick={() => {
          localStorage.removeItem('auth')
          message.info('Вы вышли из аккаунта администратора')
          navigate('/')
        }}
      >
        Выйти из аккаунта администратора
      </Button>
    </div>
  )
}

export default LoginPage
