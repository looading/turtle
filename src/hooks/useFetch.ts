import { useState } from "react"

export const useFetch = <F extends (...arg: any[]) => any>(fn: F) => {
  const [loading, setLoading] = useState(false)

  const doFetch = async (...params: Parameters<F>) => {
    setLoading(true)
    try {
      const res = await fn(...params)
      setLoading(false)
      return res
    } catch(err) {
      setLoading(false)
      throw err
    }
  }

  return {
    loading,
    doFetch
  }
}