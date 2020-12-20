import axios from "axios"

interface SendEmailParams {
  addresses: string[]
  user: string
  password: string
  title: string
  content: string
}

export const sendEmail = async (params: SendEmailParams) => {
  try {
    const res = await axios
      .post(
        '/sendmail',
        params
      )
    return res
  } catch (err) {
    console.error(err)
    throw err
  }
}