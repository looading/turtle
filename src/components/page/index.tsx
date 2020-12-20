import styled from '@/styled'
import React, { FC } from 'react'
import logo from '../../assets/images/turtle_1.png'


const StyledLogo = styled.img`
  height:22px;
  transform: scale(2);
  margin-right: 16px;
`

const StyledPageTitleContent = styled.div`
  padding: 14px 8px 1px 9px;
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
`
const StyledPageTitle = styled.div`
  display: flex;
`

const StyledPage = styled.div`
  ${StyledPageTitle} {
    margin-bottom: 16px;
  }
`

const StyledPageContent = styled.div<PageProps>`
  background-color: ${({ transparent }) => transparent ? 'transparent' : '#fff'};
  padding: 16px 12px;
  border-radius: 4px;
  box-shadow: 2px 2px 5px #c7c5c5;
`

interface PageProps {
  className?: string
  title?: string
  transparent?: boolean
}

export const Page: FC<PageProps> = props => {
  const { className, title, children, transparent } = props

  return (
    <StyledPage className={className}>
      {
        title && (
          <StyledPageTitle>
            <StyledPageTitleContent>
              <StyledLogo src={logo} />
              {title}
            </StyledPageTitleContent>

          </StyledPageTitle>
        )
      }
      <StyledPageContent transparent={transparent}>
        {children}
      </StyledPageContent>
    </StyledPage>
  )

}