'use client';

/**
 * ENTIREFM — PREDICTIVE PROPERTY SEARCH COMBOBOX
 * ==============================================================================
 * Institutional, accessible type-ahead property search component for Log a Job.
 *
 * Privacy & Security Guarantees:
 * - Genuine server-side predictive search (never loads full property register to client)
 * - Zero client/account data exposure (only id, name, and optional postcode displayed)
 * - Strict 2-character debounce threshold to minimize database queries
 * - Full ARIA combobox pattern with keyboard navigation (Up, Down, Enter, Escape)
 * - Dedicated loading, empty ("No authorised properties found"), error, and selected states
 * - Fully aligned with EntireFM Work Sans design system & slate color tokens
 */

import React, { useState, useEffect, useRef, useId, useCallback } from 'react';
import { Search, Building2, X, Loader2, MapPin, AlertCircle } from 'lucide-react';

export interface PropertyOption {
  id: string;
  name: string;
  postcode?: string;
}

interface PropertySearchComboboxProps {
  value: string; // The selected property ID
  selectedProperty?: PropertyOption | null;
  onChange: (property: PropertyOption | null) => void;
  onSelectManualAddress?: () => void;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function PropertySearchCombobox({
  value,
  selectedProperty,
  onChange,
  onSelectManualAddress,
  error,
  disabled = false,
  autoFocus = false,
}: PropertySearchComboboxProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PropertyOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const listboxId = useId();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced search query execution
  const executeSearch = useCallback(async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsLoading(false);
      setFetchError(null);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setFetchError(null);

    try {
      const res = await fetch(`/api/properties/search?q=${encodeURIComponent(trimmed)}&limit=15`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Authentication required');
        }
        if (res.status === 403) {
          throw new Error('You are not authorised to discover client properties.');
        }
        throw new Error('Unable to search properties');
      }

      const payload = await res.json();
      const items: PropertyOption[] = payload.data || [];
      setResults(items);
      setIsOpen(true);
      setFocusedIndex(-1);
    } catch (err: any) {
      console.error('[PROPERTY_SEARCH_ERROR]:', err?.message);
      setFetchError('Unable to search properties. Please try again.');
      setResults([]);
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (newQuery.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceTimerRef.current = setTimeout(() => {
      executeSearch(newQuery);
    }, 280);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (results.length > 0) {
          setIsOpen(true);
        } else if (query.trim().length >= 2) {
          executeSearch(query);
        }
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        setFocusedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      }
      case 'Enter': {
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < results.length) {
          handleSelectProperty(results[focusedIndex]);
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      }
      case 'Tab': {
        setIsOpen(false);
        break;
      }
      default:
        break;
    }
  };

  const handleSelectProperty = (property: PropertyOption) => {
    onChange(property);
    setQuery('');
    setIsOpen(false);
    setResults([]);
    setFocusedIndex(-1);
  };

  const handleClearSelection = () => {
    onChange(null);
    setQuery('');
    setIsOpen(false);
    setResults([]);
    setFocusedIndex(-1);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // STATE 1: PROPERTY IS ALREADY SELECTED (Chip view)
  // ─────────────────────────────────────────────────────────────────────────
  if (value && selectedProperty) {
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-800 block">
          Authorised Property <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center justify-between gap-3 p-2.5 px-3 rounded-sm bg-slate-50 border border-slate-300 text-sm text-slate-900 transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-slate-200 text-slate-700">
              <Building2 className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <span className="font-medium text-slate-900 truncate block text-sm">
                {selectedProperty.name}
              </span>
              {selectedProperty.postcode && (
                <span className="text-xs text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  {selectedProperty.postcode}
                </span>
              )}
            </div>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={handleClearSelection}
              aria-label={`Change property from ${selectedProperty.name}`}
              className="p-1 rounded-sm text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
              title="Change property"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STATE 2: SEARCH / INPUT COMBOBOX
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor="property-search-input"
          className="text-xs font-medium text-slate-800 block"
        >
          Property <span className="text-red-500">*</span>
        </label>
        {onSelectManualAddress && (
          <button
            type="button"
            onClick={onSelectManualAddress}
            className="text-[11.5px] text-slate-500 hover:text-slate-800 underline underline-offset-2 transition-colors"
          >
            Can&apos;t find property? Enter address
          </button>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
          ) : (
            <Search className="h-4 w-4 text-slate-400" />
          )}
        </div>

        <input
          ref={inputRef}
          id="property-search-input"
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            focusedIndex >= 0 ? `property-option-${focusedIndex}` : undefined
          }
          autoComplete="off"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          disabled={disabled}
          autoFocus={autoFocus}
          placeholder="Search property name... (e.g. Bradbury)"
          className={`w-full rounded-sm border bg-white pl-9 pr-8 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-1 ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-400'
              : 'border-slate-300 focus:border-slate-800 focus:ring-slate-800'
          }`}
        />

        {query && !isLoading && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            aria-label="Clear search text"
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-600 font-normal">{error}</p>}

      {/* ── DROPDOWN LISTBOX ── */}
      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-1 w-full bg-white rounded-sm border border-slate-200 shadow-lg max-h-64 overflow-y-auto divide-y divide-slate-100"
        >
          {fetchError ? (
            <div className="p-4 text-center text-xs text-red-700 bg-red-50/50 space-y-1">
              <AlertCircle className="h-4 w-4 text-red-500 mx-auto" />
              <p className="font-medium">Unable to search properties</p>
              <p className="text-slate-500 text-[11px]">Please try again.</p>
            </div>
          ) : results.length > 0 ? (
            results.map((prop, idx) => {
              const isFocused = idx === focusedIndex;
              return (
                <div
                  key={prop.id}
                  id={`property-option-${idx}`}
                  role="option"
                  aria-selected={isFocused}
                  onMouseDown={(e) => {
                    // Prevent blur before selection
                    e.preventDefault();
                    handleSelectProperty(prop);
                  }}
                  onMouseEnter={() => setFocusedIndex(idx)}
                  className={`px-3 py-2.5 cursor-pointer transition-colors flex items-center justify-between gap-3 text-sm ${
                    isFocused
                      ? 'bg-slate-100 text-slate-950 font-medium'
                      : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="truncate">{prop.name}</span>
                  </div>
                  {prop.postcode && (
                    <span className="text-[11px] text-slate-500 font-mono shrink-0 bg-slate-100 px-1.5 py-0.5 rounded">
                      {prop.postcode}
                    </span>
                  )}
                </div>
              );
            })
          ) : query.trim().length >= 2 && !isLoading ? (
            <div className="p-5 text-center text-xs text-slate-600 space-y-1.5">
              <p className="font-medium text-slate-800">No authorised properties found</p>
              <p className="text-slate-500 text-[11px]">
                Try a different property name, or enter your address manually.
              </p>
              {onSelectManualAddress && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onSelectManualAddress();
                  }}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#EA580C] hover:underline font-medium"
                >
                  Enter address manually →
                </button>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
