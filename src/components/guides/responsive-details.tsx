'use client';

import React, { useState, useEffect } from 'react';

export interface ResponsiveDetailsProps extends React.DetailsHTMLAttributes<HTMLDetailsElement> {
  defaultOpenDesktop?: boolean;
  children: React.ReactNode;
}

export function ResponsiveDetails({
  defaultOpenDesktop = false,
  className,
  children,
  ...props
}: ResponsiveDetailsProps) {
  const [isOpen, setIsOpen] = useState(() => {
    if (defaultOpenDesktop && typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return false;
  });

  useEffect(() => {
    if (!defaultOpenDesktop) return;

    const checkWidth = () => {
      setIsOpen(window.innerWidth >= 768);
    };

    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, [defaultOpenDesktop]);

  return (
    <details
      {...props}
      key={isOpen ? 'details-open' : 'details-closed'}
      open={isOpen}
      className={className}
      onToggle={(e) => {
        setIsOpen((e.currentTarget as HTMLDetailsElement).open);
        props.onToggle?.(e);
      }}
    >
      {children}
    </details>
  );
}
