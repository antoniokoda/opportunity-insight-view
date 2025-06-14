
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-500 text-white hover:bg-blue-700",
        secondary:
          "border-transparent bg-gray-light text-black hover:bg-gray-dark",
        destructive:
          "border-transparent bg-gray-dark text-white hover:bg-gray DEFAULT",
        outline: "text-black border border-gray-dark",
        attended: "border-transparent bg-blue-500 text-white hover:bg-blue-700", // success now blue
        "not-attended": "border-transparent bg-gray-dark text-white hover:bg-gray DEFAULT",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
