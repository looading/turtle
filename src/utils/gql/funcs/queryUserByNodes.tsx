import { gql } from "graphql-request";
import { request } from "../config";
import { User } from "./queryReps";



interface Result {
  nodes: User[]
}

export const queryUserByNodes = async (nodes: string[]): Promise<User[]> => {
  try {
    const query = gql`
    query {
      nodes(ids: ${JSON.stringify(nodes)}) {
        ... on User {
          id
          __typename
          login
          url
          email
          location
          followers {
            totalCount
          }
        }
      }
    }
      `
    const res: Result = await request(query)
    return res.nodes
  } catch (err) {
    console.error(err)
    return []
  }
}