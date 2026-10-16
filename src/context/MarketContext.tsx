'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Market } from '@/lib/constants/regions';

export type { Market } from '@/lib/constants/regions';

export interface MarketContextType {
  market: Market;
  setMarket: (market: Market) => void;
  toggleMarket: () => void;
  isUs: boolean;
}

const STORAGE_KEY = 'toyotawaits_market';
const COOKIE_KEY = 'toyotawaits_market';

export function getClientDetectedMarket(fallback: Market = 'CA'): Market {
  if (typeof window === 'undefined') return fallback;

  try {
    // 1. Check URL query parameter ?market=US or ?market=CA
    const searchParams = new URLSearchParams(window.location.search);
    const param = searchParams.get('market')?.toUpperCase();
    if (param === 'US' || param === 'CA') {
      return param;
    }

    // 2. Check localStorage
    const stored = localStorage.getItem(STORAGE_KEY)?.toUpperCase();
    if (stored === 'US' || stored === 'CA') {
      return stored;
    }

    // 3. Check cookie for SSR / client awareness
    const cookieMatch = document.cookie.match(new RegExp('(?:^|;\\s*)' + COOKIE_KEY + '=([^;]*)'));
    if (cookieMatch) {
      const cookieVal = decodeURIComponent(cookieMatch[1]).toUpperCase();
      if (cookieVal === 'US' || cookieVal === 'CA') {
        return cookieVal;
      }
    }

    // 4. Check domain hostname
    if (window.location.hostname.includes('toyotawaits.com')) {
      return 'US';
    }
  } catch {
    // Fallback if localStorage or cookies are restricted
  }

  return fallback;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({
  children,
  initialMarket = 'CA',
}: {
  children: React.ReactNode;
  initialMarket?: Market;
}) {
  const [market, setMarketState] = useState<Market>(() => getClientDetectedMarket(initialMarket));

  const setMarket = useCallback((newMarket: Market) => {
    setMarketState(newMarket);
    try {
      localStorage.setItem(STORAGE_KEY, newMarket);
      document.cookie = `${COOKIE_KEY}=${newMarket}; path=/; max-age=31536000; SameSite=Lax`;
      window.dispatchEvent(
        new CustomEvent('toyotawaits:market-changed', { detail: { market: newMarket } })
      );
    } catch {
      // Ignore if localStorage / cookies are restricted
    }
  }, []);

  const toggleMarket = useCallback(() => {
    setMarket(market === 'CA' ? 'US' : 'CA');
  }, [market, setMarket]);

  // Synchronize across multiple windows/tabs or external triggers
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'CA' || e.newValue === 'US')) {
        setMarketState(e.newValue);
      }
    };

    const handleCustomSync = (e: Event) => {
      const detail = (e as CustomEvent<{ market?: Market }>).detail;
      if (detail && (detail.market === 'CA' || detail.market === 'US')) {
        setMarketState(detail.market);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('toyotawaits:market-changed', handleCustomSync);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('toyotawaits:market-changed', handleCustomSync);
    };
  }, []);

  return (
    <MarketContext.Provider
      value={{
        market,
        setMarket,
        toggleMarket,
        isUs: market === 'US',
      }}
    >
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket(): MarketContextType {
  const context = useContext(MarketContext);
  if (!context) {
    // Safe standalone fallback if rendered outside MarketProvider
    return {
      market: 'CA',
      setMarket: () => {},
      toggleMarket: () => {},
      isUs: false,
    };
  }
  return context;
}
