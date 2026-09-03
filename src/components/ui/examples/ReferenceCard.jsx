import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2, Play } from 'lucide-react';
import { cn } from '@/lib/utils'; // Example of using tailwind-merge util

/**
 * ReferenceCard
 * This is a reference implementation showing how to build a premium UI component.
 * It demonstrates:
 * 1. Using design tokens (bg-card, text-card-foreground, etc.)
 * 2. Handling 4 states (Initial/Active, Loading, Error)
 * 3. Incorporating lucide-react icons
 * 4. Micro-interactions via framer-motion and tailwind hover states
 */
export default function ReferenceCard({
  title,
  description,
  isLoading = false,
  isError = false,
  onClick,
  className,
}) {
  // State 1: Loading
  if (isLoading) {
    return (
      <div className={cn("w-full p-6 rounded-xl border border-border bg-card text-card-foreground shadow flex flex-col gap-4 animate-pulse", className)}>
        <div className="h-6 w-1/3 bg-muted rounded"></div>
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="flex items-center gap-2 mt-4">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  // State 2: Error
  if (isError) {
    return (
      <div className={cn("w-full p-6 rounded-xl border border-destructive bg-destructive/10 text-destructive shadow flex flex-col gap-4", className)}>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <h3 className="font-semibold text-lg">Failed to load</h3>
        </div>
        <p className="text-sm opacity-90">Please try again later.</p>
      </div>
    );
  }

  // State 3 & 4: Initial & Hover/Active
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group cursor-pointer w-full p-6 rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-colors hover:border-primary/50 hover:shadow-md flex flex-col gap-3",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="p-2 rounded-full bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Play className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}
