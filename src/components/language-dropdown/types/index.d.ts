import { ReactNode } from "react";

declare interface LanguageItemProps extends React.HTMLAttributes<HTMLDivElement> {
  state: "No-language" | "Add-language" | "Language";
  languageData?: {
    title?: string;
    rank?: number;
    leadingIcon?: ReactNode;
  }
};