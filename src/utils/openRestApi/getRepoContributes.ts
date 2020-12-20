import { octokit } from "./config"


interface Result {
  nodes: {
    id: string
    login: string
    url: string
    __typename: string
    email: string
    location: string
    followers: {
      totalCount: string
    }
  }[]
}

export const getRepoContributes = async (owner: string, repo: string) => {
  try {
    const res = await octokit.repos.listContributors({
      owner,
      repo: repo,
      page: 1
    })

    if (res.status === 200) {
      return res.data
    }

    return []
  } catch(err) {
    console.error(err)
    return []
  }

}
