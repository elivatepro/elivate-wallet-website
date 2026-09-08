"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Tooltip as TooltipPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const TooltipProvider = ({
  delayDuration = 200,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) => (
  <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
)

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = ({
  className,
  sideOffset = 6,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      sideOffset={sideOffset}
      className="z-50"
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 24,
          mass: 0.7,
        }}
        className={cn(
          "origin-center bg-foreground px-2.5 py-1.5 font-mono text-base leading-none tracking-widest text-background uppercase shadow-[0_10px_30px_-10px_oklch(0_0_0_/_0.35)]",
          className
        )}
      >
        {children}
      </motion.div>
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
)

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
