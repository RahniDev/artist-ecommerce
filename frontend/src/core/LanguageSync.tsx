import { useEffect, type ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '../i18n';
import { setLanguage } from '../redux/slices/languageSlice';
import type { RootState } from '../redux/store';

interface LanguageSyncProps {
  children: ReactNode;
}

const LanguageSync = ({ children }: LanguageSyncProps) => {
  const dispatch = useDispatch();
  const reduxLanguage = useSelector((state: RootState) => state.language.currentLanguage);

  // Sync i18n -> Redux when language changes externally (browser detector)
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      if (lng !== reduxLanguage) {
        dispatch(setLanguage(lng));
      }
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [dispatch, reduxLanguage]);

  // Sync Redux -> i18n (when changed via our actions)
  useEffect(() => {
    if (i18n.language !== reduxLanguage) {
      i18n.changeLanguage(reduxLanguage);
    }
  }, [reduxLanguage]);

  return children;
};

export default LanguageSync;