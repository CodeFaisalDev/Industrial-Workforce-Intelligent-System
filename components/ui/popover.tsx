'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface PopoverContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PopoverContext = React.createContext<PopoverContextType | undefined>(undefined);

export function Popover({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div ref={containerRef} className="relative inline-block text-left">
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({ render, children, className, ...props }: any) {
  const context = React.useContext(PopoverContext);
  if (!context) throw new Error('PopoverTrigger must be used within Popover');

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    context.setOpen((prev) => !prev);
  };

  if (render && React.isValidElement(render)) {
    return React.cloneElement(render as React.ReactElement<any>, {
      onClick: handleClick,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn('cursor-pointer focus:outline-none', className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function PopoverContent({
  children,
  className,
  align = 'end',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'end' | 'center';
}) {
  const context = React.useContext(PopoverContext);
  if (!context) throw new Error('PopoverContent must be used within Popover');

  if (!context.open) return null;

  const alignStyles =
    align === 'end'
      ? 'right-0'
      : align === 'start'
      ? 'left-0'
      : 'left-1/2 -translate-x-1/2';

  return (
    <div
      className={cn(
        'absolute top-full mt-2 z-50 rounded-xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200',
        alignStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
