import { message } from "antd"
import { ErrorsMap } from "./errors"
import { sleep } from "./sleep"
import { notice$ } from "./subjects"

export const reportLimit_1000_Result = async (count: number) => {
  if (count > 1000) {
    notice$.next({
      type: 'removeAll',
      method: 'notification'
    })
    notice$.next({
      type: 'warn',
      method: 'notification',
      desc: `Search Result: ${count}, ${ErrorsMap['1002']}`,
      message: 'Result Limit'
    })
    await sleep(3000)
  }
}

/**
 * @param current 当前请求第几次
 */
export const reportQueryProgress = async (total: number, current: number, fragment = 100) => {
  const all = total > 1000 ? 1000 : total
  notice$.next({
    type: 'removeAll',
    method: 'message'
  })
  notice$.next({
    type: 'success',
    method: 'message',
    message: `Query Progress: ${current} / ${Math.ceil(all / 100)}`
  })
}

