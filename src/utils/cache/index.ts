import { DATA_PREFIX_RegExp } from '@/constants'
import localforage from 'localforage'

export const initCache = () => {
  localforage.config({
    driver      : localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
    name        : 'looading',
    version     : 1.0,
    size        : 1024 * 1024 * 8 , // Size of database, in bytes. WebSQL-only for now.
    storeName   : 'github_search_enhance', // Should be alphanumeric, with underscores.
    description : 'github_search_enhance'
  })
}

export const getCache = async <R = any>(key: string) => {
  try {
    const item = await localforage.getItem<R>(key)
    return item
  } catch(err) {
    console.error(err)
    return null
  }
}

export const setCache = async <R = any>(key: string, value: any) => {
  try {
    const item = await localforage.setItem<R>(key, value)
    return item
  } catch(err) {
    console.error(err)
    return null
  }
}

export const clearCache = async (key: RegExp) => {
  try {
    const keys = await localforage.keys()
    const targets = keys.filter(k => key.test(k))
    for await (const target of targets) {
      await localforage.removeItem(target)
    }
  } catch(err) {
    console.error('clearCache', key)
    throw err
  }
}


export const clearDataCache = async () => {
  await clearCache(DATA_PREFIX_RegExp)
}
