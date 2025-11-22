import * as React from "react"
import { Card, CardContent, CardHeader } from "./Card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  subtitleClassName?: string
  className?: string
}

export function StatsCard({
  title,
  value,
  subtitle,
  subtitleClassName,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-6">
        <h6 className="text-xs font-medium leading-snug tracking-wider text-muted-foreground uppercase">
          {title}
        </h6>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-2xl font-semibold leading-tight tracking-tight text-foreground">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {subtitle && (
          <p className={cn("text-xs font-normal leading-snug", subtitleClassName || "text-muted-foreground")}>
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
