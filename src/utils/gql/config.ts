import { CACHE_KEY_TOKEN, TURTLE__NOT_LOGIN } from '@/constants'
import { GraphQLClient } from 'graphql-request'
import { useEffect, useState } from 'react'
import { BehaviorSubject } from 'rxjs'
import { getCache, setCache } from '../cache'
import { notice$ } from '../subjects'

export const token$ = new BehaviorSubject<string>(TURTLE__NOT_LOGIN)
 
let graphQLClient: GraphQLClient

export const initGql = () => {
  const endpoint = 'https://api.github.com/graphql'
 
  graphQLClient = new GraphQLClient(endpoint)

  token$.subscribe((token) => {
    graphQLClient.setHeader('authorization', `Bearer ${token}`)
  })

  getToken()
}

export async function request(query: string) {
  if(!token$.getValue()) {
    notice$.next({
      type: 'error',
      method: 'message',
      message: 'Not Login'
    })
    throw Error('Not Login')
  }
  try {
    const data = await graphQLClient.request(query)
    return data
  } catch (err) {
    if(err) {
      notice$.next({
        type: 'error',
        method: 'message',
        message: 'Query Failed.',
      })
    }
    throw err
  }
}

export const updateToken = async (token: string) => {
  await setCache(CACHE_KEY_TOKEN, token)
  await getToken()
}

export const getToken = async () => {
  const token = await getCache<string>(CACHE_KEY_TOKEN)
  token$.next(!!token ? token : TURTLE__NOT_LOGIN)
}

window['updateToken'] = updateToken


export const useToken = () => {
  const [token, setToken] = useState(TURTLE__NOT_LOGIN)

  useEffect(() => {
    const disposal = token$
      .subscribe(t => {
        setToken(!!t ? t : TURTLE__NOT_LOGIN)
      })

    return () => {
      disposal.unsubscribe()
    }
  }, [])

  return {
    token
  }
}