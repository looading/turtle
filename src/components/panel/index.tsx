import styled from '@/styled'
import React, { FC } from 'react'

const StyledPanel = styled.div`
  padding: 12px;
`

export const Panel: FC = props => {
  const { children } = props

  return (
    <StyledPanel>
      {
        children
      }
    </StyledPanel>
  )
}