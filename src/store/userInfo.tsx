import { TURTLE__NOT_LOGIN } from "@/constants";
import { UserInfo, queryUserInfo } from "@/utils/gql";
import { token$, updateToken, useToken } from "@/utils/gql/config";
import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";

export const userInfo$ = new BehaviorSubject<UserInfo>(null)

const isLogin = (token: string) => {
  return token !== TURTLE__NOT_LOGIN
}

const updateUserInfo = async () => {
  const info = await queryUserInfo()
  userInfo$.next(info)
}

export const login = async (token: string) => {
  try {
    await updateToken(token)
  } catch (err) {
    logout()
  }
}

export const initUser = () => {

  token$.subscribe(async (token) => {
    try {
      if (token && isLogin(token)) {
        await updateUserInfo()
      } else {
        userInfo$.next(null)
      }
    } catch (err) {
      console.error(err)
    }
  })
}

export const logout = () => {
  updateToken(TURTLE__NOT_LOGIN)
}

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>(null)
  const { token } = useToken()

  useEffect(() => {
    const disposal = userInfo$.subscribe(info => {
      setUserInfo(info)
    })
    return () => {
      disposal.unsubscribe()
    }
  }, [])

  return {
    userInfo,
    login,
    logout,
    isLogin: isLogin(token)
  }
}