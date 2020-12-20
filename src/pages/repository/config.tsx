import React from 'react'
import { CommonItem } from "@/components/advancedSearchForm";
import { QueryRepsResultNode } from "@/utils/gql";
import { ColumnsType } from "antd/lib/table";
import { User } from '@/utils/gql/funcs/queryReps';
import { formatNumber } from '@/utils/formatNumber';

type Value = string | number | [Value, Value]
const createLabelValue = (values: Value[]) => {
  return values.map(value => {
    const valueType = typeof value
    if(valueType === 'string' || valueType === 'number') {
      return {
        label: value,
        value: value
      }
    }
    return {
      label: value[0],
      value: value[1]
    }
  })
}

export const items: CommonItem[] = [
  {
    name: 'language',
    type: 'Select',
    label: 'language',
    initialValue: 'JavaScript',
    props: {
      placeholder: '请输入 language',
      allowClear: true,
      options: createLabelValue([
        'TypeScript',
        'JavaScript',
        'CSS',
        'HTML',
        'Java',
        'Python',
        'PHP',
        'C',
        'C++',
        'Rust'
      ])
    },
    options: {
      rules: []
    }
  },
  {
    name: 'location',
    type: 'Select',
    label: 'location',
    props: {
      placeholder: '请输入 location, 英文/拼音（不区分大小写）',
      mode: 'tags'
    },
    options: {
      rules: []
    }
  },
  {
    name: 'stars',
    type: 'Input',
    label: 'stars',
    initialValue: '1000..1200',
    props: {
      placeholder: '请输入 stars, 如 200..300 start..end, 表示 200 ~ stars ~ 300',
      required: true
    },
    options: {
      rules: [
        {
          validator(rule, value) {
            if(!/\d+\.\.\d+/.test(value)) {
              return Promise.reject('stars invalid, 只支持区间搜索')
            }
            return Promise.resolve()
          }
        }
      ]
    }
  },
  {
    name: 'starStep',
    type: 'Select',
    label: 'starStep',
    initialValue: 50,
    props: {
      placeholder: '请选择 Star Step, 系统会按照 step 拆分请求, 避免单次搜索结果过多',
      options: createLabelValue([
        10,
        20,
        35,
        50,
        80,
        100,
      ])
    },
    options: {
      rules: [],
    }
  },
  {
    name: 'nonEmpty',
    type: 'Select',
    label: 'nonEmpty',
    initialValue: ['email'],
    props: {
      placeholder: '请选择非空项',
      allowClear: true,
      mode: 'multiple',
      options: createLabelValue([
        'email',
      ]),
    },
    options: {
      rules: [],
    }
  }
]

export const columns: ColumnsType<QueryRepsResultNode> = [
  {
    title: 'name',
    dataIndex: 'name',
    key: 'name',
    render(value, record) {
      return (
        <a href={record.url} target="_blank">{record.name}</a>
      )
    }
  },
  {
    title: 'owner',
    dataIndex: ['owner', 'login'],
    key: 'owner',
    render(value, record) {
      return (
        <a href={record.owner.url} target="_blank">{record.owner.login}</a>
      )
    }
  },
  {
    title: 'ownerEmail',
    dataIndex: ['owner', 'email'],
    key: 'ownerEmail',
    render(value, record) {
      if (!value) return '-'
      return (
        <a href={`mailto:${value}`} target="_blank">{value}</a>
      )
    },
  },
  {
    title: 'stargazer',
    dataIndex: 'stargazerCount',
    key: 'stargazerCount',
    render: value => formatNumber(value ?? 0),
    sorter: (a, b) => +a.stargazerCount - (+b.stargazerCount),
  },
  {
    title: 'primaryLanguage',
    dataIndex: ['primaryLanguage', 'name'],
    key: 'primaryLanguage',
  },
];

export const expandColumns: ColumnsType<User> = [
  {
    title: 'name',
    dataIndex: 'name',
    key: 'name',
    render(value, record) {
      return (
        <a href={record.url} target="_blank">{record.login}</a>
      )
    }
  },
  {
    title: 'email',
    dataIndex: 'email',
    key: 'email',
    render(value, record) {
      if (!value) return '-'
      return (
        <a href={`mailto:${value}`} target="_blank">{value}</a>
      )
    },
  },
  {
    title: 'followers',
    dataIndex: ['followers', 'totalCount'],
    key: 'followers',
    render: value => formatNumber(value ?? 0),
    sorter: (a, b) => +a.followers.totalCount - (+b.followers.totalCount),
  },
  {
    title: 'location',
    dataIndex: 'location',
    key: 'location',
  },
  
]