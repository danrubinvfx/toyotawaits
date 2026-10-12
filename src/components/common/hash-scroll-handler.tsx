'use client';

import { useEffect } from 'react';

export function HashScrollHandler() {
  useEffect(() => {
    const scrollToHash = () => {
      if (typeof window !== 'undefined' && window.location.hash) {
        const targetId = window.location.hash.replace('#', '');
        const elem = document.getElementById(targetId);
        if (elem) {
          setTimeout(() => {
            elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 150);
        }
      }
    };

    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => {
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, []);

  return null;
}

export default HashScrollHandler;
