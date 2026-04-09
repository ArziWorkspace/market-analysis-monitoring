// TanStack Query query factories - these use fetch() to call API routes
// NOT direct DAL imports (which would bundle Node.js-only modules like `pg` into client)

export const reportQueries = {
  all: () => ["reports"] as const,
  lists: () => [...reportQueries.all(), "list"] as const,
  latest: () => [...reportQueries.all(), "latest"] as const,
  detail: (id: string) => [...reportQueries.all(), "detail", id] as const,
}

export const reportListQuery = {
  queryKey: reportQueries.lists(),
  queryFn: async () => {
    const res = await fetch("/api/report")
    if (!res.ok) throw new Error("Failed to fetch reports")
    const data = await res.json()
    return data.reports ?? []
  },
}

export const reportLatestQuery = {
  queryKey: reportQueries.latest(),
  queryFn: async () => {
    const res = await fetch("/api/report")
    if (!res.ok) throw new Error("Failed to fetch latest report")
    const data = await res.json()
    return data.latest ?? null
  },
}

export const reportDetailQuery = (id: string) => ({
  queryKey: reportQueries.detail(id),
  queryFn: async () => {
    const res = await fetch(`/api/report/${id}`)
    if (!res.ok) throw new Error("Failed to fetch report")
    return res.json()
  },
})
