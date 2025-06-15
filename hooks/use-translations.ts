import { useAppStore } from '@/lib/store';
import enTranslations from '@/public/locales/en/common.json';
import idTranslations from '@/public/locales/id/common.json';

const translations = {
  en: enTranslations,
  id: idTranslations,
};

export function useTranslations() {
  const language = useAppStore((state) => state.language);
  
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return { t, language };
}