
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        /* Estilo Apple: fondo gris sutil, sin bordes, focus ring azul - Tarea 3.1 */
        className={cn(
          "bg-zinc-100 border-none rounded-lg py-3 px-4 text-zinc-900 placeholder-zinc-500 focus:bg-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-apple w-full",
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
