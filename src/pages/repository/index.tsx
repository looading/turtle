import { Page } from '@/components/page'
import React, { FC, useRef, useState } from 'react'

import { AdvancedSearchForm, AdvancedSearchFormRef } from '@/components/advancedSearchForm'
import { Button, Table } from 'antd'
import { useQuerySync } from '@/utils/hooks/useQuery'
import { get, isNil, omit, uniqBy } from 'lodash'
import { columns, expandColumns, items } from './config'
import { StyledSearchBox, StyledSearchResult, StyleSearchActions } from './styleds'
import { QueryRepsResultNode, spiltQueryRepoByStarStep } from '@/utils/gql/funcs/queryReps'
import { createAddressMatcher } from '@/utils/locationMatch'
import { EmailSender, EmailSenderFormStore, EmailSenderRef } from './components/emailSender'
import Modal from 'antd/lib/modal/Modal'
import { sendEmail } from '@/service/email'
import { sleep } from '@/utils/sleep'
import { useFetch } from '@/hooks/useFetch'
import { notice$ } from '@/utils/subjects'

interface FormStore {
  language?: string
  location?: string[]
  stars: string
  step: number,
  duplicate?: string[]
  nonEmpty?: string[]
}

const notServerFilters = ['location', 'starStep', 'nonEmpty']

// 校验一个对象某些属性是否非空
const validObjectPropertyNotNil = <O extends Record<string, any>>(obj: O, keys: string[]) => {
  for (const key of keys) {
    const value = get(obj, key, null)
    if (isNil(value) || value === '') {
      return false
    }
  }
  return true
}

// 数据预处理
const createPreProcessor = (formRef: React.MutableRefObject<AdvancedSearchFormRef>) => {
  return (data: QueryRepsResultNode[] = []) => {
    const filters: FormStore = formRef.current.form.getFieldsValue()
    const match = createAddressMatcher(filters.location)

    const nonEmpty = filters.nonEmpty ?? []

    // 过滤
    const ret = (data ?? [])
      .map(
        repo => {
          repo.contributes = (repo.contributes ?? [])
            .filter(
              contribute => {
                if (!validObjectPropertyNotNil(contribute, nonEmpty)) return false
                if (!match) return true
                return match(contribute.location)
              }
            )
          return repo
        }
      )
      .filter(
        repo => repo.contributes.length > 0
      )

    return ret
  }
}

// 提取 email, 并去重
const extractEmailsFromRepos = (repos: QueryRepsResultNode[]) => {
  return repos.reduce<string[]>(
    (pre, cur) => {
      return [
        ...pre,
        ...(new Set(
          cur.contributes
            .filter(c => !!c.email)
            .map(c => c.email))
        )
      ]
    },
    []
  )
}

export const SearchRepositoryPage: FC = props => {
  const formRef = useRef<AdvancedSearchFormRef>(null)
  const emailSenderFormRef = useRef<EmailSenderRef>(null)

  const [selectedData, setSelectedData] = useState<QueryRepsResultNode[]>([])

  const [
    emailSenderModalVisible,
    setEmailSenderVisible
  ] = useState(false)

  const {
    loading: sendEmailLoading,
    doFetch: execSendEmail
  } = useFetch(sendEmail)

  const {
    exec,
    data,
    loading
  } = useQuerySync(spiltQueryRepoByStarStep, createPreProcessor(formRef))

  const search = async (values: Record<string, any>) => {
    try {
      exec(
        omit(values, notServerFilters) as any,
        values.starStep,
        50
      )
    } catch (err) {
      console.error(err)
    }
  }

  const handleSendEmail = async () => {
    try {
      const values = await emailSenderFormRef.current.form.validateFields() as EmailSenderFormStore
      await execSendEmail(values)
      notice$.next({
        type: 'success',
        method: 'message',
        message: 'Send email success!',
        duration: 5
      })
      setEmailSenderVisible(false)
    } catch (err) {
      console.error(err)
      notice$.next({
        type: 'error',
        method: 'message',
        message: 'send email failed. look up for more infos from devtool.'
      })
    }
  }

  const emailToAll = async () => {
    setEmailSenderVisible(true)
    await sleep(0)
    emailSenderFormRef.current.form.setFieldsValue({
      addresses: [
        ...extractEmailsFromRepos(data)
      ]
    })
  }

  const emailToSelected = async () => {
    setEmailSenderVisible(true)
    await sleep(0)
    emailSenderFormRef.current.form.setFieldsValue({
      addresses: [
        ...extractEmailsFromRepos(selectedData)
      ]
    })
  }

  const rowSelection = {
    type: 'checkbox' as const,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedData(selectedRows)
    },
  };

  const expandedRowRender = (record: QueryRepsResultNode) => {
    const data = record.contributes ?? []
    return (
      <Table
        title={() => <>{record.name} contributes</>}
        columns={expandColumns}
        dataSource={data}
        pagination={false}
        rowKey={(record) => record.id}
      />
    )
  }

  return (
    <Page title="Search Repository">
      <StyledSearchBox>
        <AdvancedSearchForm
          ref={formRef}
          loading={loading}
          items={items}
          onSearch={values => search(values)}
        />
      </StyledSearchBox>
      <StyleSearchActions>
        <Button
          onClick={() => emailToSelected()}
          disabled={!selectedData.length}
        >
          Email to Selected
        </Button>
        <Button
          onClick={() => emailToAll()}
          disabled={!(data ?? []).length}
        >
          Email to All
        </Button>
      </StyleSearchActions>
      <StyledSearchResult>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(item) => item.id}
          rowSelection={rowSelection}
          pagination={{
            pageSize: 100,
            showTotal: (total: number, range: [number, number]) => <>总共{total}, {range.join('~')}</>
          }}
          expandable={{
            expandedRowRender
          }}
        />
      </StyledSearchResult>
      <Modal
        title='发送邮件'
        visible={emailSenderModalVisible}
        onCancel={() => setEmailSenderVisible(false)}
        onOk={handleSendEmail}
        okText='发送'
        okButtonProps={{
          loading: sendEmailLoading
        }}
        width={800}
        maskClosable={false}
      >
        <EmailSender
          ref={emailSenderFormRef}
        />
      </Modal>
    </Page>
  )
}