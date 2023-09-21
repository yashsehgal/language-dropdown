
declare type LanguageItemDataType = {
  title: string;
  position: number;
};
declare interface LanguageItemProps {
  data: LanguageItemDataType;
  languageList?: LanguageItemDataType[];
  setLanguageList?: any;
};