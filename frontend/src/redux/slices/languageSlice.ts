// store/slices/languageSlice.js
import { createSlice } from '@reduxjs/toolkit';
import i18n from '../../i18n'; // Import your i18n instance

const initialState = {
  currentLanguage: i18n.language || 'en', // Get initial language from i18n
  availableLanguages: ['en', 'fr', 'es', 'it', 'de'],
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.currentLanguage = action.payload;
      // Also update i18n when Redux changes
      i18n.changeLanguage(action.payload);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;