'use client';

import React from 'react';
import { CalculatorGearCards } from '@/components/gear/CalculatorGearCards';

export interface RecommendedProductsSectionProps {
  className?: string;
}

export function RecommendedProductsSection({ className }: RecommendedProductsSectionProps) {
  return <CalculatorGearCards className={className} />;
}
