
/**
 * 系统级错误
 */
export class SystemError extends Error {
  __type = 'system'
}

/**
 * 不需要在进行处理的错误
 */
export class TransparentError extends Error {
  __type = 'transparent'
}

/**
 * 业务错误
 */
export class BizError extends Error {
  __type = 'biz'

  constructor(public code: string, message?: string) {
    super(message)
  }
}

export const ErrorsMap = {
  '1000': 'Not Login',
  '1001': 'Token Invalid',
  '1002': '搜索结果过大，Github 限制最多返回 1000 条结果，请缩小搜索范围，或者修改 star step .'
}