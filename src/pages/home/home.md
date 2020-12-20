## Turtle - Github Search Enhance
最近苦于搜寻简历，没有一个比较好的渠道搜集优秀人才信息，受 []() 启发而自己做了个工具

帮助寻找 GitHub 上的优秀人才, 搜索功能增强，聚合显示更多的信息
根据语言分类搜索仓库，获取仓库 owner 以及相关信息，排序等等

### 打个广告
- [字节杭州电商前端团队内推链接](https://job.toutiao.com/s/J48ayuT)
- [字节内推链接](https://job.toutiao.com/s/J48uWhF)

### Tip

本站通过调用 [Github Graphql open api](https://docs.github.com/cn/free-pro-team@latest/graphql) 来获取数据。

但是 GitHub 防止过度或胡乱调用 GitHub 的服务器。GitHub GraphQL API 有一定的[资源限制](https://docs.github.com/cn/free-pro-team@latest/graphql/overview/
resource-limitations)

- [节点限制](https://docs.github.com/cn/free-pro-team@latest/graphql/overview/resource-limitations#%E8%8A%82%E7%82%B9%E9%99%90%E5%88%B6)
  - Clients must supply a first or last argument on any connection.
    first 和 last 的值必须在 1 至 100 之间。
  - Individual calls cannot request more than 500,000 total nodes.
- [速率限制](https://docs.github.com/cn/free-pro-team@latest/graphql/overview/resource-limitations#%E9%80%9F%E7%8E%87%E9%99%90%E5%88%B6)
  - GraphQL API v4 的速率限制为 5,000 points per hour（每小时 5,000 点）。
  - 对于属于 GitHub Enterprise Cloud 帐户的 GitHub 应用程序 或 OAuth 应用程序，对相同 GitHub Enterprise Cloud 帐户拥有的资源的请求上限已提升至每小时 15,000 点。

### Token
本站不默认提供 Token。 使用本站功能需个人提供 GitHub Token 登陆。
如何获取 Token？
- Github Account [Sign In](https://github.com/login) or [Sign Up](https://github.com/join)
- [creating-a-personal-access-token](https://docs.github.com/cn/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token)
- Safekeeping you Token

### 文档

#### 相关搜索规则
[search-syntax](https://docs.github.com/en/free-pro-team@latest/github/searching-for-information-on-github/understanding-the-search-syntax#query-for-dates)

详细的文档。。。大家都是程序员，对于文档这件事。。。我有时间一定会补上的！

### 免责申明
本站无服务端、纯前端页面。搜索所用到的数据都是通过提供的 Token 调用 GitHub Open Api 获取。
Token 只会存储在私人浏览器的 IndexedDB 中。
鉴于 GitHub GraphQL API 的一些限制条件，因此对搜索做了一定的优化，统一筛选条件执行结果会存储在 IndexedDB 中，避免资源浪费。（也可以通过提供的功能清理 IndexedDB)

### 开源协议

---
基于[WTFPL](http://en.wikipedia.org/wiki/WTFPL)协议开源。
