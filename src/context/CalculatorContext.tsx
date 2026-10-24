'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import {
  modelSlugToPresetId,
  presetIdToModelSlug,
  presetIdToModelName,
  resolveTrackerContextModel,
} from '@/lib/calculator-model-helpers';

export interface CalculatorContextValue {
  activeModelSlug: string;
  activeModelName: string;
  activePresetId: string;
  isPhev: boolean;
  setActivePresetId: (presetId: string) => void;
  setActiveModelSlug: (modelSlug: string) => void;
}

const CalculatorContext = createContext<CalculatorContextValue | null>(null);

function SearchParamsListener({ onParam }: { onParam: (model: string | null) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams) {
      onParam(searchParams.get('model'));
    }
  }, [searchParams, onParam]);
  return null;
}

export interface CalculatorProviderProps {
  children: React.ReactNode;
  initialPresetId?: string;
  initialModelSlug?: string;
}

export function CalculatorProvider({
  children,
  initialPresetId,
  initialModelSlug,
}: CalculatorProviderProps) {
  const pathname = usePathname();

  // Resolve initial preset
  const resolveInitialPreset = (): string => {
    // 1. Explicit props
    if (initialPresetId) return initialPresetId;
    if (initialModelSlug) {
      const fromSlug = modelSlugToPresetId(initialModelSlug);
      if (fromSlug) return fromSlug;
    }

    // 2. Pathname e.g. /calculator/sienna-hybrid
    if (pathname) {
      const pathSegments = pathname.split('/').filter(Boolean);
      const lastSeg = pathSegments[pathSegments.length - 1];
      if (lastSeg && lastSeg !== 'calculator') {
        const fromPath = modelSlugToPresetId(lastSeg);
        if (fromPath) return fromPath;
      }
    }

    // 3. Local storage / tracker context
    const trackedModel = resolveTrackerContextModel();
    if (trackedModel) {
      const fromTracker = modelSlugToPresetId(trackedModel);
      if (fromTracker) return fromTracker;
    }

    // 4. Default
    return '2026-toyota-rav4-hybrid';
  };

  const [activePresetId, setActivePresetIdState] = useState<string>(resolveInitialPreset);

  const handleSearchParamModel = useCallback((paramModel: string | null) => {
    if (paramModel) {
      const fromParam = modelSlugToPresetId(paramModel);
      if (fromParam) {
        setActivePresetIdState(fromParam);
      }
    }
  }, []);

  // Sync if initial props change
  useEffect(() => {
    if (initialPresetId) {
      setActivePresetIdState(initialPresetId);
    } else if (initialModelSlug) {
      const fromSlug = modelSlugToPresetId(initialModelSlug);
      if (fromSlug) {
        setActivePresetIdState(fromSlug);
      }
    }
  }, [initialPresetId, initialModelSlug]);

  const activeModelSlug = useMemo(() => presetIdToModelSlug(activePresetId), [activePresetId]);
  const activeModelName = useMemo(() => presetIdToModelName(activePresetId), [activePresetId]);
  const isPhev = useMemo(
    () => activePresetId.toLowerCase().includes('phev') || activePresetId.toLowerCase().includes('prime'),
    [activePresetId]
  );

  const setActivePresetId = useCallback((presetId: string) => {
    setActivePresetIdState(presetId);
    if (typeof window !== 'undefined') {
      const slug = presetIdToModelSlug(presetId);
      window.dispatchEvent(
        new CustomEvent('toyotawait:model-change', {
          detail: { model: slug, presetId },
        })
      );
    }
  }, []);

  const setActiveModelSlug = useCallback((slug: string) => {
    const preset = modelSlugToPresetId(slug);
    if (preset) {
      setActivePresetId(preset);
    }
  }, [setActivePresetId]);

  const value = useMemo(
    () => ({
      activeModelSlug,
      activeModelName,
      activePresetId,
      isPhev,
      setActivePresetId,
      setActiveModelSlug,
    }),
    [activeModelSlug, activeModelName, activePresetId, isPhev, setActivePresetId, setActiveModelSlug]
  );

  return (
    <CalculatorContext.Provider value={value}>
      <Suspense fallback={null}>
        <SearchParamsListener onParam={handleSearchParamModel} />
      </Suspense>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculatorContext(): CalculatorContextValue | null {
  return useContext(CalculatorContext);
}
