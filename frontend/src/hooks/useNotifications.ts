// src/hooks/useNotifications.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Notification } from '@/types'

const KEYS = {
  all: ['notifications'] as const,
  unread: ['notifications', 'unread'] as const,
}

export function useNotifications() {
  return useQuery({
    queryKey: KEYS.all,
    queryFn: async () => {
      const { data } = await api.get<Notification[]>('/notifications')
      return data
    },
  })
}

export function useUnreadCount() {
  return useQuery({
    queryKey: KEYS.unread,
    queryFn: async () => {
      const { data } = await api.get<{ count: number }>('/notifications/unread-count')
      return data.count
    },
    refetchInterval: 60_000, // poll every minute
  })
}

export function useMarkAllRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await api.patch('/notifications/mark-all-read')
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all })
      qc.invalidateQueries({ queryKey: KEYS.unread })
    },
  })
}
