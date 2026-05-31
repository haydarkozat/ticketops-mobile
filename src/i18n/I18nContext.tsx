import React, { createContext, useContext, useEffect, useState } from "react";
import * as Localization from "expo-localization";
import { Lang, TranslationKey, translate } from "./translations";
import { KEYS, load, save } from "../storage/persist";

interface I18n {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: TranslationKey | string, params?: Record<string, string | number>) => string;
}

// Cihaz dilini algıla; Türkçe değilse İngilizce'ye düş.
function detectDeviceLang(): Lang {
  try {
    const code = Localization.getLocales()[0]?.languageCode;
    return code === "tr" ? "tr" : "en";
  } catch {
    return "tr";
  }
}

const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectDeviceLang());

  // Kayıtlı dil tercihi varsa onu uygula (cihaz algısını ezer).
  useEffect(() => {
    (async () => {
      const saved = await load<Lang>(KEYS.lang);
      if (saved === "tr" || saved === "en") setLangState(saved);
    })();
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    save(KEYS.lang, l);
  }

  const value: I18n = {
    lang,
    setLang,
    toggle: () => setLang(lang === "tr" ? "en" : "tr"),
    t: (key, params) => translate(lang, key, params),
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n, I18nProvider içinde kullanılmalıdır.");
  return ctx;
}
