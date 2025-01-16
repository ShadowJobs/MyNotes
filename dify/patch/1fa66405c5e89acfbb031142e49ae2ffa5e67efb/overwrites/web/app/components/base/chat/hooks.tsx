import useSWR from 'swr'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { getPrevChatList } from '../utils'
import {
  fetchSharedChatListMmt,
} from '@/service/linservice'

export const useConversationWithoutAuth = () => {
  const params = useParams()
  const app_id = params?.appid as string
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)

  useEffect(() => {
    setCurrentConversationId(new URLSearchParams(window.location.search).get('conversationid'))
  }, [])

  const { data: mmtSharedData } = useSWR(
    currentConversationId ? [true, currentConversationId, app_id] : null,
    () => fetchSharedChatListMmt(currentConversationId as string, app_id),
  )

  const appPrevChatList = useMemo(
    () => (currentConversationId && mmtSharedData?.data.length)
      ? getPrevChatList(mmtSharedData.data)
      : [],
    [mmtSharedData, currentConversationId],
  )

  return { appPrevChatList }
}
