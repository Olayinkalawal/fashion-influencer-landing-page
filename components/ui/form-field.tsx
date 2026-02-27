import * as React from "react";
import { cn } from "@/lib/utils";

export function FormField({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("space-y-2", className)}>{children}</div>;
}

export function FormLabel({
  className,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("text-sm font-medium text-foreground", className)} {...props}>
      {children}
    </label>
  );
}

export function FormHelpText({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <p className={cn("text-xs text-muted-foreground", className)}>{children}</p>;
}
