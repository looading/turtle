import { Octokit } from '@octokit/rest'
import { createTokenAuth } from "@octokit/auth-token";
import { retry } from '@octokit/plugin-retry'
import { throttling } from '@octokit/plugin-throttling'

import { token$ } from '../gql/config'
import { TURTLE__NOT_LOGIN } from '@/constants';

const MyOctokit = Octokit
  .plugin(retry)
  .plugin(throttling)

const createOctokit = (token: string) => {
  return new MyOctokit({
    auth: token,  
    throttle: {
      onRateLimit: (retryAfter, options) => {
        octokit.log.warn(
          `Request quota exhausted for request ${options.method} ${options.url}`
        );

        // Retry twice after hitting a rate limit error, then give up
        if (options.request.retryCount <= 3) {
          console.log(`Retrying after ${retryAfter} seconds!`);
          return true;
        }
      },
      onAbuseLimit: (retryAfter, options) => {
        // does not retry, only logs a warning
        octokit.log.warn(
          `Abuse detected for request ${options.method} ${options.url}`
        );
      },
    }
  })
}


export let octokit = createOctokit(TURTLE__NOT_LOGIN)

export const initOpenRestApi = () => {
  token$.subscribe(token => {
    octokit = createOctokit(token)
  })

  return octokit
}