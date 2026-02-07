"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { subscribe } from "@/lib/notify";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function GlobalApiTooltip() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const timerRef = useRef<number | null>(null);

  const providerProps = useMemo(() => ({ delayDuration: 0, skipDelayDuration: 0 }), []);

  useEffect(() => {
    return subscribe((msg) => {
      setMessage(msg);
      setOpen(true);
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        setOpen(false);
      }, 2500);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[60]">
      <TooltipProvider {...providerProps}>
        <Tooltip open={open} onOpenChange={setOpen}>
          <TooltipTrigger asChild>
            <button type="button" className="h-2 w-2 opacity-0 pointer-events-none" aria-hidden="true" />
          </TooltipTrigger>
          <TooltipContent
            side="left"
            align="start"
            className="bg-red-600 text-white text-sm px-4 py-3 rounded-xl shadow-2xl border border-red-300 max-w-[360px]"
          >
            <div className="font-semibold leading-snug">请求失败</div>
            <div className="mt-1 text-white/90 leading-snug break-words">{message}</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
