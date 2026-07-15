"use client";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "text-white grad-heart shadow-sm hover:opacity-95 active:opacity-90 border-transparent",
  secondary:
    "bg-white text-brand-600 border border-brand-200 hover:bg-brand-50",
  ghost: "bg-transparent text-plum-soft hover:bg-black/5 border-transparent",
  danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100",
  dark: "bg-plum text-white hover:opacity-90 border-transparent",
  outline: "bg-white text-plum border border-[var(--border)] hover:bg-brand-50/50",
};

const sizes = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-sm gap-2 rounded-xl",
  icon: "h-9 w-9 rounded-lg",
};

export default function Button({
  as: Comp = "button",
  variant = "primary",
  size = "md",
  className,
  children,
  disabled,
  ...props
}) {
  return (
    <Comp
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center font-semibold whitespace-nowrap transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
