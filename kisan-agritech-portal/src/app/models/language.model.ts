export type SupportedLanguage = 
  | 'en' | 'hi' | 'or' | 'bn' | 'te' 
  | 'ta' | 'mr' | 'gu' | 'kn' | 'ml' 
  | 'pa' | 'as';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  state: string;
}