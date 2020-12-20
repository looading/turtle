import { Subject } from "rxjs";

interface CommonNoticePayload {
  type: 'success' | 'error' | 'warn' | 'removeAll'
  message?: string
  duration?: number
}

interface MessageNoticePayload extends CommonNoticePayload {
  method: 'message'
}

interface NotificationNoticePayload extends CommonNoticePayload {
  method: 'notification'
  desc?: string
}

type NoticePayload = MessageNoticePayload | NotificationNoticePayload

export const notice$ = new Subject<NoticePayload>()