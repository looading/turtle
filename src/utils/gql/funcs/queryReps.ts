import { DATA_PREFIX } from "@/constants";
import { getCache, setCache } from "@/utils/cache";
import { reportLimit_1000_Result, reportQueryProgress } from "@/utils/notice";
import { getRepoContributes } from "@/utils/openRestApi/getRepoContributes";
import { gql } from "graphql-request"

import { uniqBy } from 'lodash'
import { BehaviorSubject } from "rxjs";


import { request } from "../config"
import { queryUserByNodes } from "./queryUserByNodes";

interface QueryValues {
  language: string
  stars: string
}

const stringifyValues = (values: QueryValues) => {
  return Object.entries(values)
    .map(
      ([key, value]) => {
        const v = typeof value === 'string'
          ? [value]
          : value
        return `${key}:${(v ?? []).join(',')}`
      }
    )
    .join(' ')
}

export interface User {
  id?: string
  login: string
  url: string
  __typename: string
  email: string
  location: string
  followers: {
    totalCount: string
  }
}

export interface QueryRepsResultNode {
  id: string
  name: string
  url: string
  primaryLanguage: {
    name: string
  }
  owner: User
  stargazerCount: number
  contributes?: User[]
}

export interface QueryRepsResult {
  search: {
    pageInfo: {
      hasNextPage: boolean
      startCursor: string
      endCursor: string
    }
    count: number
    nodes: QueryRepsResultNode[]
  }
}

export const queryReps = async (values: QueryValues, after?: string) => {
  const afterQuery = after ? `after: "${after}"` : '';
  const valuesString = stringifyValues(values)
  const query = gql`
query {

  search(query: "${valuesString}", type: REPOSITORY, first: 100, ${afterQuery}) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        __typename
      }
      cursor
    }

    count: repositoryCount

		nodes {
      ... on Repository {
        id
        name
        url
        primaryLanguage {
          name
        }
        owner {
          login
          url
          __typename
          ... on User {
            email
            location
            followers {
              totalCount
            }
          }
        }
        stargazerCount
      }
    }
  }
}
  `

  const result: QueryRepsResult = await request(query)

  const promiseArray = result.search.nodes.map(node => {
    return getRepoContributes(node.owner.login, node.name)
      .then(refNodes => {
        return queryUserByNodes(refNodes.map(node => node.node_id))
      })
      .then(users => {
        // 引用修改地址
        node.contributes = users
        return node
      })
  })

  await Promise.all(promiseArray)
  return result
}

const duplicateData = (data: QueryRepsResultNode[]) => {
  return uniqBy<QueryRepsResultNode>(data, (a) => {
    return a.id
  })
}

// 数据可能重复
const queryAllReps = async (values: QueryValues, max: number, subject$ = new BehaviorSubject([])) => {
  const res = await queryReps(values)
  const data = res.search.nodes
  subject$.next(data)

  let pageInfo = res.search.pageInfo

  await reportLimit_1000_Result(res.search.count)

  let i = 0
  while (pageInfo.hasNextPage) {
    if (i > max) {
      break
    }
    i++
    const { search: {
      nodes,
      pageInfo: nextPageInfo
    } } = await queryReps(values, pageInfo.endCursor)
    pageInfo = nextPageInfo
    data.push(...nodes)
    subject$.next(data)
  }

  return data
}

/**
 * 根据 step 拆分 query ，尽量保证能获取全量数据（去重后）
 */
export const spiltQueryRepoByStarStep = async (values: QueryValues, step: number, max: number, subject$ = new BehaviorSubject([])) => {

  const cacheKey = `${DATA_PREFIX}${JSON.stringify(values)}___${max}`
  console.time(cacheKey)

  const cache = await getCache<QueryRepsResultNode[]>(cacheKey)

  const childSubject$ = new BehaviorSubject([])
  const data: QueryRepsResultNode[] = []

  const disposal = childSubject$.subscribe(
    childData => {
      data.push(...childData)
      subject$.next(duplicateData(data))
    }
  )

  if (cache) {
    subject$.next(cache)
    disposal.unsubscribe()
    console.timeEnd(cacheKey)
    return cache
  }

  const { stars } = values
  const range: string[] = stars.split('..')
  const length = (+range[1]) - (+range[0])
  const count = Math.ceil(length / step)

  for (let index = 0; index < count; index++) {
    const start = +(range[0]) + index * step

    const end = start + step
    const stars = [start, end >= +(range[1]) ? +(range[1]) : end].join('..')
    const query = {
      ...values,
      stars
    }
    await queryAllReps(query, max, childSubject$)
  }

  const uniqData = duplicateData(data)
  await setCache(cacheKey, uniqData)
  disposal.unsubscribe()
  const ret = duplicateData(uniqData)
  console.timeEnd(cacheKey)
  return ret
}