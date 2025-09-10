"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

const DashboardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <header
      ref={ref}
      className={cn(
        "sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/60 px-4 backdrop-blur",
        className
      )}
      {...props}
    />
  )
})
DashboardHeader.displayName = "DashboardHeader"

export { DashboardHeader }
