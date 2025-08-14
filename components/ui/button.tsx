import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#143A50] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#18425D] text-white shadow hover:bg-[#2A5674]",
        destructive:
          "bg-[#BB2E2E] text-white shadow-sm hover:bg-[#CC4A4A] focus-visible:ring-[#A12828]",
        outline:
          "border border-[#18425D] text-[#18425D] bg-white shadow-sm hover:bg-[#E6ECF0] hover:text-[#2A5674]",
        secondary:
          "bg-[#E6ECF0] text-[#18425D] shadow-sm hover:bg-[#D1DCE5] hover:text-[#2A5674]",
        ghost: "hover:bg-[#E6ECF0] hover:text-[#2A5674]",
        link: "text-[#18425D] underline-offset-4 hover:underline hover:text-[#2A5674]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
