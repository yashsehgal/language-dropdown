declare type LanguageItemDataType = {
  title: string;
  position: number;
  id?: string;
};
declare interface LanguageItemProps {
  data: LanguageItemDataType;
  languageList?: LanguageItemDataType[];
  setLanguageList?: any;
}

declare type LanguageRecommendationType = {
  value: string;
  label: string;
};
