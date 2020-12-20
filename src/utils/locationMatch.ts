/**
 * 地址匹配
 */

import { memoize, toLower } from "lodash";

export const createAddressMatcher = memoize(
  (rules: string[]) => {
    if (!rules) return false
    const childs = rules
      .filter(
        v => !!addresses[toLower(v)]
      )
      .reduce((pre, cur) => {
        return [
          ...pre,
          ...addresses[toLower(cur)]
        ]
      }, [])

    const uniqArray = [
      ...new Set([
        ...childs,
        ...rules
      ])
    ]

    const address = new RegExp(`(${uniqArray.join('|')})`, 'i')

    return memoize((str: string) => {
      return address.test(str)
    })
  }
)

const addresses = {
  'china': [
    'hebei', // 河北省
    '河北',
    'shanxi', // 山西省
    '山西',
    'jilin', // 吉林省
    '吉林',
    'liaoning', // 辽宁省
    '辽宁',
    'heilongjiang', // 黑龙江省
    '黑龙江',
    'shanxi', // 陕西省
    '山西',
    'gansu', // 甘肃省
    '甘肃',
    'qinghai', // 青海省
    '青海',
    'shandong', // 山东省
    '山西',
    'fujian', // 福建省
    '福建',
    'zhejiang', // 浙江省
    '浙江',
    'taiwan', // 台湾省
    '台湾',
    'henan', // 河南省,
    '河南',
    'hubei', // 湖北省
    '湖北',
    'hunan', // 湖南省
    '湖南',
    'jiangxi', // 江西省,
    '江西',
    'jiangsu', // 江苏省
    '江苏',
    'anhui', // 安徽省
    '安徽',
    'guangdong', // 广东省
    '广东',
    'hainan', // 海南省
    '海南',
    'sichuan', // 四川省
    '四川',
    'guizhou', // 贵州省
    '贵州',
    'yunnan', // 云南省
    '云南',
    'taipei',
    '台北',
    '厦门',
    'xiamen',
    'xian',
    '西安',
    'xi`an'
  ]
}