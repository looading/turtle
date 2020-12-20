import produce from "immer"
import { useEffect, useState } from "react"
import { BehaviorSubject } from "rxjs"

export const useQuery = <
  F extends (...arg: any[]) => Promise<any>,
  R extends (arg: F extends (...arg: any[]) => Promise<infer U> ? U : never) => any,
  FData = R extends (...arg: any[]) => infer C ? C : never
>(fn: F, preProcessor?: R) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<FData>(null)
  const exec = (...param: Parameters<F>) => {
    setLoading(true)
    fn(...param)
      .then(res => {
        setData(
          preProcessor
            ? preProcessor(res)
            : res
        )
        setLoading(false)
      })
      .catch((err) => {
        console.error('useQuery', err)
        setLoading(false)
      })
  }

  return {
    exec,
    data,
    loading
  }
}

export const useQuerySync = <
  F extends (...arg: any[]) => Promise<any>,
  R extends (arg: F extends (...arg: any[]) => Promise<infer U> ? U : never) => any,
  FData = R extends (...arg: any[]) => infer C ? C : never
>(fn: F, preProcessor?: R) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<FData>(null)
  const [data$, _data$] = useState(() => new BehaviorSubject<FData>(null))
  const exec = (...param: Parameters<F>) => {
    setLoading(true)
    const fullParam = Array.from(
      new Array(fn.length),
      (_, index) => param[index]
    )
    fn(...[...fullParam, data$])
      .then(res => {
        const ret = produce(draft => {
          preProcessor && preProcessor(draft as any)
        })(res)
        setData(ret)
        setLoading(false)
      })
      .catch((err) => {
        console.error('useQuery', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    const disposal = data$
      .subscribe(res => {
        const ret = produce(draft => {
          preProcessor && preProcessor(draft as any)
        })(res)
        setData(ret)
      })
    return () => {
      disposal.unsubscribe()
    }
  }, [])

  return {
    exec,
    data,
    loading
  }
}
