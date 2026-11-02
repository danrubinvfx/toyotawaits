'use client';

import { useCallback } from 'react';
import type { MobileDeepLinkTargets } from '@/lib/gear/affiliate';

/**
 * Client-Side Safe Intent Dispatcher
 * Triggers native Amazon Shopping app on iOS and Android while falling back safely
 * to mobile web without showing broken alert dialogs on iOS.
 */
export function handleAmazonNavigation(e: any, targets: any) {
  if (typeof window === 'undefined') return;
  const ua = navigator.userAgent || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  const isAndroid = /android/i.test(ua);
  if (!isIOS && !isAndroid) {
    return;
  }
  if (e && typeof e.preventDefault === 'function') {
    e.preventDefault();
  }
  if (isAndroid) {
    window.location.href = targets.androidIntentUrl;
    return;
  }
  if (isIOS) {
    const start = Date.now();
    window.location.href = targets.iosSchemeUrl;
    setTimeout(() => {
      if (Date.now() - start < 1500 && document.hasFocus()) {
        window.open(targets.webUrl, '_blank', 'noopener,noreferrer');
      }
    }, 1200);
  }
}

export function useAmazonRedirect() {
  const navigate = useCallback(
    (e: any, targets: MobileDeepLinkTargets) => {
      handleAmazonNavigation(e, targets);
    },
    []
  );

  return { handleAmazonNavigation: navigate };
}

export default handleAmazonNavigation;
