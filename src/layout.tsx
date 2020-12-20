import React, { FC } from 'react'
import { matchRoutes, renderRoutes, RouteConfig } from 'react-router-config'
import { routes } from './routes.config'
import { useLocation } from 'react-router-dom'
import classnames from 'classnames'
import logo from './assets/images/logo.png'
import { Advertising } from './components/advertising'
import { UserInfo } from './components/userInfo'
import { useAds } from './utils/getAdsData'
import {
  StyledContent,
  StyledFooter,
  StyledHeader,
  StyledHeaderContent,
  StyledHeaderContentLeft,
  StyledHeaderItem,
  StyledLeftSide,
  StyledLogo,
  StyledMain,
  Wrapper
} from './layout.styleds'

interface LayoutProps {
  className?: string
  route: RouteConfig
}

const useNavigators = () => {
  const pages = routes[0].routes
  const location = useLocation()
  const matched = matchRoutes(routes, location.pathname)
    .filter(
      m => m.route['type'] !== 'layout'
    )
  return {
    pages: pages.filter(p => p['type'] === 'page'),
    matched: matched ? matched[0] : null
  }
}

export const Layout: FC<LayoutProps> = props => {
  const {
    route,
    className
  } = props

  const { pages, matched } = useNavigators()
  const ads = useAds()
  return (
    <Wrapper className={className}>
      <StyledHeader>
        <StyledHeaderContent>
          <StyledHeaderContentLeft>
            <StyledLogo src={logo} />
            {
              pages.map(
                page => (
                  <StyledHeaderItem
                    to={page.path as string}
                    key={page.path as string}
                    className={
                      classnames({
                        'active': page.component === matched?.route.component
                      })
                    }
                  >
                    {page.name}
                  </StyledHeaderItem>
                )
              )
            }
          </StyledHeaderContentLeft>
          <UserInfo />
        </StyledHeaderContent>
      </StyledHeader>
      <StyledMain>
        <StyledLeftSide>
          {
            ads.map((ad, index) => {
              return (
                <Advertising
                  key={index}
                  title={ad.title}
                  content={ad.content}
                />
              )
            })
          }
        </StyledLeftSide>
        <StyledContent>
          {renderRoutes(route.routes)}
        </StyledContent>
      </StyledMain>
      <StyledFooter>
        <span>© 2020</span>
        <a href="https://github.com/looading">looading</a>
        <a href="https://github.com/looading/turtle">github-turtle</a>
      </StyledFooter>
    </Wrapper>
  )
}