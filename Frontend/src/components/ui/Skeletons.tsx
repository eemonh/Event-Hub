function SkeletonBlock({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-slate-200/80 ${className}`}
    />
  )
}

function EventCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <SkeletonBlock className="h-48 w-full rounded-none bg-slate-200" />
      <div className="space-y-4 p-5">
        <SkeletonBlock className="h-4 w-24 bg-violet-100" />
        <div className="space-y-2">
          <SkeletonBlock className="h-6 w-5/6" />
          <SkeletonBlock className="h-4 w-2/3" />
        </div>
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-3/4" />
          <SkeletonBlock className="h-4 w-1/2" />
        </div>
        <SkeletonBlock className="h-11 w-full rounded-xl bg-violet-100" />
      </div>
    </div>
  )
}

function HeaderSkeleton({ compact = false }) {
  return (
    <div className={compact ? "mb-2 space-y-3" : "mb-8 space-y-3"}>
      <SkeletonBlock className="h-9 w-64 max-w-full" />
      <SkeletonBlock className="h-4 w-80 max-w-full" />
    </div>
  )
}

function FilterSkeleton() {
  return (
    <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] md:flex-row">
      <SkeletonBlock className="h-12 flex-1 rounded-xl" />
      <SkeletonBlock className="h-12 w-full rounded-xl md:w-44" />
    </div>
  )
}

function TableRowsSkeleton({ rows = 6, columns = 5 }) {
  return (
    <tbody className="divide-y divide-gray-100">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <td key={columnIndex} className="px-6 py-5">
              <div className="flex items-center gap-3">
                {columnIndex === 0 && <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl bg-violet-100" />}
                <div className="w-full space-y-2">
                  <SkeletonBlock className="h-4 w-full max-w-[180px]" />
                  {columnIndex === 0 && <SkeletonBlock className="h-3 w-24" />}
                </div>
              </div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

function EventGridSkeleton({ compact = false, showFilters = true, count = 6 }) {
  return (
    <>
      <HeaderSkeleton compact={compact} />
      {showFilters && <FilterSkeleton />}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
          <EventCardSkeleton key={index} />
        ))}
      </div>
    </>
  )
}

function DashboardTableSkeleton({ columns = 5, rows = 6, showHeader = true }) {
  return (
    <>
      {showHeader && <HeaderSkeleton compact />}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-purple-50/50">
                {Array.from({ length: columns }).map((_, index) => (
                  <th key={index} className="px-6 py-4">
                    <SkeletonBlock className="h-3 w-24 bg-purple-100" />
                  </th>
                ))}
              </tr>
            </thead>
            <TableRowsSkeleton rows={rows} columns={columns} />
          </table>
        </div>
      </div>
    </>
  )
}

function DashboardCardsSkeleton() {
  return (
    <>
      <HeaderSkeleton />
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between">
              <div className="space-y-3">
                <SkeletonBlock className="h-3 w-28" />
                <SkeletonBlock className="h-10 w-20" />
              </div>
              <SkeletonBlock className="h-11 w-11 rounded-xl bg-violet-100" />
            </div>
            <SkeletonBlock className="h-4 w-40" />
          </div>
        ))}
      </div>
      <DashboardTableSkeleton columns={5} rows={5} showHeader={false} />
    </>
  )
}

function EventDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#F6F1F7] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-6 flex items-center justify-between">
          <SkeletonBlock className="h-10 w-28 bg-violet-100" />
          <SkeletonBlock className="h-8 w-32 bg-violet-100" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          <SkeletonBlock className="h-[400px] rounded-[14px] bg-slate-300" />
          <div className="rounded-[14px] border border-[#DDD6E1] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="space-y-3">
              <SkeletonBlock className="h-5 w-24 bg-violet-100" />
              <SkeletonBlock className="h-9 w-4/5" />
              <SkeletonBlock className="h-4 w-full" />
            </div>
            <div className="my-5 border-t border-[#ECE8EF]" />
            <div className="space-y-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-start gap-3">
                  <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl bg-violet-100" />
                  <div className="w-full space-y-2">
                    <SkeletonBlock className="h-4 w-24" />
                    <SkeletonBlock className="h-4 w-4/5" />
                  </div>
                </div>
              ))}
            </div>
            <SkeletonBlock className="mt-6 h-12 w-full rounded-xl bg-violet-100" />
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            <SkeletonBlock className="h-7 w-48" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-11/12" />
            <SkeletonBlock className="h-4 w-3/4" />
          </div>
          <SkeletonBlock className="h-[360px] rounded-2xl bg-slate-300" />
        </div>
      </div>
    </div>
  )
}

function ModalFormSkeleton() {
  return (
    <div className="space-y-6 p-6 sm:p-8">
      <div className="space-y-3">
        <SkeletonBlock className="h-7 w-40" />
        <SkeletonBlock className="h-4 w-64 max-w-full" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className={index === 6 ? "space-y-2 sm:col-span-2" : "space-y-2"}>
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-11 w-full rounded-lg" />
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
        <SkeletonBlock className="h-10 w-20 rounded-lg" />
        <SkeletonBlock className="h-10 w-28 rounded-lg bg-violet-100" />
      </div>
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <SkeletonBlock className="h-10 w-36 bg-violet-100" />
          <div className="hidden items-center gap-3 sm:flex">
            <SkeletonBlock className="h-9 w-24" />
            <SkeletonBlock className="h-9 w-9 rounded-full bg-violet-100" />
          </div>
        </div>
        <EventGridSkeleton />
      </div>
    </div>
  )
}

export {
  DashboardCardsSkeleton,
  DashboardTableSkeleton,
  EventDetailSkeleton,
  EventGridSkeleton,
  ModalFormSkeleton,
  PageSkeleton,
  SkeletonBlock,
}
