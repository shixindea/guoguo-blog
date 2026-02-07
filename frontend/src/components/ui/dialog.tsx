"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type DialogContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const ctx = React.useContext(DialogContext);
  if (!ctx) {
    throw new Error("Dialog components must be used within Dialog");
  }
  return ctx;
}

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  const value = React.useMemo(() => ({ open, onOpenChange }), [open, onOpenChange]);
  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
};

type AsChildProps = { asChild?: boolean };

type ClickableChildProps = {
  onClick?: (e: React.MouseEvent<unknown>) => void;
};

const DialogTrigger = ({ asChild, children }: AsChildProps & { children: React.ReactElement }) => {
  const { onOpenChange } = useDialogContext();
  const child = React.Children.only(children) as React.ReactElement<ClickableChildProps>;
  const next = React.cloneElement<ClickableChildProps>(child, {
    onClick: (e: React.MouseEvent<unknown>) => {
      child.props.onClick?.(e);
      if (e.defaultPrevented) return;
      onOpenChange(true);
    },
  });
  return asChild ? next : <button type="button" onClick={() => onOpenChange(true)}>{children}</button>;
};

const DialogPortal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
};

const DialogOverlay = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const { onOpenChange } = useDialogContext();
  return (
    <div
      className={cn("fixed inset-0 z-50 bg-black/80", className)}
      onMouseDown={(e) => {
        props.onMouseDown?.(e);
        if (e.defaultPrevented) return;
        onOpenChange(false);
      }}
      {...props}
    />
  );
};

const DialogClose = ({ asChild, children }: AsChildProps & { children: React.ReactElement }) => {
  const { onOpenChange } = useDialogContext();
  const child = React.Children.only(children) as React.ReactElement<ClickableChildProps>;
  const next = React.cloneElement<ClickableChildProps>(child, {
    onClick: (e: React.MouseEvent<unknown>) => {
      child.props.onClick?.(e);
      if (e.defaultPrevented) return;
      onOpenChange(false);
    },
  });
  return asChild ? next : <button type="button" onClick={() => onOpenChange(false)}>{children}</button>;
};

type DialogContentProps = React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode };

const DialogContent = ({ className, children, ...props }: DialogContentProps) => {
  const { open } = useDialogContext();
  if (!open) return null;
  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-lg duration-200 sm:rounded-lg dark:border-slate-800 dark:bg-slate-950",
          className
        )}
        {...props}
      >
        {children}
        <DialogClose asChild>
          <button
            type="button"
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none dark:ring-offset-slate-950 dark:focus:ring-slate-300"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogClose>
      </div>
    </DialogPortal>
  );
};

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);

const DialogTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
);

const DialogDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-slate-500 dark:text-slate-400", className)} {...props} />
);

export { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
