import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] active:scale-[0.98] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-soft)] hover:bg-[var(--primary-hover)] hover:shadow-[var(--shadow-raised)]",
        secondary:
          "bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border-strong)] hover:border-[var(--primary)] hover:text-[var(--primary)]",
        ghost: "text-[var(--muted-foreground)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
        soft: "bg-[var(--primary-soft)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]",
        outline:
          "border border-[var(--border-strong)] text-[var(--foreground)] hover:bg-[var(--surface-muted)]",
        danger: "bg-[var(--danger)] text-white hover:opacity-90",
        link: "text-[var(--primary)] underline-offset-4 hover:underline rounded-md px-0",
      },
      size: {
        sm: "h-9 px-4 text-sm [&_svg]:size-4",
        md: "h-11 px-5 text-sm [&_svg]:size-4",
        lg: "h-13 px-7 text-base [&_svg]:size-5",
        icon: "size-10 [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonBaseProps = VariantProps<typeof buttonVariants> & { className?: string };

export type ButtonProps = ButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export type ButtonLinkProps = ButtonBaseProps &
  Omit<React.ComponentProps<typeof Link>, "className"> & { className?: string };

export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
