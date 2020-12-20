import { useUserInfo } from '@/store/userInfo'
import { clearDataCache } from '@/utils/cache'
import { Dropdown, Menu, Modal, Form, Input, notification, message } from 'antd'
import React, { FC, useMemo } from 'react'
import NotLoginImg from '../../assets/images/turtle_2.png'
import { StyledUserInfo } from './styleds'

const handleClearData = async () => {
  try {
    await clearDataCache()
    message.success('Clear Data Success!')
  } catch (err) {
    message.error('Clear Data Failed!')
  }
}

export const UserInfo: FC = props => {
  const {
    userInfo,
    login,
    logout,
    isLogin
  } = useUserInfo()

  const [modal, contextHolder] = Modal.useModal()

  const [form] = Form.useForm()

  const handleLogin = () => {

    const instance = modal.confirm({
      title: 'Login',
      icon: '',
      width: 380,
      content: (
        <Form form={form}>
          <Form.Item
            name='token'
            label='Token'
            rules={[
              {
                required: true,
                message: 'Please input github oauth Token'
              }
            ]}
            extra={(
              <>
                How to get Access Token ?
                <a href="https://docs.github.com/en/free-pro-team@latest/rest/overview/other-authentication-methods#basic-authentication">
                  Help
                </a>
                -
                <a href="https://github.com/settings/tokens">Entry</a>
              </>
            )}
          >
            <Input placeholder='Please input github oauth Token' />
          </Form.Item>
        </Form>
      ),
      onOk: async (close) => {
        const res = await form.validateFields()
        await login(res.token)
      }
    })
  }

  const overlay = useMemo(() => {
    if (!userInfo && !isLogin) {
      return (
        <Menu>
          <Menu.Item onClick={() => handleLogin()}>
            Login
          </Menu.Item>
        </Menu>
      )
    }
    return (
      <Menu>
        <Menu.Item>
          api_cost: {userInfo?.rateLimit.cost}
        </Menu.Item>
        <Menu.Item>
          api_limit: {userInfo?.rateLimit.limit}
        </Menu.Item>
        <Menu.Item>
          api_remaining: {userInfo?.rateLimit.remaining}
        </Menu.Item>
        <Menu.Item onClick={() => handleClearData()}>
          Clear Cache
        </Menu.Item>
        <Menu.Item onClick={() => logout()}>
          Logout
        </Menu.Item>
      </Menu>
    )
  }, [userInfo, isLogin])

  const show = isLogin && !!userInfo?.viewer?.avatarUrl

  return (
    <>
      <Dropdown overlay={overlay}>
        <StyledUserInfo>
          <img src={show ? userInfo?.viewer?.avatarUrl : NotLoginImg} />
          <span>
            {
              show
                ? userInfo?.viewer?.login
                : 'Login'
            }
          </span>
        </StyledUserInfo>
      </Dropdown>
      {contextHolder}
    </>
  )
}