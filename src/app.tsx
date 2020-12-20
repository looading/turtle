import { ConfigProvider, message, notification } from 'antd'
import React, { FC } from 'react'
import { renderRoutes } from 'react-router-config'
import { HashRouter } from 'react-router-dom'
import { routes } from './routes.config'

import "antd/dist/antd.css";

import { ThemeProvider, createGlobalStyle, keyframes } from '@/styled'
import { theme } from './theme'
import { initGql } from './utils/gql'
import { initCache } from './utils/cache'
import { initUser } from './store/userInfo'
import { notice$ } from './utils/subjects'
import { initOpenRestApi } from './utils/openRestApi/config'
import { getRepoContributes } from './utils/openRestApi/getRepoContributes'


initCache()
initGql()
initOpenRestApi()
initUser()


window['getReposContributes'] = getRepoContributes

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
  }
  body {
    margin: 0;
    /* background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%); */
    background-color:  #e6e9f0;
  }
`
notice$
  .subscribe(payload => {
    if(payload.method === 'notification') {
      if(payload.type === 'removeAll') {
        return notification.destroy()
      }
      notification[payload.type]({
        description:  payload.desc,
        message: payload.message,
        duration: payload.duration ?? 3
      })
    } else {
      if(payload.type === 'removeAll') {
        return message.destroy()
  
      }
      message[payload.type](payload.message, payload.duration ?? 3)
    }
  })

export const App: FC = props => {
  return (
    <ConfigProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <HashRouter>
          {
            renderRoutes(routes)
          }
        </HashRouter>
      </ThemeProvider>
    </ConfigProvider>
  )
}