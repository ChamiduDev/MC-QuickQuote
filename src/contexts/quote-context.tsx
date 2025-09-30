'use client';

import React, { createContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { QuoteData, LineItem } from '@/lib/types';
import { initialQuote } from '@/lib/initial-quote';
import { nanoid } from 'nanoid';

type Action =
  | { type: 'SET_STATE'; payload: QuoteData }
  | { type: 'UPDATE_FIELD'; payload: { section: keyof QuoteData; field: string; value: any } }
  | { type: 'UPDATE_NESTED_FIELD'; payload: { section: 'company' | 'client' | 'theme'; field: string; value: any } }
  | { type: 'ADD_ITEM'; payload: Partial<LineItem> }
  | { type: 'UPDATE_ITEM'; payload: { id: string; field: keyof LineItem; value: any } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'DUPLICATE_ITEM'; payload: string }
  | { type: 'REORDER_ITEMS'; payload: { startIndex: number; endIndex: number } }
  | { type: 'RESET_QUOTE' };

const quoteReducer = (state: QuoteData, action: Action): QuoteData => {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'UPDATE_FIELD':
      return { ...state, [action.payload.field]: action.payload.value };
    case 'UPDATE_NESTED_FIELD':
      return {
        ...state,
        [action.payload.section]: {
          ...state[action.payload.section],
          [action.payload.field]: action.payload.value,
        },
      };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, { ...action.payload, id: nanoid() } as LineItem] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, [action.payload.field]: action.payload.value } : item
        ),
      };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    case 'DUPLICATE_ITEM': {
      const itemIndex = state.items.findIndex(item => item.id === action.payload);
      if (itemIndex === -1) return state;
      const itemToDuplicate = state.items[itemIndex];
      const newItems = [...state.items];
      newItems.splice(itemIndex + 1, 0, { ...itemToDuplicate, id: nanoid() });
      return { ...state, items: newItems };
    }
    case 'REORDER_ITEMS': {
        const newItems = Array.from(state.items);
        const [removed] = newItems.splice(action.payload.startIndex, 1);
        newItems.splice(action.payload.endIndex, 0, removed);
        return { ...state, items: newItems };
    }
    case 'RESET_QUOTE':
        return initialQuote;
    default:
      return state;
  }
};

export const QuoteContext = createContext<{ state: QuoteData; dispatch: React.Dispatch<Action> } | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'MC QuickQuoteData';

export const QuoteProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(quoteReducer, initialQuote);

  useEffect(() => {
    try {
      const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedState) {
        dispatch({ type: 'SET_STATE', payload: JSON.parse(storedState) });
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [state]);

  return (
    <QuoteContext.Provider value={{ state, dispatch }}>
      {children}
    </QuoteContext.Provider>
  );
};
