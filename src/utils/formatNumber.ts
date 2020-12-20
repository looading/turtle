import numeral from 'numeral'

export const formatNumber = (value: string | number) => numeral(value).format('0,0')