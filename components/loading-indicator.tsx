import { cn } from "@/lib/utils"

type LoadingIndicatorProps = {
  className?: string
  label?: string
}

export function LoadingIndicator({
  className,
  label = "Loading...",
}: LoadingIndicatorProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-2 text-sm font-medium", className)}
      role="status"
    >
      <span
        className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent"
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  )
}
