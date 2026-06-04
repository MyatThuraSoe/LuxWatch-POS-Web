import * as React from "react"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    src?: string
    alt?: string
    fallback?: string
  }
>(({ className, src, alt, fallback, ...props }, ref) => {
  const [hasError, setHasError] = React.useState(false)

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      {src && !hasError ? (
        <img
          className="aspect-square h-full w-full object-cover"
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
          {fallback && (
            <span className="text-sm font-medium">
              {fallback.toUpperCase().charAt(0)}
            </span>
          )}
        </div>
      )}
    </div>
  )
})
Avatar.displayName = "Avatar"

export { Avatar }
