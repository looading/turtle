import { RouteConfig } from 'react-router-config'
import { Layout } from './layout'
import { NotFound, SearchRepositoryPage } from './pages'
import { Home } from './pages/home'

export const routes: RouteConfig[] = [
  {
    component: Layout,
    type: 'layout',
    path: '',
    routes: [
      {
        path: '/',
        name: 'Home',
        type: 'page',
        exact: true,
        component: Home
      },
      {
        path: '/search-repository',
        name: 'SearchRepository',
        type: 'page',
        exact: true,
        component: SearchRepositoryPage
      },
      {
        path: '',
        name: '404',
        type: 'fallback',
        component: NotFound
      }
    ]
  }
]