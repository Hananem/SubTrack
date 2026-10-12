// src/hooks/useSubscriptions.ts

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query'
import api from '@/lib/api'
import { Subscription, DashboardStats } from '@/types'
import { AxiosError } from 'axios'

const KEYS = {
  all: ['subscriptions'] as const,
  stats: ['subscriptions', 'stats'] as const,
}

// ── Queries ────────────────────────────────────────────────────────────────

export function useSubscriptions(): UseQueryResult<Subscription[]> {
  return useQuery({
    queryKey: KEYS.all,
    queryFn: async () => {
      const { data } = await api.get<Subscription[]>('/subscriptions')
      return data
    },
  })
}

export function useDashboardStats(): UseQueryResult<DashboardStats> {
  return useQuery({
    queryKey: KEYS.stats,
    queryFn: async () => {
      const { data } = await api.get<DashboardStats>('/subscriptions/dashboard')
      return data
    },
  })
}

export function useSubscription(
  id: number,
): UseQueryResult<Subscription> {
  return useQuery({
    queryKey: ['subscriptions', id],
    queryFn: async () => {
      const { data } = await api.get<Subscription>(`/subscriptions/${id}`)
      return data
    },
    enabled: !!id,
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────

type CreatePayload = Omit<Subscription, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'nextPayment' | 'status'>

export function useCreateSubscription(): UseMutationResult<
  Subscription,
  AxiosError,
  CreatePayload
> {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post<Subscription>('/subscriptions', payload)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all })
      qc.invalidateQueries({ queryKey: KEYS.stats })
    },
  })
}

export function useUpdateSubscription(): UseMutationResult<
  Subscription,
  AxiosError,
  { id: number; payload: Partial<CreatePayload> }
> {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await api.put<Subscription>(`/subscriptions/${id}`, payload)
      return data
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: KEYS.all })
      qc.invalidateQueries({ queryKey: ['subscriptions', id] })
      qc.invalidateQueries({ queryKey: KEYS.stats })
    },
  })
}

export function useDeleteSubscription(): UseMutationResult<
  void,
  AxiosError,
  number
> {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/subscriptions/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all })
      qc.invalidateQueries({ queryKey: KEYS.stats })
    },
  })
}

export function useToggleStatus(): UseMutationResult<Subscription, AxiosError, number> {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.patch<Subscription>(`/subscriptions/${id}/toggle-status`)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all })
      qc.invalidateQueries({ queryKey: KEYS.stats })
    },
  })
}

export function useMarkPaymentDone(): UseMutationResult<Subscription, AxiosError, number> {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.patch<Subscription>(`/subscriptions/${id}/payment-done`)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all })
      qc.invalidateQueries({ queryKey: KEYS.stats })
    },
  })
}
