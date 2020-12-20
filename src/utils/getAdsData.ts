import axios from 'axios'
import { useEffect, useState } from 'react'

export interface AdData {
  title: string,
  content: string
}

declare const ADS: any

export const getAdsData = async () => {
  try {
    const data = window['ADS']
    if(!data) {
      throw new Error('ads error')
    }
    return data
  } catch (err) {
    console.error('getAdsData', err)
    return [{
      title: '字节招聘-电商杭州前端',
      content: `
### 我们在做什么
- 电商 IM，负责商家和买家沟通的桥梁，我们有移动端，桌面端和 PC 端，由于业务特殊性，移动端需要投放到字节系的各个 APP，在跨终端的场景有很大的发挥空间，我们还有智能机器人，卡片搭建，总能让你找到适合自己的方向。
- 开放平台，负责将字节的电商能力输出给第三方开发者或者商家，让他们能够更好的使用字节电商平台，提供服务市场连接商家和开发者。同时我们也在探索通过逻辑编排来做原子接口自助开放的能力，前端的可发挥空间很大。
- 抖店罗盘，让商家和达人都能够及时准确的看到自己想看的数据，同时提供大屏服务，并沉淀了一套电商业务内统一的可视化图表组件库，对数据可视化，3D 渲染有兴趣的同学，在这里也能找到很好的施展空间。
- 搭建，电商业务中离不开大量的运营活动页面。在我们的场景，搭建会用于支持服务市场运营活动，IM卡片和数据大屏，相对于传统搭建平台复杂度会更高，可发展空间更大，对于搭建感兴趣的同学同样能够大展拳脚。

### 我们希望你
- 具有较强的沟通能力，分析和解决问题的能力，具备良好的团队合作精神；
- 3 年及以上 Web 前端开发经验，精通 HTML 、CSS 、JS，熟悉页面架构和布局，对表现与数据分离、Web 语义化等有深刻理解；
- 有数据可视化经验优先
- 有 3D 渲染经验优先
- 有页面搭建经验优先
- 有跨端开发经验优先
- 有 electron 桌面端开发经验优先
      `
    }]
  }
}

export const useAds = () => {
  const [ads, setAds] = useState<AdData[]>([])

  useEffect(() => {
    getAdsData()
      .then(res => {
        setAds(res)
      })
  }, [])

  return ads
}