'use client';

import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          'error-callback'?: (errorCode: string) => void;
          'expired-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact' | 'flexible';
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
    onTurnstileLoaded?: () => void;
  }
}

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (error: string) => void;
  theme?: 'light' | 'dark' | 'auto';
}

export function TurnstileWidget({
  onVerify,
  onExpire,
  onError,
  theme = 'light',
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    // If no site key is configured (local dev mode), auto-verify with a mock token
    if (!siteKey) {
      onVerify('dev-bypass-token');
      return;
    }

    // Check if script is already present
    const existingScript = document.getElementById('cf-turnstile-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'cf-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => setScriptLoaded(true);
      document.head.appendChild(script);
    } else if (window.turnstile) {
      setScriptLoaded(true);
    } else {
      existingScript.addEventListener('load', () => setScriptLoaded(true));
    }
  }, [siteKey, onVerify]);

  useEffect(() => {
    if (!scriptLoaded || !siteKey || !containerRef.current || !window.turnstile) {
      return;
    }

    // Render Turnstile
    try {
      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme,
        callback: (token: string) => {
          onVerify(token);
        },
        'expired-callback': () => {
          if (onExpire) onExpire();
        },
        'error-callback': (err: string) => {
          if (onError) onError(err);
        },
      });
    } catch (err) {
      console.warn('[TURNSTILE] Failed to initialize widget:', err);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // Ignore cleanup errors
        }
        widgetIdRef.current = null;
      }
    };
  }, [scriptLoaded, siteKey, theme, onVerify, onExpire, onError]);

  // If no site key is configured in dev mode, show a discreet indicator
  if (!siteKey) {
    if (process.env.NODE_ENV !== 'production') {
      return (
        <div className="text-[11px] text-neutral-400 font-extralight py-1 flex items-center gap-1.5 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Bot protection simulated (local development)</span>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="my-2 min-h-[65px] flex items-center justify-start">
      <div ref={containerRef} />
    </div>
  );
}
