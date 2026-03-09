import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import type { IProduct } from '../types';

interface UseLocalizedDescriptionOptions {
  fallbackString?: string;
}

export const useLocalizedDescription = (
  product: IProduct | null | undefined,
  options: UseLocalizedDescriptionOptions = {}
) => {
  const { fallbackString = '' } = options;
  
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);

  const localizedDescription = useMemo(() => {
    // If no product or no description
    if (!product?.description) return fallbackString;

    // If description is already a string (fallback for legacy data)
    if (typeof product.description === 'string') {
      return product.description;
    }

    // If description is an object with language keys
    if (typeof product.description === 'object') {
      // Get description in current language
      const descriptionInCurrentLang = product.description[currentLanguage as keyof typeof product.description];
      
      if (descriptionInCurrentLang) {
        return descriptionInCurrentLang;
      }

      // Fallback to English
      if (product.description.en) {
        return product.description.en;
      }

      // Return any available language as last resort
      const firstAvailableDescription = Object.values(product.description).find(value => value);
      return firstAvailableDescription || fallbackString;
    }

    return fallbackString;
  }, [product, currentLanguage, fallbackString]);

  // useful for showing warnings
  const isCurrentLanguageAvailable = useMemo(() => {
    if (!product?.description) return false;
    if (typeof product.description === 'string') return true;
    return Boolean(product.description[currentLanguage as keyof typeof product.description]);
  }, [product, currentLanguage]);

  return {
    description: localizedDescription,
    isCurrentLanguageAvailable,
    currentLanguage,
  };
};