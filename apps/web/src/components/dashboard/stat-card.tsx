import type * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  loading,
}: {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  trend?: 'up' | 'down'
  trendLabel?: string
  loading?: boolean
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold">{value}</span>
            {trend && trendLabel && (
              <span
                className={cn(
                  'mb-0.5 flex items-center text-xs font-medium',
                  trend === 'up' ? 'text-primary' : 'text-destructive'
                )}
              >
                {trend === 'up' ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {trendLabel}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
