
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "bg-gray-light border-none rounded-lg py-3 px-4 text-black placeholder-gray-dark focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-apple w-full",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
