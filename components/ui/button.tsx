import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  " inline-flex items-center justify-center whitespace-nowrap  rounded-full flex items-center justify-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 uppercase",
  {
    variants: {
      variant: {
        default: "bg-white hover:bg-neutral-500  ",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "bg-neutral-300 text-neutral-500  ",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "font-monumentMedium text-2xl lg:text-6xl h-[8.3vh] lg:h-[16.7vh] px-6  lg:px-8",
        sm: "font-monumentBold text-sm lg:text-base h-[4.17vh] lg:h-[8.3vh] px-6  lg:px-6",
        lg: "font-monumentMedium text-4xl lg:text-6xl h-[16.7vh]   px-8",
        icon: "h-[8.3vh] lg:h-[16.7vh] aspect-square text-2xl lg:text-6xl font-monumentMedium tracking-tight ",
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
