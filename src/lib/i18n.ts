import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Translations {
  en: any;
  pt: any;
}

interface I18nStore {
  lang: 'en' | 'pt';
  translations: Translations | null;
  setLang: (lang: 'en' | 'pt') => void;
  t: (key: string) => any;
}

export const useI18n = create<I18nStore>()(
  persist(
    (set, get) => ({
      lang: 'en',
      translations: null,
      setLang: (lang) => set({ lang }),
      t: (key: string) => {
        const { translations, lang } = get();
        if (!translations) return key;
        
        const keys = key.split('.');
        let value: any = translations[lang];
        
        for (const k of keys) {
          if (value && typeof value === 'object') {
            value = value[k];
          } else {
            return key;
          }
        }
        
        return value || key;
      },
    }),
    {
      name: 'voucherhub-lang',
    }
  )
);

export async function loadTranslations() {
  try {
    const response = await fetch('/data/translations.json');
    const translations = await response.json();
    useI18n.setState({ translations });
  } catch (error) {
    console.error('Failed to load translations:', error);
  }
}