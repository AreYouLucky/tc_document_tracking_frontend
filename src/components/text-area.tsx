import * as React from "react"

function Textarea({ className = "", ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={
        "border-input placeholder:text-muted-foreground  aria-invalid:ring-destructive/20 aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full border bg-transparent px-3 py-2 text-[12.5px] shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-xl rounded-2xl " +
        className
      }
      {...props}
    />
  )
}

export { Textarea }