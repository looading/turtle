import { gql } from "graphql-request"
import { request } from "../config"

export interface UserInfo {
  viewer: {
    login: string
    avatarUrl: string
  }
  rateLimit: {
    limit: number
    cost: number
    remaining: number
    resetAt: string
  }
}

export const queryUserInfo = async (): Promise<UserInfo> => {
  const query = gql`
query {
  viewer {
    login
    avatarUrl
  }
  rateLimit {
    limit
    cost
    remaining
    resetAt
  }
}
  `
  return request(query)
}