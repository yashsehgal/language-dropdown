declare type LanguageItemDataType = {
  title: string;
  position: number;
  id?: string;
};
declare interface LanguageItemProps {
  data: LanguageItemDataType;
  languageList?: LanguageItemDataType[];
  setLanguageList?: any;
  placeholderList?: string[];
  setPlaceholderList?: any;
}

declare type RecommendationType = {
  label: string;
  value: string;
};
