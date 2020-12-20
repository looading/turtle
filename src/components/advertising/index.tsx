import styled from '@/styled'
import React, { FC } from 'react'
import img from '../../assets/images/turtle_3.png'

import Markdown from 'react-markdown'


const StyledAdTitle = styled.div`
  background-image: url(${img});
  border-bottom: 1px #eee solid;
  padding: 8px 8px 8px 35px;
  background-repeat: no-repeat;
  background-size: 30px 30px;
  margin-bottom: 10px;
`

const StyledAdBody = styled.div`
  font-size: 8px;
  ul {
    padding-inline-start: 20px;
  }
`

const StyledAd = styled.div`
  background-color: #fff;
  margin: 0 16px 16px;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 2px 2px 5px #c7c5c5;
`

interface AdvertisingProps {
  title?: string
  content?: string
}

export const Advertising: FC<AdvertisingProps> = props => {
  const {
    title = '招聘了',
    content = '广告'
  } = props
  return (
    <StyledAd>
      <StyledAdTitle>{title}</StyledAdTitle>
      <StyledAdBody>
        <Markdown children={content} />
      </StyledAdBody>
    </StyledAd>
  )
}