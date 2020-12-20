import { Page } from '@/components/page'
import React, { FC } from 'react'

import Markdown from 'react-markdown'
import content from './home.md'

export const Home: FC = props => {
  return (
    <Page title='Home'>
      <Markdown children={content} />
    </Page>
  )
}